// src/routes/user.routes.js

const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const { parser } = require('../middleware/upload');

// GET /api/users/me
// — Fetch the logged-in user's profile
router.get('/me', verifyToken, userController.getProfile);

// PUT /api/users/me
// — Update fields on the logged-in user's profile
router.put('/me', verifyToken, userController.updateProfile);

// POST /api/users/me/resume
// — Upload a resume (PDF/image) for the logged-in user
router.post(
  '/me/resume',
  verifyToken,
  parser.single('file'),
  userController.uploadResume
);

// DELETE /api/users/me/resume
// — Delete a resume URL for the logged-in user
router.delete(
  '/me/resume',
  verifyToken,
  userController.deleteResume
);

module.exports = router;