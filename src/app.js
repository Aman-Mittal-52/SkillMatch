require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// --- Global Middleware ---
app.use(helmet());
// app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(morgan('tiny'));

// Initialize Passport.js for authentication
const passport = require('passport');
require('./config/passport'); // Load passport configuration
app.use(passport.initialize());

// Log CORS requests for debugging
app.use((req, res, next) => {
  console.log('CORS Request:', {
    origin: req.headers.origin,
    method: req.method,
    path: req.path,
    req:req
  });
  next();
});

// --- Route Mounts ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/applications', require('./routes/application.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Route to expose all environment variables (for debugging ONLY - REMOVE in production!)
app.get('/env', (req, res) => {
  // Log the request for debugging
  console.log('GET /env called');
  // Log all environment variables to the console
  console.log('Current process.env:', process.env);
  // Send all environment variables as JSON response
  res.json(process.env);
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;