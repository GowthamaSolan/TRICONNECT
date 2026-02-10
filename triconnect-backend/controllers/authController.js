const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const path = require('path');
const fs = require('fs');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// User Sign Up
const userSignUp = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: 'user',
    });

    await user.save();

    // Notifications logic
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
      console.log("Email sent successfully");

      await smsService.sendSMS(user.phone, `Hi ${user.name}, Welcome to TriConnect!`);
      console.log("SMS sent successfully");
    } catch (notifError) {
      console.log("Notification Logic Error:", notifError.message);
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Sign In
const userSignIn = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { name: emailOrUsername }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Sign in successful',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ message: 'Google ID and email are required' });
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        name: name || email.split('@')[0],
        email,
        googleId,
        phone: '',
        password: 'google-oauth',
        isVerified: true,
      });
      await user.save();
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Sign Up
const adminSignUp = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, sector } = req.body;

    if (!name || !email || !phone || !password || !sector) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      role: 'admin',
      sector,
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Admin sign up error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: user.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (req.file) {
      if (user.profileImage) {
        try {
          const oldPath = path.join(__dirname, '..', user.profileImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.warn('Failed to remove old profile image:', err.message);
        }
      }
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    if (req.body.theme) {
      user.theme = req.body.theme === 'dark' ? 'dark' : 'light';
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated', user: user.getPublicProfile() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  googleLogin,
  adminSignUp,
  getCurrentUser,
  updateProfile,
};