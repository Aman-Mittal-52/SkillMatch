// src/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    companyName:  { type: String, required: true, trim: true },
    description:  { type: String, required: true },
    location:     { type: String, required: true, trim: true },
    contactName:  { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, trim: true },
    salary:       { type: String, trim: true },
    tags:         { type: [String], default: [] },
    postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:       { type: String, enum: ['open', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

// ---------- TEXT INDEX for keyword search ----------
jobSchema.index({
  title: 'text',
  description: 'text',
  companyName: 'text',
  location: 'text',
  tags: 'text',
});

module.exports = mongoose.model('Job', jobSchema);