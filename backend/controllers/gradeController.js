const Grade = require('../models/gradeModel');
const User = require('../models/userModel');

// @desc    Create a new grade
// @route   POST /api/grades
// @access  Private/Admin
const createGrade = async (req, res) => {
  try {
    const { name } = req.body;
    const grade = new Grade({ name });
    const createdGrade = await grade.save();
    res.status(201).json(createdGrade);
  } catch (error) {
    res.status(400).json({ message: 'Error creating grade', error: error.message });
  }
};

// @desc    Get all grades
// @route   GET /api/grades
// @access  Private/Admin
const getGrades = async (req, res) => {
  try {
    const grades = await Grade.find({}).populate('teachers', 'name email');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
};

// @desc    Get grade by ID
// @route   GET /api/grades/:id
// @access  Private/Admin
const getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('teachers', 'name email');
    if (grade) {
      res.json(grade);
    } else {
      res.status(404).json({ message: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grade', error: error.message });
  }
};

// @desc    Update a grade
// @route   PUT /api/grades/:id
// @access  Private/Admin
const updateGrade = async (req, res) => {
  try {
    const { name } = req.body;
    const grade = await Grade.findById(req.params.id);

    if (grade) {
      grade.name = name || grade.name;
      const updatedGrade = await grade.save();
      res.json(updatedGrade);
    } else {
      res.status(404).json({ message: 'Grade not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating grade', error: error.message });
  }
};

// @desc    Delete a grade
// @route   DELETE /api/grades/:id
// @access  Private/Admin
const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (grade) {
      // Optional: Check if any user is assigned to this grade before deleting
      const usersInGrade = await User.countDocuments({ grade: grade._id });
      if (usersInGrade > 0) {
        return res.status(400).json({ message: 'Cannot delete grade. Users are still assigned to it.' });
      }
      await Grade.deleteOne({ _id: grade._id });
      res.json({ message: 'Grade removed' });
    } else {
      res.status(404).json({ message: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting grade', error: error.message });
  }
};

module.exports = {
  createGrade,
  getGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
};
