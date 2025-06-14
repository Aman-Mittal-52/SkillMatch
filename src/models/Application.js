// src/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    seekerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seekerPhone:  { type: String, required: true, trim: true },
    resumeUrl:    { type: String },
    status:       { type: String, enum: ['applied', 'shortlisted', 'rejected'], default: 'applied' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);