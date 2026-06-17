const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Shipping cost logic
const SHIPPING_THRESHOLD = 200; // Free shipping above this amount
const STANDARD_SHIPPING = 25;

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      guestInfo,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يجب أن يحتوي الطلب على منتج واحد على الأقل',
      });
    }

    // Fetch all products from DB by slug (frontend passes slug, not ObjectId)
    const slugs = items.map((item) => item.productId);
    const dbProducts = await Product.find({
      slug: { $in: slugs },
      isActive: true,
    }).select('_id slug name nameEn price stock images sold');

    if (dbProducts.length !== slugs.length) {
      return res.status(400).json({
        success: false,
        message: 'بعض المنتجات غير متوفرة أو تم إيقافها',
      });
    }

    // Build order items with server-side prices and check stock
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const dbProduct = dbProducts.find(
        (p) => p.slug === item.productId
      );

      if (!dbProduct) {
        return res.status(400).json({
          success: false,
          message: `المنتج غير موجود`,
        });
      }

      const qty = parseInt(item.qty, 10);
      if (!qty || qty < 1) {
        return res.status(400).json({
          success: false,
          message: `الكمية يجب أن تكون 1 على الأقل`,
        });
      }

      if (dbProduct.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `الكمية المطلوبة من "${dbProduct.name}" تتجاوز المخزون المتاح (${dbProduct.stock})`,
        });
      }

      const itemTotal = dbProduct.price * qty;
      subtotal += itemTotal;

      orderItems.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        nameEn: dbProduct.nameEn,
        price: dbProduct.price,
        qty,
        image: dbProduct.images && dbProduct.images[0] ? dbProduct.images[0] : '',
      });
    }

    // Calculate shipping
    const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

    // Apply coupon if provided
    let couponDiscount = 0;
    let appliedCouponCode = null;

    if (couponCode && couponCode.trim()) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'كود الخصم غير صالح أو منتهي الصلاحية',
        });
      }

      // Check expiry
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return res.status(400).json({
          success: false,
          message: 'انتهت صلاحية كود الخصم',
        });
      }

      // Check max uses
      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({
          success: false,
          message: 'تم استنفاد الحد الأقصى لاستخدامات هذا الكود',
        });
      }

      // Check minimum order amount
      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `الحد الأدنى للطلب لاستخدام هذا الكود هو ${coupon.minOrderAmount} ريال`,
        });
      }

      // Calculate discount
      if (coupon.discountType === 'percentage') {
        couponDiscount = Math.round((subtotal * coupon.discountValue) / 100 * 100) / 100;
      } else {
        couponDiscount = Math.min(coupon.discountValue, subtotal);
      }

      appliedCouponCode = coupon.code;

      // Update coupon usage
      await Coupon.findByIdAndUpdate(coupon._id, {
        $inc: { usedCount: 1 },
        $addToSet: { usedBy: req.user._id },
      });
    }

    const discount = couponDiscount;
    const total = Math.max(0, subtotal + shippingCost - discount);

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      guestInfo: guestInfo || undefined,
      items: orderItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postal: shippingAddress.postal || '',
        notes: shippingAddress.notes || '',
      },
      paymentMethod,
      couponCode: appliedCouponCode || undefined,
      couponDiscount: discount,
      subtotal,
      shippingCost,
      discount,
      total,
    });

    // Decrement stock and increment sold for each product
    const bulkOps = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: {
          $inc: { stock: -item.qty, sold: item.qty },
        },
      },
    }));
    await Product.bulkWrite(bulkOps);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in user's orders with pagination
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-statusHistory -__v'),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order by id (user must own the order)
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('-__v');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an order (only if status is pending or confirmed)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود',
      });
    }

    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن إلغاء الطلب في هذه المرحلة',
      });
    }

    const { reason } = req.body;

    order.status = 'cancelled';
    order.cancelReason = reason || 'إلغاء بطلب العميل';
    order.statusHistory.push({
      status: 'cancelled',
      note: reason || 'إلغاء بطلب العميل',
      timestamp: new Date(),
    });

    await order.save();

    // Restore stock
    const bulkOps = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: item.qty, sold: -item.qty } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'تم إلغاء الطلب بنجاح',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order stats for dashboard (count by status)
 * @route   GET /api/orders/stats
 * @access  Private
 */
const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    const result = {
      total: 0,
      totalAmount: 0,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      refunded: 0,
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
      result.total += s.count;
      result.totalAmount += s.totalAmount;
    });

    res.status(200).json({
      success: true,
      stats: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getOrderStats,
};
