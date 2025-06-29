const express = require('express');
const router = express.Router();

// Import controller functions
const { 
  authUser, 
  registerUser, 
  getUsers,
  getUserById,
  updateUser,
  deleteUser 
} = require('../controllers/userController');

// Import middleware
const { protect, admin } = require('../middleware/authMiddleware');

// --- Public Routes ---
router.post('/login', authUser);

// --- Protected Admin Routes ---
router.route('/register').post(protect, admin, registerUser);

// Chaining routes for '/api/users'
router.route('/')
  .get(protect, admin, getUsers); // GET all users

// Chaining routes for '/api/users/:id'
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser); // DELETE a user

module.exports = router;
