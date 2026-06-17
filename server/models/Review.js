const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'المنتج مطلوب'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستخدم مطلوب'],
    },
    rating: {
      type: Number,
      required: [true, 'التقييم مطلوب'],
      min: [1, 'أدنى تقييم هو 1'],
      max: [5, 'أعلى تقييم هو 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'العنوان لا يتجاوز 100 حرف'],
    },
    body: {
      type: String,
      trim: true,
      maxlength: [1000, 'المراجعة لا تتجاوز 1000 حرف'],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

/**
 * Static method: recalculate and update product rating + reviewCount
 */
reviewSchema.statics.updateProductRating = async function (productId) {
  try {
    const stats = await this.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0,
      });
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// After a review is saved, update product stats
reviewSchema.post('save', function () {
  this.constructor.updateProductRating(this.product);
});

// After a review is removed, update product stats
reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    doc.constructor.updateProductRating(doc.product);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
