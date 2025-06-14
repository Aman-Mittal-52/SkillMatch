// src/routes/application.routes.js

const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const appCtrl = require('../controllers/application.controller');

/* ---------- SEEKER ROUTES ---------- */
// List the logged-in seeker’s applications
router.get(
  '/me',
  verifyToken,
  requireRole('seeker'),
  appCtrl.listMyApplications
);

/* ---------- RECRUITER ROUTES ---------- */
// Update application status (shortlist / reject / etc.)
router.put(
  '/:appId/status',
  verifyToken,
  requireRole('recruiter'),
  appCtrl.updateStatus
);

// List all applications for a specific job posted by this recruiter
router.get(
  '/job/:jobId',
  verifyToken,
  requireRole('recruiter'),
  appCtrl.listForJob
);

module.exports = router;