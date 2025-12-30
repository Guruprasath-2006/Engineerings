import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiStar, FiShoppingCart, FiX } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.products);
      setFilteredProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await axios.get('/api/products/brands/all');
      setBrands(data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Price filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-4">
            Engineering Services
          </h1>
          <p className="text-gray-400 text-lg">Professional solutions for your engineering needs</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search services by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-12 bg-luxury-darkGray text-white rounded-lg border border-primary-600/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 text-xl" />
          </div>
        </motion.div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-3 gold-glow-btn text-black font-semibold rounded-lg flex items-center justify-center space-x-2"
          >
            <FiFilter />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}
          >
            <div className="luxury-card p-6 rounded-xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-primary-500 text-sm hover:text-primary-400"
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Engineering Designs</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="mr-2 accent-primary-500"
                    />
                    <span className="text-gray-300">All Designs</span>
                  </label>
                  {['Mechanical Engineering', 'Industrial Engineering', 'Engineering Consulting'].map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="mr-2 accent-primary-500"
                      />
                      <span className="text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Department Filter */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Department</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Departments</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 text-gray-400">
              Showing {filteredProducts.length} of {products.length} services
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loader"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No services found matching your criteria</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 gold-glow-btn text-black font-semibold rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="luxury-card rounded-xl overflow-hidden group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm hover:bg-primary-500 hover:text-black transition-all"
                      >
                        Quick View
                      </button>
                      <div className="absolute top-4 right-4 bg-primary-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                        ₹{product.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-primary-500 text-sm font-semibold mb-1">{product.brand}</p>
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-xl font-bold text-white mb-2 hover:text-primary-500 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <FiStar className="text-primary-500 fill-current" />
                          <span className="text-white font-semibold">{product.rating}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{product.size}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2 gold-glow-btn text-black font-semibold rounded-lg flex items-center justify-center space-x-2"
                      >
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-luxury-darkGray rounded-xl max-w-2xl w-full overflow-hidden"
            >
              <div className="relative">
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-primary-500 text-white hover:text-black p-2 rounded-full transition-all z-10"
                >
                  <FiX className="text-xl" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <img
                    src={quickViewProduct.images[0]}
                    alt={quickViewProduct.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-6">
                    <p className="text-primary-500 text-sm font-semibold mb-2">{quickViewProduct.brand}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{quickViewProduct.title}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <FiStar className="text-primary-500 fill-current" />
                      <span className="text-white font-semibold">{quickViewProduct.rating}</span>
                      <span className="text-gray-400">• {quickViewProduct.size}</span>
                    </div>
                    <p className="text-gray-300 mb-6 line-clamp-3">{quickViewProduct.description}</p>
                    <div className="text-3xl font-bold text-primary-500 mb-6">₹{quickViewProduct.price}</div>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          handleAddToCart(quickViewProduct);
                          setQuickViewProduct(null);
                        }}
                        className="w-full py-3 gold-glow-btn text-black font-semibold rounded-lg flex items-center justify-center space-x-2"
                      >
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                      </button>
                      <Link to={`/product/${quickViewProduct._id}`} onClick={() => setQuickViewProduct(null)}>
                        <button className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all">
                          View Full Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;


