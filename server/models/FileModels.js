const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  pageCount: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['uploaded', 'printing', 'printed', 'error'],
    default: 'uploaded'
  },
  printedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
