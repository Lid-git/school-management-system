const Grade = require('../models/gradeModel');
const User = require('../models/userModel');
const Mark = require('../models/markModel');
const Subject = require('../models/subjectModel');

// @desc    Get all students assigned to the logged-in teacher's grades
// @route   GET /api/teacher/students
// @access  Private/Teacher
const getAssignedStudents = async (req, res) => {
  try {
    // Find grades where the logged-in teacher is assigned
    const grades = await Grade.find({ teachers: req.user._id });
    const gradeIds = grades.map(g => g._id);

    // Find all students who are in those grades
    const students = await User.find({ grade: { $in: gradeIds } })
      .populate('grade', 'name')
      .select('name email grade');
      
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching students.', error: error.message });
  }
};

// @desc    Assign or update marks for a student
// @route   POST /api/teacher/marks
// @access  Private/Teacher
const assignMark = async (req, res) => {
  try {
    const { studentId, subjectId, marks } = req.body;
    const teacherId = req.user._id;

    // Validation
    const student = await User.findById(studentId).populate('role');
    if (!student || student.role.name !== 'Student') {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    
    // Optional but recommended: Check if this teacher is allowed to assign marks to this student
    const studentGrade = await Grade.findById(student.grade);
    if (!studentGrade || !studentGrade.teachers.includes(teacherId)) {
        return res.status(403).json({ message: 'You are not authorized to assign marks to this student.' });
    }

    // Find if a mark already exists for this student and subject
    let mark = await Mark.findOne({ student: studentId, subject: subjectId });

    if (mark) {
      // Update existing mark
      mark.marks = marks;
      mark.teacher = teacherId; // Update the teacher who last modified the mark
    } else {
      // Create new mark
      mark = new Mark({
        student: studentId,
        subject: subjectId,
        marks,
        teacher: teacherId,
      });
    }

    const savedMark = await mark.save();
    res.status(201).json(savedMark);

  } catch (error) {
    res.status(500).json({ message: 'Server error assigning marks.', error: error.message });
  }
};


module.exports = {
  getAssignedStudents,
  assignMark,
};
