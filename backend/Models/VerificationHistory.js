const mongoose = require('mongoose');

const CoordinateSchema = new mongoose.Schema({
  x0: { type: Number },
  y0: { type: Number },
  x1: { type: Number },
  y1: { type: Number }
});

const VerificationResultSchema = new mongoose.Schema({
  space: { type: String, required: true },
  area: { type: String, required: true },
  length: { type: String, required: true },
  width: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Compliant', 'Non-Compliant', 'Pending']
  },
  coordinates: { type: CoordinateSchema, required: true }
});

const VerificationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  pincode: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['Compliant', 'Non-Compliant', 'Pending'],
    default: 'Pending'
  },
  pdfUrl: {
    type: String,
    required: true
  },
  results: [VerificationResultSchema]
});

module.exports = mongoose.model('VerificationHistory', VerificationHistorySchema); 