// src/middleware/upload.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Choose storage strategy
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: 'jobdekho',               // Cloudinary folder
      resource_type: isPdf ? 'raw' : 'image',
      // Keep original extension (pdf or inferred for images)
      format: isPdf ? 'pdf' : undefined,
    };
  },
});

// Accept only PDF or common image mime-types
const allowed = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

function fileFilter(req, file, cb) {
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF or image files are allowed.'));
  }
}

// Create the multer upload instance
const parser = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = { parser };