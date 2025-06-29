const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;