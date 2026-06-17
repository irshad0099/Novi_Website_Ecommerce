const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, logout, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('الاسم الأول مطلوب')
    .isLength({ max: 50 })
    .withMessage('الاسم الأول لا يتجاوز 50 حرفاً'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('اسم العائلة مطلوب')
    .isLength({ max: 50 })
    .withMessage('اسم العائلة لا يتجاوز 50 حرفاً'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .withMessage('يرجى إدخال بريد إلكتروني صالح')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),

  body('phone')
    .optional()
    .isMobilePhone('ar-SA')
    .withMessage('يرجى إدخال رقم هاتف سعودي صالح'),
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .withMessage('يرجى إدخال بريد إلكتروني صالح')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);

module.exports = router;
