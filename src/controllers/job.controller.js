// src/controllers/job.controller.js
const createError = require('http-errors');
const Job = require('../models/Job');

/* ---------- CREATE JOB ---------- */
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      description,
      location,
      contactName,
      mobileNumber,
      whatsappNumber,
      salary,
      tags,
      jobType,
    } = req.body;

    if (
      !title ||
      !companyName ||
      !description ||
      !location ||
      !contactName ||
      !mobileNumber
    ) {
      throw createError(
        400,
        'title, companyName, description, location, contactName, and mobileNumber are required'
      );
    }

    // Create new job with optional jobType (defaults in schema)
    const job = await Job.create({
      title,
      companyName,
      description,
      location,
      contactName,
      mobileNumber,
      whatsappNumber,
      salary,
      tags: tags || [],
      jobType,
      postedBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

/* ---------- LIST All Open Jobs, with optional filters ---------- */
exports.getAllJobs = async (req, res, next) => {
  try {
    const { search, type, sortBy } = req.query;
    const query = { status: 'open' };

    // Text search?
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by jobType?
    if (type) {
      const allowedTypes = [
        'full-time',
        'part-time',
        'internship',
        'freelance',
        'temporary',
      ];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ message: `Invalid job type: ${type}` });
      }
      query.jobType = type;
    }

    // Sorting logic
    let sort = { createdAt: -1 }; // default newest first
    if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    } else if (search) {
      // if doing a text search, sort by relevance
      sort = { score: { $meta: 'textScore' } };
    }

    // Projection for text score
    const projection = search ? { score: { $meta: 'textScore' } } : {};

    const jobs = await Job.find(query, projection)
      .sort(sort)
      .populate('postedBy', 'name email');

    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

/* ---------- GET SINGLE JOB ---------- */
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'postedBy',
      'name email'
    );
    if (!job) throw createError(404, 'Job not found');
    res.json(job);
  } catch (err) {
    next(err);
  }
};

/* ---------- UPDATE JOB ---------- */
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw createError(404, 'Job not found');
    if (job.postedBy.toString() !== req.user.id) {
      throw createError(403, 'Not authorized to update this job');
    }

    // Merge updates (including jobType if provided)
    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/* ---------- DELETE JOB ---------- */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw createError(404, 'Job not found');
    if (job.postedBy.toString() !== req.user.id) {
      throw createError(403, 'Not authorized to delete this job');
    }
    await job.remove();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/* ---------- KEYWORD SEARCH (optional) ---------- */
exports.searchJobs = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'query parameter required' });
    }

    const jobs = await Job.find(
      { $text: { $search: query }, status: 'open' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('postedBy', 'name email');

    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

/* ---------- GET JOBS BY RECRUITER ---------- */
exports.getJobsByRecruiter = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email');
    
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
