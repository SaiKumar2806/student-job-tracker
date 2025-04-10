import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Interview', 'Declined'], default: 'Pending' },
  date: { type: String, required: true },
  link: { type: String }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
