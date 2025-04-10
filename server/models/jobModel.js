const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Selected'],
    default: 'Applied',
  },
  date: {
    type: Date,
  },
  link: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
