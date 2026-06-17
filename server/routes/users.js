const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  updatePassword,
  getWishlist,
  toggleWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile
router.get('/profile', getProfile);

router.put(
  '/profile',
  [
    body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('الاسم الأول لا يمكن أن يكون فارغاً')
      .isLength({ max: 50 })
      .withMessage('الاسم الأول لا يتجاوز 50 حرفاً'),
    body('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('اسم العائلة لا يمكن أن يكون فارغاً')
      .isLength({ max: 50 })
      .withMessage('اسم العائلة لا يتجاوز 50 حرفاً'),
    body('phone')
      .optional()
      .isMobilePhone('ar-SA')
      .withMessage('يرجى إدخال رقم هاتف سعودي صالح'),
    body('gender')
      .optional()
      .isIn(['male', 'female'])
      .withMessage('الجنس يجب أن يكون male أو female'),
    body('birthday')
      .optional()
      .isISO8601()
      .withMessage('تاريخ الميلاد غير صالح'),
  ],
  updateProfile
);

// Password
router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),
    body('newPassword')
      .notEmpty()
      .withMessage('كلمة المرور الجديدة مطلوبة')
      .isLength({ min: 6 })
      .withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'),
  ],
  updatePassword
);

// Wishlist
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);
router.delete('/wishlist/:productId', toggleWishlist);

// Addresses
router.get('/addresses', getAddresses);

router.post(
  '/addresses',
  [
    body('name').notEmpty().withMessage('الاسم مطلوب'),
    body('phone').notEmpty().withMessage('رقم الهاتف مطلوب'),
    body('address').notEmpty().withMessage('العنوان التفصيلي مطلوب'),
    body('city').notEmpty().withMessage('المدينة مطلوبة'),
  ],
  addAddress
);

router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

module.exports = router;
