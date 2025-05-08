const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConstructionRuleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    default: 'General'
  },
  type: {
    type: String,
    required: true,
    enum: ['numeric', 'spatial', 'boolean', 'custom']
  },
  validationParams: {
    type: Object,
    default: {}
  },
  city: {
    type: String,
    index: true
  },
  active: {
    type: Boolean,
    default: true
  },
  severity: {
    type: String,
    enum: ['error', 'warning', 'info'],
    default: 'error'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
ConstructionRuleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ConstructionRule', ConstructionRuleSchema); 