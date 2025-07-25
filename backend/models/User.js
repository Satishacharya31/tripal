const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  phone: {
    type: String,
    required: function() { return !this.profileIncomplete; },
    trim: true
  },
  country: {
    type: String,
    required: function() { return !this.profileIncomplete; },
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() { return !this.profileIncomplete; }
  },
  profileIncomplete: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['tourist', 'guide', 'admin'],
    default: 'tourist'
  },
  avatar: {
    type: String,
    default: function() {
      // Use Google avatar if available, otherwise default placeholder
      return this.googleId ? `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name || 'User')}&background=0D8ABC&color=fff` : null;
    }
  },
  profilePicture: {
    type: String, // URL to uploaded profile picture
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  // Guide-specific fields
  specialties: [{
    type: String,
    enum: ['trekking', 'culture', 'adventure', 'spiritual', 'photography', 'wildlife', 'mountaineering']
  }],
  languages: [{
    type: String,
    default: ['English', 'Nepali']
  }],
  experience: {
    type: String,
    default: '1 year'
  },
  experienceYears: {
    type: Number,
    default: 1,
    min: 0
  },
  experienceDetails: {
    type: String,
    maxlength: [1000, 'Experience details cannot exceed 1000 characters']
  },
  certificates: [{
    name: {
      type: String,
      required: true
    },
    issuedBy: {
      type: String,
      required: true
    },
    issuedDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    },
    certificateUrl: {
      type: String // URL to certificate image/document
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  available: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: 'Kathmandu'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  completedTrips: {
    type: Number,
    default: 0
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ role: 1 });
userSchema.index({ available: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  const publicProfile = {
    _id: userObject._id,
    googleId: userObject.googleId,
    name: userObject.name,
    email: userObject.email,
    phone: userObject.phone,
    country: userObject.country,
    gender: userObject.gender,
    role: userObject.role,
    avatar: userObject.avatar,
    profilePicture: userObject.profilePicture,
    isActive: userObject.isActive,
    lastLogin: userObject.lastLogin,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt,
  };

  if (this.role === 'guide') {
    publicProfile.specialties = userObject.specialties;
    publicProfile.languages = userObject.languages;
    publicProfile.experience = userObject.experience;
    publicProfile.experienceYears = userObject.experienceYears;
    publicProfile.experienceDetails = userObject.experienceDetails;
    publicProfile.certificates = userObject.certificates;
    publicProfile.rating = userObject.rating;
    publicProfile.available = userObject.available;
    publicProfile.location = userObject.location;
    publicProfile.bio = userObject.bio;
    publicProfile.completedTrips = userObject.completedTrips;
    publicProfile.verificationStatus = userObject.verificationStatus;
  }

  return publicProfile;
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
