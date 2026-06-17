const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — required authentication middleware
 * Extracts Bearer token from Authorization header, verifies it, attaches user to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح — يرجى تسجيل الدخول',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'انتهت صلاحية الجلسة — يرجى تسجيل الدخول مرة أخرى',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'رمز غير صالح — يرجى تسجيل الدخول',
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب موقوف — يرجى التواصل مع الدعم',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * optionalAuth — optional authentication middleware
 * If a valid Bearer token is present, attaches user to req.user; otherwise continues without user
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      req.user = user || null;
    } catch {
      req.user = null;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * authorize — role-based access control middleware
 * Usage: authorize('admin') or authorize('admin', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح — يرجى تسجيل الدخول',
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية للوصول إلى هذا المورد',
      });
    }
    next();
  };
};

module.exports = { protect, optionalAuth, authorize };
