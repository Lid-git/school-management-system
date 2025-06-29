const express = require('express');
const router = express.Router();

const {
  getAssignedStudents,
  assignMark,
} = require('../controllers/teacherController');

const { protect, teacher } = require('../middleware/authMiddleware');

// All routes here are protected and for teachers only
router.use(protect, teacher);

router.get('/students', getAssignedStudents);
router.post('/marks', assignMark);

module.exports = router;
