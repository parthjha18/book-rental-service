const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    const completedTransactions = await Transaction.find({ 
      status: { $in: ['completed', 'in_progress', 'payment_completed'] }
    });
    
    let totalRevenue = 0;
    completedTransactions.forEach(t => {
      // Assuming platform takes 10% fee
      totalRevenue += (t.totalAmount || 0) * 0.10;
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalTransactions,
        totalRevenue: Math.round(totalRevenue)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
