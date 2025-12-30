import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-luxury-black border-b border-primary-600/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold font-serif"
            >
              <span className="text-white">Velan</span>
              <span className="text-primary-500"> Engineering</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-white hover:text-primary-500 transition-colors">
              Services
            </Link>
            <Link to="/design-studio" className="text-white hover:text-primary-500 transition-colors">
              Design Studio
            </Link>
            {user && (
              <Link to="/orders" className="text-white hover:text-primary-500 transition-colors">
                Orders
              </Link>
            )}
            {isAdmin() && (
              <Link to="/admin/dashboard" className="text-white hover:text-primary-500 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Right Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <FiShoppingCart className="text-white text-2xl hover:text-primary-500 transition-colors" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">Hi, {user.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 gold-glow-btn text-black font-semibold rounded-lg"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-white border border-primary-500 rounded-lg hover:bg-primary-500 hover:text-black transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 gold-glow-btn text-black font-semibold rounded-lg"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                Services
              </Link>
              <Link to="/design-studio" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                Design Studio
              </Link>
              {user && (
                <Link to="/orders" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                  Orders
                </Link>
              )}
              {isAdmin() && (
                <Link to="/admin/dashboard" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/cart" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                Cart ({getCartCount()})
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-left text-white hover:text-primary-500"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="text-white hover:text-primary-500" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


