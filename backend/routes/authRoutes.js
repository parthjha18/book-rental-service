const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  sendOtp,
  register,
  login,
  getMe,
  updateLocation,
  uploadAvatar,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// ─── Multer config for avatar uploads ───────────────────────────────────────
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
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
const registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('email').isEmail().withMessage('Valid email is required'),
];

const resetPasswordRules = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────
router.post('/send-otp', sendOtp);
router.post('/register', registerRules, validate, register);
router.post('/login',    loginRules,    validate, login);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password',  resetPasswordRules,  validate, resetPassword);
router.get('/me', protect, getMe);
router.put('/update-location', protect, updateLocation);
router.post('/upload-avatar',  protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
