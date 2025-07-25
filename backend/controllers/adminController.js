const User = require('../models/User');

// @desc    Get all guides for verification
// @route   GET /api/admin/guides
// @access  Private (Admin only)
const getAllGuidesForVerification = async (req, res) => {
  try {
    const guides = await User.find({ role: 'guide' }).select('-password');
    res.status(200).json({
      status: 'success',
      results: guides.length,
      data: {
        guides,
      },
    });
  } catch (error) {
    console.error('Get all guides for verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guides for verification',
    });
  }
};

// @desc    Verify a guide
// @route   PUT /api/admin/guides/:id/verify
// @access  Private (Admin only)
const verifyGuide = async (req, res) => {
  try {
    const guide = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'verified' },
      { new: true }
    ).select('-password');

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Guide verified successfully',
      data: {
        guide,
      },
    });
  } catch (error) {
    console.error('Verify guide error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to verify guide',
    });
  }
};

module.exports = {
  getAllGuidesForVerification,
  verifyGuide,
};