// src/controllers/user.controller.js

const createError = require('http-errors');
const User = require('../models/User');

/**
 * GET /api/users/me
 * Return the logged-in user's profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    // req.user is populated by verifyToken middleware, omit passwordHash
    const { passwordHash, ...userData } = req.user.toObject();
    res.json(userData);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/me
 * Update allowed fields on the logged-in user's profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    // whitelist fields you allow to be updated:
    ['name', 'email'].forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw createError(400, 'No valid fields provided for update');
    }

    // If email is changing, ensure uniqueness
    if (updates.email && updates.email !== req.user.email) {
      const exists = await User.findOne({ email: updates.email });
      if (exists) {
        throw createError(409, 'Email already in use');
      }
    }

    Object.assign(req.user, updates);
    const updated = await req.user.save();

    const { passwordHash, ...userData } = updated.toObject();
    res.json(userData);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/me/resume
 * Handles single file upload (via parser.single('file')) and saves URL
 */
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file || !req.file.path) {
      throw createError(400, 'No file uploaded');
    }

    // req.file.path is the Cloudinary URL
    const url = req.file.path;
    req.user.resumeUrls.push(url);
    await req.user.save();

    res.json({ url });
  } catch (err) {
    next(err);
  }
};