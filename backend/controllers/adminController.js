const User = require('../models/User');
const Request = require('../models/Request');
const Destination = require('../models/Destination');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGuides = await User.countDocuments({ role: 'guide' });
    const totalTourists = await User.countDocuments({ role: 'tourist' });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const totalDestinations = await Destination.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalGuides,
        totalTourists,
        totalRequests,
        pendingRequests,
        totalDestinations,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard statistics',
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
};

// @desc    Get user profile
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user profile',
    });
  }
};

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
  getDashboardStats,
  getAllUsers,
  getUserProfile,
  getAllGuidesForVerification,
  verifyGuide,
};
