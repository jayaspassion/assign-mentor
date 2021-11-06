const mongoose = require('mongoose');

// Create Schema
const MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  students: [
      {
        student_id : {
            type: String,
            required: true
            },
        student_name: {
                type: String
            }
        }
    ]
});

const Mentor = mongoose.model('mentor', MentorSchema);

module.exports = Mentor ;