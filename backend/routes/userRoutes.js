const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.route('/:id')
  .get(getUser)
  .delete(deleteUser);

module.exports = router;
