const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SimpleBuildingRuleSchema = new Schema({
  cityName: {
    type: String,
    required: true,
    index: true
  },
  pincode: {
    type: String,
    required: true,
    index: true
  },
  rules: [
    {
      sequence: {
        type: Number,
        required: true
      },
      roomType: {
        type: String,
        required: true,
        enum: ['bedroom', 'kitchen', 'hall', 'bathroom', 'balcony', 'other']
      },
      description: {
        type: String,
        required: true
      },
      dimensions: {
        minLength: {
          type: Number,
          required: true
        },
        minWidth: {
          type: Number,
          required: true
        },
        minArea: {
          type: Number,
          required: true
        },
        maxLength: {
          type: Number,
          required: false
        },
        maxWidth: {
          type: Number,
          required: false
        },
        maxArea: {
          type: Number,
          required: false
        },
        unit: {
          type: String,
          default: 'meters'
        }
      },
      additionalRequirements: {
        type: String
      },
      isRequired: {
        type: Boolean,
        default: true
      }
    }
  ],
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
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

// Add compound index for cityName + pincode
SimpleBuildingRuleSchema.index({ cityName: 1, pincode: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
SimpleBuildingRuleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SimpleBuildingRule', SimpleBuildingRuleSchema); 