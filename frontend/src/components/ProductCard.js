import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product, showQuickView }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      _id: product._id,
      title: product.title,
      price: product.finalPrice || product.price,
      images: product.images,
      brand: product.brand,
      size: product.size
    });
    toast.success('Added to cart!');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    if (showQuickView) showQuickView(product);
  };

  const discountPercentage = product.discount || 0;
  const finalPrice = product.finalPrice || product.price;
  const hasDiscount = discountPercentage > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}%
            </div>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-bold">
              Out of Stock
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`p-3 rounded-full ${
                isWishlisted ? 'bg-red-500' : 'bg-white'
              } text-black hover:bg-gold transition-colors`}
              title="Add to Wishlist"
            >
              <FiHeart className={isWishlisted ? 'fill-white text-white' : ''} />
            </motion.button>
            
            {product.stock > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-3 bg-white rounded-full text-black hover:bg-gold transition-colors"
                title="Add to Cart"
              >
                <FiShoppingCart />
              </motion.button>
            )}
            
            {showQuickView && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickView}
                className="p-3 bg-white rounded-full text-black hover:bg-gold transition-colors"
                title="Quick View"
              >
                <FiEye />
              </motion.button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-sm text-gold font-medium mb-1">{product.brand}</p>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`text-sm ${
                  i < Math.floor(product.rating)
                    ? 'fill-gold text-gold'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{finalPrice}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Size */}
          <p className="text-sm text-gray-600 mt-2">{product.size}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;


