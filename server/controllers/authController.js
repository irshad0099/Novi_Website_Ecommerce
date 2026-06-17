const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Helper: create JWT tokens and send response
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Access token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  // Refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );

  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    avatar: user.avatar || null,
    phone: user.phone || null,
  };

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user: userData,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'البريد الإلكتروني مسجّل مسبقاً',
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || undefined,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب موقوف — يرجى التواصل مع الدعم',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('wishlist', 'slug name nameEn price images rating');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Clear cookie if httpOnly cookie auth is used
    if (res.cookie) {
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'رمز التحديث مطلوب',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'انتهت صلاحية رمز التحديث — يرجى تسجيل الدخول مرة أخرى',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'رمز التحديث غير صالح',
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود أو الحساب موقوف',
      });
    }

    // Issue new access token only
    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, logout, refreshToken };
