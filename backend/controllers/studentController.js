const Mark = require('../models/markModel');
const User = require('../models/userModel');

// @desc    Get the logged-in student's profile
// @route   GET /api/student/profile
// @access  Private/Student
const getMyProfile = async (req, res) => {
  try {
    // The user object is already attached to the request by the 'protect' middleware
    // We just need to populate the grade information
    const studentProfile = await User.findById(req.user._id)
      .populate('grade', 'name')
      .select('name email grade');

    if (studentProfile) {
      res.json(studentProfile);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile.', error: error.message });
  }
};


// @desc    Get the logged-in student's marks
// @route   GET /api/student/marks
// @access  Private/Student
const getMyMarks = async (req, res) => {
  try {
    // Find all marks for the logged-in student's ID
    const marks = await Mark.find({ student: req.user._id })
      .populate('subject', 'name description') // Get subject details
      .populate('teacher', 'name'); // Get the name of the teacher who assigned the marks

    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching marks.', error: error.message });
  }
};


module.exports = {
  getMyProfile,
  getMyMarks,
};
