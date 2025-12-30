import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const EditProduct = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: '',
    category: 'Unisex',
    size: '100ml',
    description: '',
    rating: '',
    images: '',
    stock: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      const product = data.product;
      setFormData({
        title: product.title,
        brand: product.brand,
        price: product.price,
        category: product.category,
        size: product.size,
        description: product.description,
        rating: product.rating,
        images: product.images.join(', '),
        stock: product.stock
      });
      setFetchLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
        images: formData.images.split(',').map(img => img.trim())
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.put(`/api/products/${id}`, productData, config);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Edit Product
          </h1>
          <p className="text-gray-400">Update product information</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="luxury-card p-8 rounded-xl"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Product Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Size *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="50ml">50ml</option>
                  <option value="100ml">100ml</option>
                  <option value="150ml">150ml</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Rating *</label>
                <input
                  type="number"
                  name="rating"
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description *</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Image URLs * (comma-separated)</label>
              <input
                type="text"
                name="images"
                required
                value={formData.images}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 py-3 gold-glow-btn text-black font-bold rounded-lg disabled:opacity-50"
              >
                {loading ? 'Updating Product...' : 'Update Product'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex-1 py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditProduct;


