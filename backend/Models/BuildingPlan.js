const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuildingPlanSchema = new Schema({
  cityName: {
    type: String,
    required: true,
    index: true
  },
  pincode: {
    type: String,
    required: true,
    unique: true, // Make pincode unique to serve as a primary key
    index: true
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: false // Optional end date
  },
  ruleSequence: [{
    order: Number, // For maintaining sequence order
    ruleId: {
      type: Schema.Types.ObjectId,
      ref: 'ConstructionRule'
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    description: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'draft'],
    default: 'draft'
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

// Add indexes for common queries
BuildingPlanSchema.index({ cityName: 1, pincode: 1 }, { unique: true }); // Compound index for city+pincode
BuildingPlanSchema.index({ validFrom: 1, validUntil: 1 }); // Index for date range queries
BuildingPlanSchema.index({ status: 1 });

// Virtual property to check if rules are currently active
BuildingPlanSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.validFrom && 
         (!this.validUntil || now <= this.validUntil);
});

// Update the updatedAt timestamp before saving
BuildingPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BuildingPlan', BuildingPlanSchema); 