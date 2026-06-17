const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getOrderStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Create order validation
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('يجب أن يحتوي الطلب على منتج واحد على الأقل'),
  body('items.*.productId')
    .notEmpty()
    .withMessage('معرّف المنتج مطلوب')
    .isMongoId()
    .withMessage('معرّف المنتج غير صالح'),
  body('items.*.qty')
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون 1 على الأقل'),
  body('shippingAddress.address')
    .notEmpty()
    .withMessage('عنوان التوصيل مطلوب'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('المدينة مطلوبة'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('طريقة الدفع مطلوبة')
    .isIn(['cod', 'card', 'apple', 'tabby', 'tamara'])
    .withMessage('طريقة الدفع غير صالحة'),
];

router.post('/', createOrderValidation, createOrder);
router.get('/', getMyOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
