const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createOrder,
  verifyPayment,
  confirmExchange,
  confirmReturn,
  getMyRentals,
  getMyBooksRented,
  getTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

// ─── Validation chains ───────────────────────────────────────────────────────
const createOrderRules = [
  body('bookId')
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Book ID must be a valid MongoDB ObjectId'),
  body('rentalWeeks')
    .isInt({ min: 1, max: 52 })
    .withMessage('Rental weeks must be an integer between 1 and 52'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────
// Static paths before parameterised ones
router.get('/my-rentals',      protect, getMyRentals);
router.get('/my-books-rented', protect, getMyBooksRented);

router.post('/create-order',  protect, createOrderRules, validate, createOrder);
router.post('/verify-payment', protect, verifyPayment);

router.post('/:id/confirm-exchange', protect, confirmExchange);
router.post('/:id/confirm-return',   protect, confirmReturn);
router.get('/:id', protect, getTransaction);

module.exports = router;
