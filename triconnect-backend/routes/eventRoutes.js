const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getUserRegisteredEvents,
  getEventsByCategory,
  getNearbyEvents,
} = require('../controllers/eventController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'poster-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Public routes
router.get('/', getEvents);
router.get('/category', getEventsByCategory);
router.get('/nearby', getNearbyEvents); // Get events near user's location (geospatial query)
router.get('/:id', getEventById);

// Protected routes
router.post('/register', authMiddleware, registerForEvent);
router.get('/user/registered', authMiddleware, getUserRegisteredEvents);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, upload.single('posterImage'), createEvent);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('posterImage'), updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
