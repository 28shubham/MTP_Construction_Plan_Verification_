// // const mongoose = require("mongoose");
// // const Schema = mongoose.Schema;

// // const UserSchema = new Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   password: {
// //     type: String,
// //     required: true,
// //   },
// // });

// // const UserModel = mongoose.model("users", UserSchema);
// // module.exports = UserModel;





// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the schema for the verification form with all fields as numbers
// const verificationFormSchema = new Schema({
//   plotSize: {
//     type: Number,
//     required: true
//   },
// //   minimumSetback: {
// //     type: Number,
// //     required: true
// //   },
//   groundCoverage: {
//     type: Number,
//     required: true
//   },
//   floorAreaRatio: {
//     type: Number,
//     required: true
//   },
//   plinthLevel: {
//     type: Number,
//     required: true
//   },
//   maxHeight: {
//     type: Number,
//     required: true
//   },
//   maxStoreys: {
//     type: Number,
//     required: true
//   },
// //   habitableRoom: {
// //     type: Number,
// //     required: true
// //   },
// //   kitchen: {

// //     type: Number,
// //     required: true
// //   },
// //   bathroom: {
// //     type: Number,
// //     required: true
// //   },
// //   waterCloset: {
// //     type: Number,
// //     required: true
// //   },
// //   combinedBathWC: {
// //     type: Number,
// //     required: true
// //   },
// //   store: {
// //     type: Number,
// //     required: true
// //   },
// //   garage: {
// //     type: Number,
// //     required: true
// //   },
// //   singleOccupancyServantRoom: {
// //     type: Number,
// //     required: true
// //   },
// //   lightVentilation: {
// //     type: Number,
// //     required: true
// //   },
// //   ventilationShaft: {
// //     type: Number,
// //     required: true
// //   },
// //   interiorCourtyard: {
// //     type: Number,
// //     required: true
// //   },
//   verandah: {
//     type: Number,
//     required: true
//   },
//   staircaseWidth: {
//     type: Number,
//     required: true
//   },
//   staircaseTread: {
//     type: Number,
//     required: true
//   },
//   staircaseRiser: {
//     type: Number,
//     required: true
//   },
//   staircaseHeadHeight: {
//     type: Number,
//     required: true
//   },
//   constructionInBackCourtyard: {
//     type: String,
//     required: true
//   },
// //   lift: {
// //     type: Number,
// //     required: true
// //   },
// //   mumty: {
// //     type: Number,
// //     required: true
// //   },
// //   servicesInTerrace: {
// //     type: String,
// //     required: true
// //   },
// //   gate: {
// //     type: Number,
// //     required: true
// //   },
// //   boundaryWall: {
// //     type: Number,
// //     required: true
// //   },
// //   basement: {
// //     type: Number,
// //     required: true
// //   },
//   ramp: {
//     type: Number,
//     required: false
//   },
// //   parkingSpace: {
// //     type: Number,
// //     required: true
// //   },
//   allowableProjection: {
//     type: Number,
//     required: true
//   },
//   allowableBalcony: {
//     type: Number,
//     required: true
//   },
//   rainWaterHarvesting: {
//     type: String,
//     required: true
//   },
//   solarWaterHeating: {
//     type: String,
//     required: true
//   },
// //   solarPhotoVoltaic: {
// //     type: Number,
// //     required: true
// //   },
//   flushingSystem: {
//     type: Number,
//     required: true
//   },
// //   parapetRailing: {
// //     type: Number,
// //     required: true
// //   },
//   minimumPassage: {
//     type: Number,
//     required: true
//   },
//   amalgamationOrFragmentation: {
//     type: String,
//     required: true
//   }
// });

// // Create the model based on the schema
// const VerificationForm = mongoose.model('VerificationForm', verificationFormSchema);

// module.exports = VerificationForm;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema
const verificationFormSchema = new Schema({
  plotSize: Number,
  groundCoverage: Number,
  floorAreaRatio: Number,
  plinthLevel: Number,
  maxHeight: Number,
  maxStoreys: Number,
  verandah: Number,
  staircaseWidth: Number,
  staircaseTread: Number,
  staircaseRiser: Number,
  staircaseHeadHeight: Number,
  constructionInBackCourtyard: Number,
  ramp: String,
  allowableProjection: Number,
  allowableBalcony: Number,
  rainWaterHarvesting: String,
  solarWaterHeating: String,
  flushingSystem: Number,
  minimumPassage: Number,
  amalgamationOrFragmentation: String
});

// Create and export the model
const VerificationForm = mongoose.model('VerificationForm', verificationFormSchema);
module.exports = VerificationForm;
