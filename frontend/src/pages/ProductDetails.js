import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiPackage, FiTruck, FiShield } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data.product);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/shop');
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.title} added to cart!`);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.warning('Maximum stock reached');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Product Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="luxury-card rounded-xl overflow-hidden mb-4"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(index)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-primary-500 text-sm font-semibold mb-2">{product.brand}</p>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                <FiStar className="text-primary-500 fill-current text-xl" />
                <span className="text-white font-semibold text-lg">{product.rating}</span>
              </div>
              <span className="text-gray-400">• {product.category}</span>
              <span className="text-gray-400">• {product.size}</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-5xl font-bold text-primary-500 mb-2">₹{product.price}</p>
              <p className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 p-6 luxury-card rounded-xl">
              <h3 className="text-xl font-bold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={decreaseQuantity}
                  className="w-12 h-12 bg-luxury-darkGray border border-primary-600/30 rounded-lg flex items-center justify-center text-white hover:bg-primary-500 hover:text-black transition-all"
                >
                  <FiMinus />
                </motion.button>
                <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={increaseQuantity}
                  className="w-12 h-12 bg-luxury-darkGray border border-primary-600/30 rounded-lg flex items-center justify-center text-white hover:bg-primary-500 hover:text-black transition-all"
                >
                  <FiPlus />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-4 gold-glow-btn text-black font-bold rounded-lg text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </motion.button>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="luxury-card p-4 rounded-lg text-center">
                <FiPackage className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-300">Authentic Product</p>
              </div>
              <div className="luxury-card p-4 rounded-lg text-center">
                <FiTruck className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-300">Fast Delivery</p>
              </div>
              <div className="luxury-card p-4 rounded-lg text-center">
                <FiShield className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-300">Secure Payment</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;


