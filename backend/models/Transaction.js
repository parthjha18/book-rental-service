const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rentalWeeks: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  weeklyRent: {
    type: Number,
    required: true,
    default: 40,
  },
  securityDeposit: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending_payment', 'payment_completed', 'book_exchanged', 'in_progress', 'returned', 'completed', 'cancelled'],
    default: 'pending_payment',
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paidAt: Date,
  },
  rentalStartDate: {
    type: Date,
  },
  expectedReturnDate: {
    type: Date,
  },
  actualReturnDate: {
    type: Date,
  },
  exchangeConfirmedByOwner: {
    type: Boolean,
    default: false,
  },
  exchangeConfirmedByRenter: {
    type: Boolean,
    default: false,
  },
  returnConfirmedByOwner: {
    type: Boolean,
    default: false,
  },
  returnConfirmedByRenter: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
