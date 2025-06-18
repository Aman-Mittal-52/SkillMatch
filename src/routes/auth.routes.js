// src/routes/auth.routes.js
const router   = require('express').Router();
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const authCtrl = require('../controllers/auth.controller');

/* basic auth */
router.post('/register', authCtrl.register);
router.post('/login',    authCtrl.login);

/* Google OAuth */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`https://skill-match-jsx.vercel.app/?token=${token}`);
  }
);

module.exports = router;