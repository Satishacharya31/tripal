const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

// Passport config
require('./config/passport')(passport);

const app = express();

// CORS configuration
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const destinationRoutes = require('./routes/destinations');
const requestRoutes = require('./routes/requests');
const guideRoutes = require('./routes/guides');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

// Security middleware
app.use(helmet());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/*', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Passport middleware
app.use(passport.initialize());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Nepal Guide Connect API is running',
    timestamp: new Date().toISOString()
  });
});

// Since the frontend and backend are decoupled, the backend no longer serves static files.
// The frontend will be hosted on a separate service like Vercel or Netlify.

// 404 handler for any other requests (i.e., API routes that don't exist)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists`
    });
  }
  
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${CLIENT_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
