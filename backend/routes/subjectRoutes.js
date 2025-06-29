const express = require('express');
const router = express.Router();
const { 
  createSubject, 
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all subjects should be accessible by any logged-in user (Teacher or Admin)
router.route('/').get(protect, getSubjects);

// All other subject operations should be for Admins only
router.route('/').post(protect, admin, createSubject);

router.route('/:id')
  .get(protect, admin, getSubjectById)
  .put(protect, admin, updateSubject)
  .delete(protect, admin, deleteSubject);

module.exports = router;
