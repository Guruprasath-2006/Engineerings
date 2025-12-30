const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: 'title price images brand rating stock discount'
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
exports.addToWishlist = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [{ product: req.params.productId }]
      });
    } else {
      // Check if product already in wishlist
      const exists = wishlist.products.some(
        item => item.product.toString() === req.params.productId
      );

      if (exists) {
        return res.status(400).json({ 
          success: false, 
          message: 'Product already in wishlist' 
        });
      }

      wishlist.products.push({ product: req.params.productId });
      await wishlist.save();
    }

    // Update wishlist count in product
    product.wishlistCount += 1;
    await product.save();

    await wishlist.populate({
      path: 'products.product',
      select: 'title price images brand rating stock discount'
    });

    res.json({
      success: true,
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== req.params.productId
    );

    await wishlist.save();

    // Update wishlist count in product
    const product = await Product.findById(req.params.productId);
    if (product && product.wishlistCount > 0) {
      product.wishlistCount -= 1;
      await product.save();
    }

    await wishlist.populate({
      path: 'products.product',
      select: 'title price images brand rating stock discount'
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    // Update wishlist count for all products
    for (const item of wishlist.products) {
      const product = await Product.findById(item.product);
      if (product && product.wishlistCount > 0) {
        product.wishlistCount -= 1;
        await product.save();
      }
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist cleared',
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
exports.checkWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.json({ success: true, inWishlist: false });
    }

    const inWishlist = wishlist.products.some(
      item => item.product.toString() === req.params.productId
    );

    res.json({
      success: true,
      inWishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Move wishlist items to cart
// @route   POST /api/wishlist/move-to-cart
exports.moveToCart = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products.product');

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wishlist is empty' 
      });
    }

    const availableProducts = wishlist.products.filter(
      item => item.product && item.product.stock > 0
    );

    res.json({
      success: true,
      products: availableProducts,
      message: `${availableProducts.length} items ready to add to cart`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
