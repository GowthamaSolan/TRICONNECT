const express = require('express');
const {
  userSignUp,
  userSignIn,
  googleLogin,
  adminSignUp,
  getCurrentUser,
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/user/signup', userSignUp);
router.post('/user/signin', userSignIn);
router.post('/google-login', googleLogin);
router.post('/admin/signup', adminSignUp);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

// Multer for profile image upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG and PNG images are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const { updateProfile } = require('../controllers/authController');

router.put('/me', authMiddleware, upload.single('profileImage'), updateProfile);

module.exports = router;
