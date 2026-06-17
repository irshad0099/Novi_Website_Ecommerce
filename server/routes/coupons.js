const express = require('express');
const { validateCoupon } = require('../controllers/couponController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/coupons/validate — optionalAuth allows both guests and logged-in users
router.post('/validate', optionalAuth, validateCoupon);

module.exports = router;
