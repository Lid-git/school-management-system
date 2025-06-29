const express = require('express');
const router = express.Router();

const {
  assignGradeToStudent,
  assignTeacherToGrade,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are protected and for admins only
router.use(protect, admin);

router.post('/assign-student-grade', assignGradeToStudent);
router.post('/assign-teacher-grade', assignTeacherToGrade);

module.exports = router;
