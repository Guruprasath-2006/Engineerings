const Design = require('../models/Design');

// Create new design
exports.createDesign = async (req, res) => {
  try {
    const design = await Design.create({
      user: req.user._id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all designs for a user
exports.getUserDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: designs.length,
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single design
exports.getDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('notes.user', 'name');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Check if user owns the design or is admin
    if (design.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this design'
      });
    }

    res.status(200).json({
      success: true,
      design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update design
exports.updateDesign = async (req, res) => {
  try {
    let design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Check if user owns the design
    if (design.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this design'
      });
    }

    // Add revision history
    if (req.body.trackRevision) {
      design.revisions.push({
        version: design.revisions.length + 1,
        changes: req.body.revisionChanges || 'Updated design',
        updatedBy: req.user._id
      });
    }

    design = await Design.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete design
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Check if user owns the design
    if (design.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this design'
      });
    }

    await design.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add note to design
exports.addNote = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    design.notes.push({
      user: req.user._id,
      message: req.body.message
    });

    await design.save();

    res.status(200).json({
      success: true,
      design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all designs (Admin only)
exports.getAllDesigns = async (req, res) => {
  try {
    const { status, projectType, category } = req.query;
    let query = {};

    if (status) query.status = status;
    if (projectType) query.projectType = projectType;
    if (category) query.category = category;

    const designs = await Design.find(query)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: designs.length,
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update design status (Admin only)
exports.updateDesignStatus = async (req, res) => {
  try {
    const { status, assignedTo, estimatedCost } = req.body;

    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, estimatedCost },
      { new: true }
    ).populate('user', 'name email')
      .populate('assignedTo', 'name email');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.status(200).json({
      success: true,
      design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
