const express = require('express');
const {
  getProducts,
  getProduct,
  getFeatured,
  getBestSellers,
  getNewArrivals,
  getByCategory,
  searchProducts,
} = require('../controllers/productController');

const router = express.Router();

// No authentication required for product routes

// Named routes MUST come before parameterized routes to avoid slug conflicts
router.get('/featured', getFeatured);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/search', searchProducts);
router.get('/category/:slug', getByCategory);

// Base routes
router.get('/', getProducts);
router.get('/:slug', getProduct);

module.exports = router;
