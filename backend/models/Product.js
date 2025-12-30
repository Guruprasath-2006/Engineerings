const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide service title'],
    trim: true,
    maxlength: [150, 'Title cannot be more than 150 characters']
  },
  brand: {
    type: String,
    required: [true, 'Please provide service provider/department'],
    trim: true,
    default: 'Velan Engineering'
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Mechanical', 'Industrial', 'Consulting', 'Maintenance']
  },
  size: {
    type: String,
    required: false,
    default: 'Standard Package'
  },
  description: {
    type: String,
    required: [true, 'Please provide service description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  views: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  serviceDetails: {
    scope: [String],
    deliverables: [String],
    requirements: [String]
  },
  duration: {
    type: String,
    enum: ['1-2 Days', '3-7 Days', '1-2 Weeks', '2-3 Weeks', '2-4 Weeks', '1-3 Months', '3-6 Months', 'Custom']
  },
  complexity: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced', 'Expert']
  },
  projectType: [{
    type: String,
    enum: ['Design', 'Installation', 'Maintenance', 'Consulting', 'Inspection', 'All Types']
  }],
  industry: [{
    type: String,
    enum: ['Manufacturing', 'Construction', 'Energy', 'Infrastructure', 'Commercial', 'Residential']
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    slug: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Calculate final price with discount
productSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return Math.round(this.price - (this.price * this.discount / 100));
  }
  return this.price;
});

// Text index for advanced search
productSchema.index({
  title: 'text',
  brand: 'text',
  description: 'text',
  tags: 'text'
});

// Compound indexes for efficient queries
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, rating: -1 });
productSchema.index({ featured: 1, rating: -1 });

module.exports = mongoose.model('Product', productSchema);
