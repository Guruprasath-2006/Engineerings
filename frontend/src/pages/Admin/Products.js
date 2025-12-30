import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`/api/products/${id}`, config);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-luxury-lightGray/50 hover:bg-luxury-lightGray text-white rounded-lg transition-all duration-300 group"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiArrowLeft className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
          </motion.div>
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
              Manage Products
            </h1>
            <p className="text-gray-400">{products.length} products available</p>
          </div>
          <Link to="/admin/products/add">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 gold-glow-btn text-black font-semibold rounded-lg flex items-center space-x-2"
            >
              <FiPlus />
              <span>Add Product</span>
            </motion.button>
          </Link>
        </motion.div>

        <div className="luxury-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-luxury-darkGray">
                <tr>
                  <th className="px-6 py-4 text-left text-primary-500 font-semibold">Image</th>
                  <th className="px-6 py-4 text-left text-primary-500 font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-primary-500 font-semibold">Brand</th>
                  <th className="px-6 py-4 text-left text-primary-500 font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-primary-500 font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-primary-500 font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-primary-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-primary-600/20 hover:bg-luxury-lightGray/30"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 text-white">{product.title}</td>
                    <td className="px-6 py-4 text-gray-300">{product.brand}</td>
                    <td className="px-6 py-4 text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 text-primary-500 font-semibold">₹{product.price}</td>
                    <td className="px-6 py-4 text-gray-300">{product.stock}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Link to={`/admin/products/edit/${product._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-blue-400 hover:text-blue-300 p-2"
                          >
                            <FiEdit className="text-xl" />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(product._id, product.title)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <FiTrash2 className="text-xl" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;


