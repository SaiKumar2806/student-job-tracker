import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

// App setup
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://127.0.0.1:27017/jobTracker';
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  

// Schema
const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true }, // can use Date type later if needed
  link: { type: String, required: true }
});

// Model
const Job = mongoose.model('Job', jobSchema);

// Routes

// Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// Create job
app.post('/api/jobs', async (req, res) => {
  try {
    const { company, position, status, date, link } = req.body;
    const newJob = new Job({ company, position, status, date, link });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create job', error: err.message });
  }
});

// Update job
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { company, position, status, date, link } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { company, position, status, date, link },
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update job', error: err.message });
  }
});

// Delete job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete job', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
