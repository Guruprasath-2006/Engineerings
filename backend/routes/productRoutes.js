const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getBestSellers,
  getRelatedProducts,
  getProductStats
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/brands/all', getBrands);
router.get('/featured/all', getFeaturedProducts);
router.get('/trending/all', getTrendingProducts);
router.get('/new-arrivals/all', getNewArrivals);
router.get('/best-sellers/all', getBestSellers);
router.get('/stats/all', protect, authorize('admin'), getProductStats);
router.get('/:id/related', getRelatedProducts);
router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
