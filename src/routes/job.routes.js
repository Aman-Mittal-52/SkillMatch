// src/routes/job.routes.js
const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const jobController = require('../controllers/job.controller');
const appController = require('../controllers/application.controller');
const { parser } = require('../middleware/upload');

/* ---------- PUBLIC ROUTES ---------- */
router.get('/search', jobController.searchJobs);  // ?query=keyword
router.get('/', jobController.getAllJobs);        // list open jobs
router.get('/:id', jobController.getJob);         // job detail

/* ---------- SEEKER APPLIES TO A JOB (phone required, resume optional) ---------- */
router.post(
  '/:jobId/apply',
  verifyToken,
  requireRole('seeker'),
  parser.single('file'),               // will be undefined if no file
  appController.applyToJob
);

/* ---------- RECRUITER ROUTES ---------- */
router.get(
  '/recruiter/jobs',
  verifyToken,
  requireRole('recruiter'),
  jobController.getJobsByRecruiter
);

router.post(
  '/',
  verifyToken,
  requireRole('recruiter'),
  jobController.createJob
);

router.put(
  '/:id',
  verifyToken,
  requireRole('recruiter'),
  jobController.updateJob
);

router.delete(
  '/:id',
  verifyToken,
  requireRole('recruiter'),
  jobController.deleteJob
);

module.exports = router;