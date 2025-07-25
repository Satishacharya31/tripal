const express = require('express');
const {
  getAllGuidesForVerification,
  verifyGuide,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and restricted to admins
router.use(protect);
router.use(restrictTo('admin'));

router.get('/guides', getAllGuidesForVerification);
router.put('/guides/:id/verify', verifyGuide);

module.exports = router;