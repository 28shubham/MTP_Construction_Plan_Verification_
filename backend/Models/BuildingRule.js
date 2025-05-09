const mongoose = require("mongoose");

const buildingRuleSchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  rules: [
    {
      type: Object,
      required: true,
    },
  ],
  documentPath: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BuildingRule", buildingRuleSchema);
