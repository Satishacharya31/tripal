const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload - upload image to Cloudinary
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    const result = await cloudinary.uploader.upload_stream({
      folder: req.body.folder || 'guide-app',
      resource_type: 'image',
      format: 'jpg',
    }, (error, result) => {
      if (error) {
        return res.status(500).json({ status: 'error', message: error.message });
      }
      return res.status(200).json({ status: 'success', url: result.secure_url });
    });
    // Pipe buffer to upload_stream
    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
