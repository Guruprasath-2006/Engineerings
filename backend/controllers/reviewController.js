const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Review.countDocuments({ product: req.params.productId });

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }

    // Check if user purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'products.product': productId,
      status: 'Delivered'
    });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      title,
      comment,
      images: images || [],
      verified: hasPurchased ? true : false
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const { rating, title, comment, images } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to update this review' 
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;

    await review.save();
    await review.populate('user', 'name avatar');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.usersFoundHelpful.includes(req.user._id);

    if (alreadyMarked) {
      // Remove from helpful
      review.usersFoundHelpful = review.usersFoundHelpful.filter(
        id => id.toString() !== req.user._id.toString()
      );
      review.helpful -= 1;
    } else {
      // Add to helpful
      review.usersFoundHelpful.push(req.user._id);
      review.helpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      helpful: review.helpful,
      marked: !alreadyMarked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'title images')
      .sort('-createdAt');

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/stats/:productId
exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { product: req.params.productId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const total = await Review.countDocuments({ product: req.params.productId });

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    stats.forEach(stat => {
      ratingDistribution[stat._id] = stat.count;
    });

    res.json({
      success: true,
      total,
      distribution: ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
