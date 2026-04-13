const express = require('express');
const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure Multer for local avatar uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

// @route   POST /api/auth/send-otp
// @desc    Generate and send SMS OTP
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { phone, email } = req.body;
    
    if (!phone || !email) {
      return res.status(400).json({ success: false, message: 'Phone and email are required to send OTP' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (override existing if any)
    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // TODO: Integrate actual SMS service like Twilio or Fast2SMS here.
    // For local development, we'll log the OTP to the console.
    console.log(`\n\n💬 ============================`);
    console.log(`📱 MOCK SMS TO ${phone}`);
    console.log(`🔑 YOUR VERIFICATION OTP IS: ${otp}`);
    console.log(`============================\n\n`);

    res.status(200).json({ success: true, message: 'OTP sent successfully. Check your terminal/messages.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    const { name, email, password, phone, location, otp, avatar } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'Please provide the OTP sent to your phone' });
    }

    // Verify OTP
    const validOtp = await Otp.findOne({ phone, otp });
    if (!validOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate location data
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid location coordinates [longitude, latitude]'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      avatar,
      location: {
        type: 'Point',
        coordinates: location.coordinates, // [longitude, latitude]
        address: location.address,
        city: location.city,
        pincode: location.pincode,
      }
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          location: user.location,
          role: user.role,
          token: generateToken(user._id),
        },
        message: 'User registered successfully'
      });
      
      // Delete used OTP
      await Otp.deleteOne({ phone });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        location: user.location,
        role: user.role,
        token: generateToken(user._id),
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('booksOwned')
      .populate('wishlist');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   PUT /api/auth/update-location
// @desc    Update user location
// @access  Private
router.put('/update-location', protect, async (req, res) => {
  try {
    const { coordinates, address, city, pincode } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid coordinates [longitude, latitude]'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          type: 'Point',
          coordinates,
          address,
          city,
          pincode,
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/auth/upload-avatar
// @desc    Upload user avatar
// @access  Private
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile picture updated successfully'
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
