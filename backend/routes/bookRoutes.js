const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createBook,
  getBooks,
  getNearbyBooks,
  getMyBooks,
  getBook,
  updateBook,
  deleteBook,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/bookController');

const router = express.Router();

// ─── Multer config for book cover uploads ────────────────────────────────────
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/book-covers/'); },
  filename(req, file, cb) {
    cb(null, `book-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5_000_000 },
  fileFilter(req, file, cb) {
    const ok = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase()) &&
               /jpeg|jpg|png|webp/.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Images only!'));
  },
});

// ─── Validation chains ───────────────────────────────────────────────────────
const createBookRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number').bail()
    .custom((v) => Number(v) >= 0).withMessage('Price must be non-negative'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('condition')
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Condition must be one of: New, Like New, Good, Fair, Poor'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────
// Important: specific paths before parameterised ones to avoid route shadowing
router.get('/nearby',         protect, getNearbyBooks);
router.get('/user/my-books',  protect, getMyBooks);

router.get('/',  getBooks);
router.post('/', protect, upload.single('coverImage'), createBookRules, validate, createBook);

router.get('/:id',    getBook);
router.put('/:id',    protect, updateBook);
router.delete('/:id', protect, deleteBook);

router.post('/:id/wishlist',   protect, addToWishlist);
router.delete('/:id/wishlist', protect, removeFromWishlist);

module.exports = router;
