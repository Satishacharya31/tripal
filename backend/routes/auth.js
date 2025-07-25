const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('passport');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    const token = req.user.getSignedJwtToken();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Instead of redirecting, send an HTML page that communicates with the parent window
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Success</title>
        <script>
          // Send the token to the parent window
          window.opener.postMessage({
            type: 'auth-success',
            token: '${token}',
            profileIncomplete: ${req.user.profileIncomplete}
          }, '${frontendUrl}');
          
          // Close the popup window
          window.close();
        </script>
      </head>
      <body>
        <p>Authentication successful. You can close this window.</p>
      </body>
      </html>
    `);
  }
);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
