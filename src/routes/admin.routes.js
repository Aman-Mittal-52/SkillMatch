// src/routes/admin.routes.js
const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const adminCtrl = require('../controllers/admin.controller');

/* -- all admin routes are gated here -- */
router.use(verifyToken, requireRole('admin'));

/* User management */
router.get('/users', adminCtrl.listUsers);
router.put('/users/:id/ban', adminCtrl.toggleBan);

/* Job moderation */
router.get('/jobs', adminCtrl.listJobs);
router.delete('/jobs/:id', adminCtrl.deleteJob);
router.put('/jobs/:id', adminCtrl.updateJobStatus);

module.exports = router;