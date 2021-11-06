const mongoose = require('mongoose');

// Create Schema
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  place: {
    type: String
  },
  mentor_id: {
    type: String
  }
});

const Student = mongoose.model('student', StudentSchema);

module.exports = Student ;