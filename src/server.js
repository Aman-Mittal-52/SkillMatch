require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; 
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('🗄️  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 JobDekho API listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });