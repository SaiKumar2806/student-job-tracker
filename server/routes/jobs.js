const express = require('express');
const router = express.Router();
const Job = require('../models/jobModel');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new job
router.post('/', async (req, res) => {
    try {
      const newJob = new Job(req.body);
      const savedJob = await newJob.save();
      res.status(201).json(savedJob); // ✅ Send back the saved job
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong while saving the job' });
    }
  });
  

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { company, position, status, date, link } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { company, position, status, date, link },
      { new: true }
    );
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
