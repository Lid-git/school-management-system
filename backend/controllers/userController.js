const User = require('../models/userModel');
const Role = require('../models/roleModel');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('role', 'name');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    const user = await User.create({ name, email, password, role: role._id });
    if (user) {
      const populatedUser = await User.findById(user._id).populate('role', 'name').select('-password');
      res.status(201).json(populatedUser);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register User Error:', error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate('role', 'name')
      .populate('grade', 'name') // Populate the grade field
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role', 'name').select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.roleName) {
        const role = await Role.findOne({ name: req.body.roleName });
        if (!role) {
          return res.status(400).json({ message: 'Invalid role specified' });
        }
        user.role = role._id;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const populatedUser = await User.findById(updatedUser._id).populate('role', 'name').select('-password');
      res.json(populatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This email is already in use by another account.' });
    }
    console.error('UPDATE USER ERROR:', error);
    res.status(500).json({ message: 'Server error during user update' });
  }
};


// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authUser, registerUser, getUsers, getUserById, updateUser, deleteUser };
