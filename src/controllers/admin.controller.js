// src/controllers/admin.controller.js
const createError = require('http-errors');
const User = require('../models/User');
const Job  = require('../models/Job');

/* ------------------------------------------------------------------ */
/*  GET /api/admin/users?role=&page=&limit=                            */
/*  List users with optional role filter and pagination                */
/* ------------------------------------------------------------------ */
exports.listUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select('-passwordHash')
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({ total, page: +page, limit: +limit, users });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/*  PUT /api/admin/users/:id/ban                                       */
/*  Toggle ban / unban                                                */
/* ------------------------------------------------------------------ */
exports.toggleBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw createError(404, 'User not found');

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ id: user.id, isBanned: user.isBanned });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/*  GET /api/admin/jobs?page=&limit=&status=                           */
/*  List jobs site-wide                                               */
/* ------------------------------------------------------------------ */
exports.listJobs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({ total, page: +page, limit: +limit, jobs });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/*  DELETE /api/admin/jobs/:id                                         */
/*  Hard-delete job (scam / spam)                                     */
/* ------------------------------------------------------------------ */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) throw createError(404, 'Job not found');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};