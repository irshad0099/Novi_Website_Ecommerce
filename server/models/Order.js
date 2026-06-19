const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: { type: String, required: true },
    nameEn: { type: String },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
    },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستخدم مطلوب'],
    },
    // Guest checkout info (used when order placed by guest user stored with placeholder)
    guestInfo: {
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'يجب أن يحتوي الطلب على منتج واحد على الأقل',
      },
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postal: { type: String },
      notes: { type: String },
    },
    paymentMethod: {
      type: String,
      required: [true, 'طريقة الدفع مطلوبة'],
      enum: ['cod', 'card', 'apple', 'tabby', 'tamara'],
    },
    couponCode: { type: String, uppercase: true },
    couponDiscount: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    cancelReason: { type: String },
  },
  {
    timestamps: true,
  }
);

// Auto-generate orderNumber before save
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now();
    const lastFive = String(timestamp).slice(-5);
    const randomTwo = String(Math.floor(Math.random() * 90) + 10);
    this.orderNumber = `NOVI-${lastFive}${randomTwo}`;

    // Push initial status to history
    this.statusHistory = [
      {
        status: this.status,
        note: 'تم استلام الطلب',
        timestamp: new Date(),
      },
    ];
  }
  next();
});

// Indexes (orderNumber is already unique above, so no separate index needed)
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
