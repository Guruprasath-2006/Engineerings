const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getDashboardStats,
  createRazorpayOrder,
  verifyPayment
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Order routes are working!',
    routes: {
      createRazorpayOrder: '/api/orders/create-razorpay-order',
      verifyPayment: '/api/orders/verify-payment'
    }
  });
});

// Payment routes - MUST be before /:id route
router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPayment);

// Order routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/stats/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/', protect, authorize('admin'), getAllOrders);

// This route MUST be last (catches all /api/orders/:id)
router.route('/:id')
  .get(protect, getOrder)
  .put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
