const { validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * @desc    Get user profile with addresses and wishlist
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('wishlist', 'slug name nameEn price images rating comparePrice badge');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (firstName, lastName, phone, gender, birthday)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const allowedFields = ['firstName', 'lastName', 'phone', 'gender', 'birthday', 'avatar'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لا توجد بيانات للتحديث',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user password
 * @route   PUT /api/users/password
 * @access  Private
 */
const updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الحالية والجديدة مطلوبتان',
      });
    }

    // Fetch user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user wishlist populated with product details
 * @route   GET /api/users/wishlist
 * @access  Private
 */
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('wishlist')
      .populate({
        path: 'wishlist',
        select: 'slug name nameEn price comparePrice images rating reviewCount badge category isActive',
        match: { isActive: true },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle product in wishlist (add if not present, remove if present)
 * @route   POST /api/users/wishlist/:productId
 * @access  Private
 */
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Verify product exists
    const product = await Product.findById(productId).select('_id name');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    const user = await User.findById(req.user._id).select('wishlist');
    const isInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isInWishlist) {
      // Remove from wishlist
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: productId },
      });
      return res.status(200).json({
        success: true,
        inWishlist: false,
        message: 'تم إزالة المنتج من المفضلة',
      });
    } else {
      // Add to wishlist
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: productId },
      });
      return res.status(200).json({
        success: true,
        inWishlist: true,
        message: 'تم إضافة المنتج إلى المفضلة',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.status(200).json({
      success: true,
      count: user.addresses.length,
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
const addAddress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { label, name, phone, address, city, postal, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    // If new address is default, unset all others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // If this is the first address, make it default
    const makeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({
      label: label || 'المنزل',
      name,
      phone,
      address,
      city,
      postal: postal || '',
      isDefault: makeDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'تم إضافة العنوان بنجاح',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an address by id
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'العنوان غير موجود',
      });
    }

    const { label, name, phone, address: addr, city, postal, isDefault } = req.body;

    // If setting as default, unset all others first
    if (isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }

    if (label !== undefined) address.label = label;
    if (name !== undefined) address.name = name;
    if (phone !== undefined) address.phone = phone;
    if (addr !== undefined) address.address = addr;
    if (city !== undefined) address.city = city;
    if (postal !== undefined) address.postal = postal;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث العنوان بنجاح',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an address by id
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'العنوان غير موجود',
      });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    // If deleted address was default and there are remaining addresses, make first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم حذف العنوان بنجاح',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  getWishlist,
  toggleWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
