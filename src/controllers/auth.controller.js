// src/controllers/auth.controller.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const createError = require('http-errors');

/* helper: sign JWT */
const signToken = (u) =>
  jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

/* ----------------  POST /api/auth/register  ---------------- */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobileNumber, role } = req.body;
    if (!name || !email || !password || !mobileNumber) {
      throw createError(
        400,
        'name, email, password, and mobileNumber are required'
      );
    }
    if (await User.findOne({ email }))        throw createError(409, 'Email already in use');
    if (await User.findOne({ mobileNumber })) throw createError(409, 'Mobile number already in use');

    const allowedRoles = ['seeker', 'recruiter'];
    const userRole =
      role && allowedRoles.includes(role.toLowerCase())
        ? role.toLowerCase()
        : 'seeker';

    const user = new User({ name, email, mobileNumber, role: userRole });
    await user.setPassword(password);
    await user.save();

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
      token: signToken(user),
    });
  } catch (err) {
    next(err);
  }
};

/* ----------------  POST /api/auth/login  ------------------- */
exports.login = async (req, res, next) => {
  try {
    const { identifier, email, mobileNumber, password } = req.body;
    const idValue = identifier || email || mobileNumber;

    if (!idValue || !password) {
      throw createError(
        400,
        'identifier (email or phone) and password required'
      );
    }

    const query = idValue.includes('@')
      ? { email: idValue.toLowerCase() }
      : { mobileNumber: idValue.trim() };

    const user = await User.findOne(query);
    if (!user) throw createError(404, 'Account not found');
    if (!(await user.validatePassword(password)))
      throw createError(401, 'Incorrect password');

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
      token: signToken(user),
    });
  } catch (err) {
    next(err);
  }
};