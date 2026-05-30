const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');

// Configure Nodemailer (singleton-style — reused across requests)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Generate and send Email OTP
// @access  Public
const sendOtp = async (req, res) => {
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (override existing if any)
    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send Email using Nodemailer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: `"BookShare" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your BookShare Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #f97316; text-align: center;">Welcome to BookShare!</h2>
            <p>Hi there,</p>
            <p>Thank you for joining our community of book lovers. Please use the following One-Time Password (OTP) to complete your registration:</p>
            <div style="background: #fdf2f7; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f97316; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="text-align: center; color: #999; font-size: 12px;">© 2026 BookShare. Keep Reading!</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP Email sent to ${email}`);
      return res.status(200).json({ success: true, message: 'OTP sent to your email. Please check your inbox (and spam).' });
    } else {
      // Fallback for Local Development
      console.log(`\n\n💬 ============================`);
      console.log(`📧 MOCK EMAIL TO ${email}`);
      console.log(`🔑 YOUR VERIFICATION OTP IS: ${otp}`);
      console.log(`============================\n\n`);
      return res.status(200).json({ success: true, message: 'Development Mode: OTP logged in backend terminal.' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
};

// @desc    Register a new user
// @access  Public
const register = async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    const { name, email, password, phone, location, otp, avatar } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'Please provide the OTP' });
    }

    // Verify OTP
    const validOtp = await Otp.findOne({ phone, otp });
    if (!validOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Validate location data
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid location coordinates [longitude, latitude]',
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
        coordinates: location.coordinates,
        address: location.address,
        city: location.city,
        pincode: location.pincode,
      },
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
        message: 'User registered successfully',
      });

      // Delete used OTP
      await Otp.deleteOne({ phone });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Login user
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
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
      message: 'Login successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get current user profile
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('booksOwned').populate('wishlist');
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update user location
// @access  Private
const updateLocation = async (req, res) => {
  try {
    const { coordinates, address, city, pincode } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid coordinates [longitude, latitude]',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { location: { type: 'Point', coordinates, address, city, pincode } },
      { new: true }
    );

    res.json({ success: true, data: user, message: 'Location updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Upload user avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });

    res.json({ success: true, data: user, message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Forgot password - Request password reset token
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with this email' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time to 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const host = req.get('host');
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const frontendUrl = isLocalhost ? 'http://localhost:3000' : `${req.protocol}://${host}`;
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #f97316; text-align: center;">Reset Your BookShare Password</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. Click the button below to choose a new password. This link is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px;">If the button doesn't work, you can also copy and paste the link below into your browser:</p>
        <p style="word-break: break-all; color: #f97316; font-size: 14px;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">If you didn't request this password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="text-align: center; color: #999; font-size: 12px;">© 2026 BookShare. Keep Reading!</p>
      </div>
    `;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: `"BookShare" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'BookShare Password Reset Request',
        html: mailHtml,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${user.email}`);

      // Write reset link to a debug file for testing/retrieval
      const fs = require('fs');
      const debugFilePath = path.join(__dirname, '../reset_link_debug.txt');
      fs.writeFileSync(debugFilePath, resetUrl);
      console.log(`📝 Debug reset link written to: ${debugFilePath}`);

      return res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
    } else {
      // Fallback for Local Development
      console.log(`\n\n💬 ============================`);
      console.log(`📧 MOCK EMAIL TO ${user.email}`);
      console.log(`🔗 RESET PASSWORD LINK IS: ${resetUrl}`);
      console.log(`============================\n\n`);
      return res.status(200).json({ success: true, message: 'Development Mode: Reset link logged in backend terminal.' });
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ success: false, message: 'Failed to send password reset email' });
  }
};

// @desc    Reset password using token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Hash token to compare with DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Set new password (the pre-save hook will hash this)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

module.exports = {
  sendOtp,
  register,
  login,
  getMe,
  updateLocation,
  uploadAvatar,
  forgotPassword,
  resetPassword,
};
