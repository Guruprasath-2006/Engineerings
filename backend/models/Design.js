const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: [true, 'Please provide project name'],
    trim: true
  },
  projectType: {
    type: String,
    required: true,
    enum: ['Door', 'Window', 'Gate', 'Roofing', 'HVAC', 'Custom']
  },
  category: {
    type: String,
    required: true,
    enum: ['Mechanical', 'Industrial', 'Consulting', 'Maintenance']
  },
  specifications: {
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: {
        type: String,
        enum: ['feet', 'meters', 'inches'],
        default: 'feet'
      }
    },
    material: String,
    color: String,
    finish: String,
    features: [String]
  },
  budget: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    duration: String
  },
  location: {
    type: String,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  buildingType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Industrial', 'Mall', 'Office', 'Warehouse', 'Other']
  },
  description: {
    type: String,
    maxlength: 2000
  },
  requirements: [String],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  sketches: [{
    name: String,
    imageUrl: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  finalCost: {
    type: Number
  },
  notes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  revisions: [{
    version: Number,
    changes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Revision Requested'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
designSchema.index({ user: 1, status: 1 });
designSchema.index({ projectType: 1, category: 1 });

module.exports = mongoose.model('Design', designSchema);
