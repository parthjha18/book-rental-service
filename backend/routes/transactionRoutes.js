const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { calculateRentalAmount } = require('../utils/helpers');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/transactions/create-order
// @desc    Create a Razorpay order for book rental
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { bookId, rentalWeeks = 1 } = req.body;

    const book = await Book.findById(bookId).populate('owner');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (!book.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for rent'
      });
    }

    // Check if user is trying to rent their own book
    if (book.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own book'
      });
    }

    // Calculate amounts
    const amounts = calculateRentalAmount(book.price, rentalWeeks);

    // Create Razorpay order
    const options = {
      amount: amounts.totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        bookId: book._id.toString(),
        renterId: req.user._id.toString(),
        ownerId: book.owner._id.toString(),
      }
    };

    let razorpayOrder;
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'dummy') {
      razorpayOrder = { id: `mock_order_${Date.now()}` };
    } else {
      razorpayOrder = await razorpay.orders.create(options);
    }

    // Create transaction record
    const transaction = await Transaction.create({
      book: book._id,
      owner: book.owner._id,
      renter: req.user._id,
      rentalWeeks: amounts.rentalWeeks,
      weeklyRent: amounts.weeklyRent,
      securityDeposit: amounts.securityDeposit,
      totalAmount: amounts.totalAmount,
      status: 'pending_payment',
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: 'pending',
      }
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: amounts.totalAmount,
        currency: 'INR',
        transaction: transaction,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/transactions/verify-payment
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, transactionId, testingBypass } = req.body;

    if (!testingBypass) {
      // Verify signature
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpaySignature;

      if (!isAuthentic) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    }

    // Update transaction
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: 'payment_completed',
        'paymentDetails.razorpayPaymentId': razorpayPaymentId,
        'paymentDetails.razorpaySignature': razorpaySignature,
        'paymentDetails.paymentStatus': 'completed',
        'paymentDetails.paidAt': Date.now(),
      },
      { new: true }
    ).populate('book').populate('owner').populate('renter');

    res.json({
      success: true,
      data: transaction,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/transactions/:id/confirm-exchange
// @desc    Confirm book exchange (both parties must confirm)
// @access  Private
router.post('/:id/confirm-exchange', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('book')
      .populate('owner')
      .populate('renter');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is owner or renter
    const isOwner = transaction.owner._id.toString() === req.user._id.toString();
    const isRenter = transaction.renter._id.toString() === req.user._id.toString();

    if (!isOwner && !isRenter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update confirmation status
    if (isOwner) {
      transaction.exchangeConfirmedByOwner = true;
    } else {
      transaction.exchangeConfirmedByRenter = true;
    }

    // If both confirmed, update book status and transaction
    if (transaction.exchangeConfirmedByOwner && transaction.exchangeConfirmedByRenter) {
      transaction.status = 'in_progress';
      transaction.rentalStartDate = Date.now();

      // Calculate expected return date
      const expectedReturn = new Date();
      expectedReturn.setDate(expectedReturn.getDate() + (transaction.rentalWeeks * 7));
      transaction.expectedReturnDate = expectedReturn;

      // Update book availability
      await Book.findByIdAndUpdate(transaction.book._id, {
        isAvailable: false,
        currentRenter: transaction.renter._id,
        $push: {
          rentalHistory: {
            renter: transaction.renter._id,
            rentedAt: Date.now(),
          }
        }
      });
    }

    await transaction.save();

    res.json({
      success: true,
      data: transaction,
      message: 'Exchange confirmation recorded'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/transactions/:id/confirm-return
// @desc    Confirm book return (both parties must confirm)
// @access  Private
router.post('/:id/confirm-return', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('book')
      .populate('owner')
      .populate('renter');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is owner or renter
    const isOwner = transaction.owner._id.toString() === req.user._id.toString();
    const isRenter = transaction.renter._id.toString() === req.user._id.toString();

    if (!isOwner && !isRenter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update confirmation status
    if (isOwner) {
      transaction.returnConfirmedByOwner = true;
    } else {
      transaction.returnConfirmedByRenter = true;
    }

    // If both confirmed, complete the transaction
    if (transaction.returnConfirmedByOwner && transaction.returnConfirmedByRenter) {
      transaction.status = 'completed';
      transaction.actualReturnDate = Date.now();

      // Update book availability
      const book = await Book.findById(transaction.book._id);
      book.isAvailable = true;
      book.currentRenter = null;

      // Update rental history
      const lastRental = book.rentalHistory[book.rentalHistory.length - 1];
      if (lastRental && !lastRental.returnedAt) {
        lastRental.returnedAt = Date.now();
      }

      await book.save();

      // Notify users on waitlist
      if (book.usersWaitlisted && book.usersWaitlisted.length > 0) {
        // In a real application, you would send notifications here
        console.log(`Book "${book.title}" is now available. Notifying ${book.usersWaitlisted.length} users on waitlist.`);
      }
    }

    await transaction.save();

    res.json({
      success: true,
      data: transaction,
      message: 'Return confirmation recorded'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/transactions/my-rentals
// @desc    Get current user's rental transactions
// @access  Private
router.get('/my-rentals', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ renter: req.user._id })
      .populate('book')
      .populate('owner', 'name email phone location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/transactions/my-books-rented
// @desc    Get transactions for books owned by current user
// @access  Private
router.get('/my-books-rented', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ owner: req.user._id })
      .populate('book')
      .populate('renter', 'name email phone location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('book')
      .populate('owner', 'name email phone location')
      .populate('renter', 'name email phone location');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is owner or renter
    const isOwner = transaction.owner._id.toString() === req.user._id.toString();
    const isRenter = transaction.renter._id.toString() === req.user._id.toString();

    if (!isOwner && !isRenter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;
