const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

// Middleware to verify JWT and attach user to req.user
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(createError(err.status || 401, err.message));
  }
}

// Middleware factory to require a specific role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Not authenticated'));
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      return next(createError(403, 'Forbidden: insufficient privileges'));
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };