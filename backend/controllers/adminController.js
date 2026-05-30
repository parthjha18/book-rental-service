const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard statistics
// @access  Private/Admin
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const completedTransactions = await Transaction.find({
      status: { $in: ['completed', 'in_progress', 'payment_completed'] },
    });

    let totalRevenue = 0;
    completedTransactions.forEach((t) => {
      // Platform takes 10% fee
      totalRevenue += (t.totalAmount || 0) * 0.1;
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalTransactions,
        totalRevenue: Math.round(totalRevenue),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a user
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getDashboard, getUsers, deleteUser };
