const Product = require('../models/Product');

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      featured,
      bestSeller,
      isNew,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build query filter
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') filter.isFeatured = true;
    if (bestSeller === 'true') filter.isBestSeller = true;
    if (isNew === 'true') filter.isNewArrival = true;

    // Text search
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1, reviewCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { sold: -1 };
        break;
      default:
        if (search) {
          sortOption = { score: { $meta: 'textScore' } };
        }
        break;
    }

    // Build projection for text search score
    const projection =
      search && sort !== 'price_asc' && sort !== 'price_desc'
        ? { score: { $meta: 'textScore' } }
        : {};

    const [products, total] = await Promise.all([
      Product.find(filter, projection)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured products (up to 8)
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeatured = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .sort({ sold: -1, rating: -1 })
      .limit(8)
      .select('slug name nameEn category price comparePrice rating reviewCount images badge isBestSeller isNewArrival');

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get best seller products (up to 6)
 * @route   GET /api/products/bestsellers
 * @access  Public
 */
const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true })
      .sort({ sold: -1 })
      .limit(6)
      .select('slug name nameEn category price comparePrice rating reviewCount images badge isNewArrival');

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get new arrivals (up to 4)
 * @route   GET /api/products/new-arrivals
 * @access  Public
 */
const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select('slug name nameEn category price comparePrice rating reviewCount images badge isBestSeller');

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get products by category slug with pagination
 * @route   GET /api/products/category/:slug
 * @access  Public
 */
const getByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      page = 1,
      limit = 12,
      sort,
      minPrice,
      maxPrice,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { category: slug, isActive: true };

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    let sortOption = { sold: -1 };
    switch (sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'popular': sortOption = { sold: -1 }; break;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      category: slug,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search products using text index
 * @route   GET /api/products/search (also handled via getProducts with ?search=)
 * @access  Public
 */
const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة البحث',
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      isActive: true,
      $text: { $search: q.trim() },
    };

    const [products, total] = await Promise.all([
      Product.find(filter, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      query: q.trim(),
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  getFeatured,
  getBestSellers,
  getNewArrivals,
  getByCategory,
  searchProducts,
};
