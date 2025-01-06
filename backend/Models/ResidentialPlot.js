const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema
const verificationFormSchema = new Schema(
  {
    plotSize: { type: Number, required: true, min: 0 },
    groundCoverage: { type: Number, required: true, min: 0 },
    floorAreaRatio: { type: Number, required: true, min: 0 },
    plinthLevel: { type: Number, required: true, min: 0 },
    maxHeight: { type: Number, required: true, min: 0 },
    maxStoreys: { type: Number, required: true, min: 1 },
    habitableRoom: {
      area: { type: Number, min: 9.5 },
      width: { type: Number, min: 2.4 },
      height: { type: Number, min: 2.75 },
    },
    kitchen: {
      area: { type: Number, min: 5 },
      width: { type: Number, min: 1.8 },
    },
    dining: {
      area: { type: Number, min: 7.5 },
      width: { type: Number, min: 2.1 },
    },
    bathroom: {
      area: { type: Number, min: 1.8 },
      width: { type: Number, min: 1.2 },
      height: { type: Number, min: 2.1 },
    },
    wc: {
      area: { type: Number, min: 1.2 },
      width: { type: Number, min: 0.9 },
      height: { type: Number, min: 2.1 },
    },
    combinedBathWC: {
      area: { type: Number, min: 2.8 },
      width: { type: Number, min: 1.2 },
      height: { type: Number, min: 2.1 },
    },
    store: {
      area: { type: Number, min: 3.0 },
      width: { type: Number, min: 1.2 },
      height: { type: Number, min: 2.2 },
    },
    garage: {
      area: { type: Number, min: 18.0 },
      width: { type: Number, min: 3.0 },
      height: { type: Number, min: 2.4 },
    },
    singleOccupancyServantRoom: {
      area: { type: Number, min: 7.5 },
      width: { type: Number, min: 2.1 },
      height: { type: Number, min: 2.75 },
    },

    verandah: { type: Number, min: 0 },
    staircase: {
      width: { type: Number, min: 0 },
      tread: { type: Number, min: 0 },
      riser: { type: Number, min: 0.19 },
      headHeight: { type: Number, min: 2.2 },
    },
    constructionInBackCourtyard: { type: Boolean, default: false },
    ramp: {
      type: String,
      enum: ["Required", "Not Required"],
      default: "Not Required",
    },
    allowableProjection: { type: Number, min: 0 },
    allowableBalcony: { type: Number, min: 0 },
    rainWaterHarvesting: {
      type: String,
      enum: ["Required", "Not Required"],
      default: "Not Required",
    },
    solarWaterHeating: {
      type: String,
      enum: ["Recommended", "Not Required"],
      default: "Recommended",
    },
    flushingSystem: {
      type: String,
      enum: ["Dual-Flush", "Single-Flush"],
      default: "Dual-Flush",
    },
    minimumPassage: { type: Number, min: 1.05 },
    amalgamationOrFragmentation: {
      type: String,
      enum: ["Amalgamation Allowed", "Fragmentation Not Allowed"],
      default: "Fragmentation Not Allowed",
    },
    lift: { type: Boolean, default: false },
    mumty: { type: Boolean, default: false },
    basement: {
      allowed: { type: Boolean, default: false },
      setback: {
        type: Number,
        min: 0,
        required: function () {
          return this.basement.allowed;
        },
      },
      clearHeight: {
        type: Number,
        required: function () {
          return this.basement.allowed;
        },
      },
    },
    parking: {
      requiredSpaces: { type: Number, min: 1 },
      type: {
        type: String,
        enum: ["Equivalent Car Space", "Dwelling Unit Size Based"],
        required: true,
      },
    },
    solarPhotoVoltaic: { type: Number, min: 0 },
    parapetOrRailingHeight: {
      minHeight: { type: Number, min: 1.0 },
      maxHeight: { type: Number, max: 1.4 },
    },
  },
  { timestamps: true }
);

// Create and export the model
const VerificationForm = mongoose.model(
  "VerificationForm",
  verificationFormSchema
);
module.exports = VerificationForm;
