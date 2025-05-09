const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Compliant", "Non-Compliant", "Pending"],
    default: "Pending",
  },
  pdfUrl: String,
  city: String,
  pincode: String,
  results: [
    {
      space: String,
      area: String,
      length: String,
      width: String,
      status: {
        type: String,
        enum: ["Compliant", "Non-Compliant"],
      },
      coordinates: {
        x0: Number,
        y0: Number,
        x1: Number,
        y1: Number,
      },
    },
  ],
});

module.exports = mongoose.model("Verification", verificationSchema);
