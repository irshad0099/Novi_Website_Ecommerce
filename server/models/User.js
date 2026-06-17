const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'المنزل' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'الاسم الأول مطلوب'],
      trim: true,
      maxlength: [50, 'الاسم الأول لا يتجاوز 50 حرفاً'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'اسم العائلة لا يتجاوز 50 حرفاً'],
      default: '',
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'يرجى إدخال بريد إلكتروني صالح',
      ],
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+966|0)(5\d{8})$/, 'يرجى إدخال رقم هاتف سعودي صالح'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    birthday: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method: compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Virtual: full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes (email already has unique:true above, so no separate index needed)
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
