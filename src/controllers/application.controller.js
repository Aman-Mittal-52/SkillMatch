// src/controllers/application.controller.js
const createError = require('http-errors');
const Application = require('../models/Application');
const Job = require('../models/Job');

/* ------------------------------------------------------------------ */
/*  Seeker applies to a job                                            */
/*  POST  /api/jobs/:jobId/apply                                       */
/* ------------------------------------------------------------------ */
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { phone } = req.body;                   // phone is REQUIRED

    if (!phone) {
      throw createError(400, 'phone field is required');
    }

    // ensure the job exists and is open
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      throw createError(404, 'Job not available');
    }

    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      jobId,
      seekerId: req.user.id
    });

    if (existingApplication) {
      throw createError(200, 'You have already applied to this job');
    }

    const resumeUrl = req.file ? req.file.path : undefined; // resume optional

    const application = await Application.create({
      jobId,
      seekerId: req.user.id,
      seekerPhone: phone,
      resumeUrl,
    });

    res.json({
      applicationId: application.id,
      phone,
      resumeUrl,
      status: application.status,
    });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/*  Seeker lists their own applications                                */
/*  GET  /api/applications/me                                          */
/* ------------------------------------------------------------------ */
exports.listMyApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ seekerId: req.user.id })
      .populate('jobId', 'title companyName location');
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/*  Recruiter updates application status                               */
/*  PUT  /api/applications/:appId/status                               */
/* ------------------------------------------------------------------ */
exports.updateStatus = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'rejected'];

    if (!validStatuses.includes(status)) {
      throw createError(400, 'Invalid status');
    }

    const app = await Application.findById(appId).populate('jobId');
    if (!app) throw createError(404, 'Application not found');

    // recruiter can update only if they posted the job
    if (app.jobId.postedBy.toString() !== req.user.id) {
      throw createError(403, 'Forbidden');
    }

    app.status = status;
    await app.save();
    res.json(app);
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/*  Recruiter lists applications for a specific job                    */
/*  GET  /api/applications/job/:jobId                                  */
/* ------------------------------------------------------------------ */
exports.listForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) throw createError(404, 'Job not found');

    // recruiter can view only their own job's applications
    if (job.postedBy.toString() !== req.user.id) {
      throw createError(403, 'Forbidden');
    }

    const apps = await Application.find({ jobId })
      .populate('seekerId', 'name email mobileNumber resumeUrls');

    res.json(apps);
  } catch (err) {
    next(err);
  }
};