const User = require('../models/userModel');
const Grade = require('../models/gradeModel');
const Role = require('../models/roleModel');

// @desc    Assign a grade to a student
// @route   POST /api/admin/assign-student-grade
// @access  Private/Admin
const assignGradeToStudent = async (req, res) => {
  try {
    const { studentId, gradeId } = req.body;

    // Find the student and validate their role
    const student = await User.findById(studentId).populate('role');
    if (!student || student.role.name !== 'Student') {
      return res.status(404).json({ message: 'Student not found or user is not a student.' });
    }

    // Find the grade
    const grade = await Grade.findById(gradeId);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found.' });
    }

    // Assign the grade to the student
    student.grade = gradeId;
    await student.save();

    res.status(200).json({ message: `Student ${student.name} assigned to grade ${grade.name} successfully.` });

  } catch (error) {
    res.status(500).json({ message: 'Server error assigning grade to student.', error: error.message });
  }
};

// @desc    Assign a teacher to a grade
// @route   POST /api/admin/assign-teacher-grade
// @access  Private/Admin
const assignTeacherToGrade = async (req, res) => {
  try {
    const { teacherId, gradeId } = req.body;

    // Find the teacher and validate their role
    const teacher = await User.findById(teacherId).populate('role');
    if (!teacher || teacher.role.name !== 'Teacher') {
      return res.status(404).json({ message: 'Teacher not found or user is not a teacher.' });
    }

    // Find the grade and add the teacher
    const grade = await Grade.findById(gradeId);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found.' });
    }

    // Check if teacher is already assigned to this grade
    if (grade.teachers.includes(teacherId)) {
      return res.status(400).json({ message: 'Teacher is already assigned to this grade.' });
    }

    grade.teachers.push(teacherId);
    await grade.save();

    res.status(200).json({ message: `Teacher ${teacher.name} assigned to grade ${grade.name} successfully.` });

  } catch (error) {
    res.status(500).json({ message: 'Server error assigning teacher to grade.', error: error.message });
  }
};

module.exports = {
  assignGradeToStudent,
  assignTeacherToGrade,
};
