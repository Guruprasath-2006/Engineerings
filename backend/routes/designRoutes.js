const express = require('express');
const router = express.Router();
const {
  createDesign,
  getUserDesigns,
  getDesign,
  updateDesign,
  deleteDesign,
  addNote,
  getAllDesigns,
  updateDesignStatus
} = require('../controllers/designController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.route('/')
  .post(protect, createDesign)
  .get(protect, getUserDesigns);

router.route('/:id')
  .get(protect, getDesign)
  .put(protect, updateDesign)
  .delete(protect, deleteDesign);

router.post('/:id/notes', protect, addNote);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllDesigns);
router.put('/admin/:id/status', protect, authorize('admin'), updateDesignStatus);

module.exports = router;
