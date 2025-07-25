const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getUserProfile,
  getAllGuidesForVerification,
  verifyGuide,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and restricted to admins
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserProfile);
router.get('/guides', getAllGuidesForVerification);
router.put('/guides/:id/verify', verifyGuide);

module.exports = router;
