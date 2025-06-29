const express = require('express');
const router = express.Router();
const {
  createGrade,
  getGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
} = require('../controllers/gradeController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and for admins only
router.use(protect, admin);

router.route('/')
  .post(createGrade)
  .get(getGrades);

router.route('/:id')
  .get(getGradeById)
  .put(updateGrade)
  .delete(deleteGrade);

module.exports = router;
