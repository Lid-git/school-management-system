const express = require('express');
const router = express.Router();

const {
  getMyProfile,
  getMyMarks,
} = require('../controllers/studentController');

const { protect, student } = require('../middleware/authMiddleware');

// All routes here are protected and for students only
router.use(protect, student);

router.get('/profile', getMyProfile);
router.get('/marks', getMyMarks);

module.exports = router;
