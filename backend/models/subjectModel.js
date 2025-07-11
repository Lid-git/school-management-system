const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;