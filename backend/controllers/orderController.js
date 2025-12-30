const Order = require('../models/Order');
const Product = require('../models/Product');
const crypto = require('crypto');

// Initialize Razorpay (only if package is available)
let razorpay = null;
try {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_HERE'
  });
  console.log('✅ Razorpay initialized successfully');
} catch (error) {
  console.warn('⚠️ Razorpay not available:', error.message);
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, totalAmount, tax = 0, shippingCost = 0, discount = 0, couponCode } = req.body;

    // Validate stock availability
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
        });
      }
    }

    // Calculate subtotal
    const subtotal = totalAmount - tax - shippingCost + discount;

    const order = await Order.create({
      user: req.user.id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
      subtotal,
      tax,
      shippingCost,
      discount,
      couponCode
    });

    // Update product stock
    for (let item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product', 'title brand price')
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'title brand')
      .sort({ orderDate: -1 });

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalAmount,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'title brand price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user is order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    console.log('📝 Create Razorpay order endpoint hit');
    console.log('Request body:', req.body);
    
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Check if Razorpay is properly configured
    const isRazorpayConfigured = process.env.RAZORPAY_KEY_ID && 
                                 process.env.RAZORPAY_KEY_SECRET && 
                                 !process.env.RAZORPAY_KEY_ID.includes('YOUR_KEY') &&
                                 razorpay;

    if (!isRazorpayConfigured) {
      console.log('⚠️ Razorpay not configured - using demo mode');
      // Return a mock order for demo purposes
      return res.status(200).json({
        success: true,
        razorpayOrderId: `demo_order_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        key: 'demo_key',
        isDemo: true,
        message: 'Demo mode - Please configure Razorpay keys for real payments'
      });
    }

    console.log('💰 Creating order for amount:', amount);

    // Razorpay expects amount in paise (multiply by 100)
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    
    console.log('✅ Razorpay order created:', order.id);

    res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      isDemo: false
    });
  } catch (error) {
    console.error('❌ Razorpay order creation error:', error);
    
    // If authentication fails, fall back to demo mode
    if (error.statusCode === 401 || error.error?.code === 'BAD_REQUEST_ERROR') {
      console.log('⚠️ Razorpay authentication failed - using demo mode');
      return res.status(200).json({
        success: true,
        razorpayOrderId: `demo_order_${Date.now()}`,
        amount: Math.round(req.body.amount * 100),
        currency: 'INR',
        key: 'demo_key',
        isDemo: true,
        message: 'Demo mode - Razorpay not configured'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment and create order
// @route   POST /api/orders/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_HERE')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Payment verified, now create the order
    const { products, shippingAddress, paymentMethod, totalAmount } = orderData;

    // Validate stock availability
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
        });
      }
    }

    // Calculate values
    const subtotal = totalAmount / 1.1; // Remove tax
    const tax = totalAmount - subtotal;

    const order = await Order.create({
      user: req.user.id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
      subtotal,
      tax,
      shippingCost: 0,
      discount: 0,
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    // Update product stock
    for (let item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Payment verified and order created',
      order
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const Review = require('../models/Review');

    // Order stats
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    
    // Revenue stats
    const ordersData = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyOrders = await Order.find({
      orderDate: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      },
      status: { $ne: 'Cancelled' }
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Product stats
    const totalProducts = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });

    // User stats
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1)
      }
    });

    // Review stats
    const totalReviews = await Review.countDocuments();

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-orderDate')
      .limit(5)
      .select('orderDate totalAmount status');

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalSold: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    const topProductsDetails = await Product.find({
      _id: { $in: topProducts.map(p => p._id) }
    }).select('title images brand');

    const topProductsWithDetails = topProducts.map(tp => {
      const product = topProductsDetails.find(p => p._id.toString() === tp._id.toString());
      return {
        ...tp,
        product
      };
    });

    // Sales chart data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayOrders = await Order.find({
        orderDate: { $gte: date, $lt: nextDate },
        status: { $ne: 'Cancelled' }
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        revenue: {
          total: Math.round(totalRevenue),
          monthly: Math.round(monthlyRevenue)
        },
        products: {
          total: totalProducts,
          outOfStock,
          lowStock
        },
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth
        },
        reviews: {
          total: totalReviews
        },
        recentOrders,
        topProducts: topProductsWithDetails,
        salesChart: last7Days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
