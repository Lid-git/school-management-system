const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // <-- NEW FIELD
}, { timestamps: true });

const Mark = mongoose.model('Mark', markSchema);
module.exports = Mark;
