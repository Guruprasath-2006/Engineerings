const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: [true, 'Discount amount is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: Number,
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [String],
  description: String
}, {
  timestamps: true
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  if (!this.active) return false;
  if (this.validFrom > now) return false;
  if (this.validUntil < now) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  
  return true;
};

// Calculate discount
couponSchema.methods.calculateDiscount = function(amount) {
  if (this.discountType === 'percentage') {
    const discount = (amount * this.discount) / 100;
    return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount;
  }
  return this.discount;
};

module.exports = mongoose.model('Coupon', couponSchema);
