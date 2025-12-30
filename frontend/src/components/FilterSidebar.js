import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    category: true,
    brand: true,
    price: true,
    rating: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, children, sectionKey }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
      >
        {title}
        {expandedSections[sectionKey] ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white shadow-2xl lg:shadow-none z-50 overflow-y-auto p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Category Filter */}
        <FilterSection title="Category" sectionKey="category">
          {['All', 'Men', 'Women', 'Unisex'].map(cat => (
            <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-4 h-4 text-gold focus:ring-gold"
              />
              <span className="text-gray-700 group-hover:text-gold transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand" sectionKey="brand">
          {['Tom Ford', 'Chanel', 'Dior', 'Gucci', 'Versace', 'Lancôme'].map(brand => (
            <label key={brand} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand)}
                onChange={(e) => {
                  const brands = filters.brands || [];
                  if (e.target.checked) {
                    onFilterChange('brands', [...brands, brand]);
                  } else {
                    onFilterChange('brands', brands.filter(b => b !== brand));
                  }
                }}
                className="w-4 h-4 text-gold focus:ring-gold rounded"
              />
              <span className="text-gray-700 group-hover:text-gold transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title="Price Range" sectionKey="price">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection title="Minimum Rating" sectionKey="rating">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={(e) => onFilterChange('rating', Number(e.target.value))}
                className="w-4 h-4 text-gold focus:ring-gold"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rating ? 'text-gold' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
                <span className="ml-2 text-gray-600 text-sm">& up</span>
              </div>
            </label>
          ))}
        </FilterSection>

        {/* Additional Filters */}
        <FilterSection title="Other Filters" sectionKey="other">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFilterChange('inStock', e.target.checked)}
              className="w-4 h-4 text-gold focus:ring-gold rounded"
            />
            <span className="text-gray-700 group-hover:text-gold transition-colors">
              In Stock Only
            </span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => onFilterChange('onSale', e.target.checked)}
              className="w-4 h-4 text-gold focus:ring-gold rounded"
            />
            <span className="text-gray-700 group-hover:text-gold transition-colors">
              On Sale
            </span>
          </label>
        </FilterSection>

        {/* Clear Filters Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClearFilters}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
        >
          Clear All Filters
        </motion.button>
      </motion.aside>
    </>
  );
};

export default FilterSidebar;


