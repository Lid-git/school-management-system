const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes that require a logged-in user
const protect = async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header, and if it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID that was in the token
      // We select '-password' to exclude the password field from being returned
      req.user = await User.findById(decoded.id).select('-password').populate('role', 'name');

      // Move on to the next function in the route
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      // Using a plain object for the error response for consistency
      return res.json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401);
    // Using a plain object for the error response for consistency
    return res.json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user is an Admin
const admin = (req, res, next) => {
  // 'protect' middleware must run first to get req.user
  if (req.user && req.user.role.name === 'Admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403); // 403 means Forbidden
    // Using a plain object for the error response for consistency
    return res.json({ message: 'Not authorized as an Admin' });
  }
};

// Middleware to check if the user is a Teacher
const teacher = (req, res, next) => {
  if (req.user && req.user.role.name === 'Teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a Teacher' });
  }
};

// Middleware to check if the user is a Student
const student = (req, res, next) => {
  if (req.user && req.user.role.name === 'Student') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a Student' });
  }
};


module.exports = { protect, admin, teacher, student }; // <-- UPDATED EXPORT
