import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiShoppingCart className="text-primary-500 text-6xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold font-serif text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Start shopping to add items to your cart</p>
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 gold-glow-btn text-black font-bold rounded-lg"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-400">
            {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="luxury-card p-6 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full sm:w-32 h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-primary-500 text-sm font-semibold">{item.brand}</p>
                        <Link to={`/product/${item._id}`}>
                          <h3 className="text-xl font-bold text-white hover:text-primary-500 transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-sm">{item.size}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-400 p-2"
                      >
                        <FiTrash2 className="text-xl" />
                      </motion.button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 bg-luxury-black border border-primary-600/30 rounded-lg flex items-center justify-center text-white hover:bg-primary-500 hover:text-black transition-all"
                        >
                          <FiMinus />
                        </motion.button>
                        <span className="text-white font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 bg-luxury-black border border-primary-600/30 rounded-lg flex items-center justify-center text-white hover:bg-primary-500 hover:text-black transition-all"
                        >
                          <FiPlus />
                        </motion.button>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-500">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="luxury-card p-6 rounded-xl sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (Estimated)</span>
                  <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-primary-600/20 pt-4">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary-500">${(getCartTotal() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full py-3 gold-glow-btn text-black font-bold rounded-lg mb-4"
              >
                Proceed to Checkout
              </motion.button>

              <Link to="/shop">
                <button className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


