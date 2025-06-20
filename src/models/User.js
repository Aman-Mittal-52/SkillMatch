// src/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    passwordHash: String,
    role:         { type: String, enum: ['seeker','recruiter','admin'], default: 'seeker' },
    googleId:     { type: String, unique: true, sparse: true },
    resumeUrls:   { type: [String], default: [] },
    isBanned:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* helpers */
userSchema.methods.setPassword = async function (pw) {
  this.passwordHash = await bcrypt.hash(pw, 12);
};
userSchema.methods.validatePassword = async function (pw) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(pw, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);