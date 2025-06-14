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
      postedBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

/* ---------- LIST ALL OPEN JOBS ---------- */
exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'open' }).populate(
      'postedBy',
      'name email'
    );
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

/* ---------- KEYWORD SEARCH ---------- */
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