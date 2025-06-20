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
    ['name', 'mobileNumber'].forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw createError(400, 'No valid fields provided for update');
    }

    // If mobileNumber is changing, ensure uniqueness
    if (updates.mobileNumber && updates.mobileNumber !== req.user.mobileNumber) {
      const exists = await User.findOne({ mobileNumber: updates.mobileNumber });
      if (exists) {
        throw createError(409, 'Mobile number already in use');
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

    // Enforce a maximum of 6 resumes per user
    if (req.user.resumeUrls.length >= 9) {
      throw createError(400, 'You can upload a maximum of 9 resumes only');
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

/**
 * DELETE /api/users/me/resume
 * Remove a resume URL from the user's profile
 * Expects { url } in the request body
 */
exports.deleteResume = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      throw createError(400, 'No resume URL provided');
    }

    // Remove the URL from the user's resumeUrls array
    const index = req.user.resumeUrls.indexOf(url);
    if (index === -1) {
      throw createError(404, 'Resume URL not found');
    }
    req.user.resumeUrls.splice(index, 1);
    await req.user.save();

    res.json({ success: true, resumeUrls: req.user.resumeUrls });
  } catch (err) {
    next(err);
  }
};