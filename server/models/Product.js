const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    label: { type: String },
    color: {
      type: String,
      enum: ['gold', 'red', 'green', 'blue', 'purple'],
      default: 'gold',
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'المعرّف المختصر مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'اسم المنتج مطلوب'],
      trim: true,
      maxlength: [200, 'اسم المنتج لا يتجاوز 200 حرف'],
    },
    nameEn: {
      type: String,
      required: [true, 'الاسم الإنجليزي للمنتج مطلوب'],
      trim: true,
      maxlength: [200, 'الاسم الإنجليزي لا يتجاوز 200 حرف'],
    },
    category: {
      type: String,
      required: [true, 'تصنيف المنتج مطلوب'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'سعر المنتج مطلوب'],
      min: [0, 'السعر لا يمكن أن يكون سالباً'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'سعر المقارنة لا يمكن أن يكون سالباً'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'المخزون لا يمكن أن يكون سالباً'],
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    badge: badgeSchema,
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      maxlength: [2000, 'الوصف لا يتجاوز 2000 حرف'],
    },
    features: {
      type: [String],
      default: [],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
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

// Text index for search across Arabic and English fields
productSchema.index(
  { name: 'text', nameEn: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, nameEn: 8, tags: 5, description: 1 } }
);

// Compound indexes for common queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isBestSeller: 1, isActive: 1 });
productSchema.index({ isNewArrival: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
