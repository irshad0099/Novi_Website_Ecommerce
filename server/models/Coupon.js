const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'كود الخصم مطلوب'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'كود الخصم لا يتجاوز 20 حرفاً'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'قيمة الخصم مطلوبة'],
      min: [0, 'قيمة الخصم لا يمكن أن تكون سالبة'],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUses: {
      type: Number,
      default: 0, // 0 = unlimited
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate percentage does not exceed 100
couponSchema.pre('save', function (next) {
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    return next(new Error('نسبة الخصم لا يمكن أن تتجاوز 100٪'));
  }
  next();
});

// Indexes (code is already unique above)
couponSchema.index({ isActive: 1, expiresAt: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
