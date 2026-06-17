const Coupon = require('../models/Coupon');

/**
 * @desc    Validate a coupon code
 * @route   POST /api/coupons/validate
 * @access  Public (optional auth)
 */
const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'يرجى إدخال كود الخصم',
      });
    }

    const orderTotal = parseFloat(orderAmount) || 0;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
    });

    // Coupon not found
    if (!coupon) {
      return res.status(200).json({
        success: true,
        valid: false,
        message: 'كود الخصم غير صالح',
      });
    }

    // Coupon inactive
    if (!coupon.isActive) {
      return res.status(200).json({
        success: true,
        valid: false,
        message: 'كود الخصم غير نشط',
      });
    }

    // Coupon expired
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(200).json({
        success: true,
        valid: false,
        message: 'انتهت صلاحية كود الخصم',
      });
    }

    // Max uses exceeded
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return res.status(200).json({
        success: true,
        valid: false,
        message: 'تم استنفاد الحد الأقصى لاستخدامات هذا الكود',
      });
    }

    // Check if user already used this coupon (if authenticated and single-use per user)
    if (req.user && coupon.usedBy && coupon.usedBy.includes(req.user._id)) {
      return res.status(200).json({
        success: true,
        valid: false,
        message: 'لقد استخدمت هذا الكود مسبقاً',
      });
    }

    // Check minimum order amount
    if (orderTotal > 0 && orderTotal < coupon.minOrderAmount) {
      return res.status(200).json({
        success: true,
        valid: false,
        message: `الحد الأدنى للطلب لاستخدام هذا الكود هو ${coupon.minOrderAmount} ريال`,
      });
    }

    // Calculate discount amount for preview
    let discountAmount = 0;
    if (orderTotal > 0) {
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((orderTotal * coupon.discountValue) / 100 * 100) / 100;
      } else {
        discountAmount = Math.min(coupon.discountValue, orderTotal);
      }
    }

    res.status(200).json({
      success: true,
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      minOrderAmount: coupon.minOrderAmount,
      message:
        coupon.discountType === 'percentage'
          ? `تم تطبيق خصم ${coupon.discountValue}٪ بنجاح`
          : `تم تطبيق خصم ${coupon.discountValue} ريال بنجاح`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { validateCoupon };
