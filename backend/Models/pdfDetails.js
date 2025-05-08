const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
  {
    pdf: { type: String, required: true },
    title: { type: String, required: true },
    city: { type: String, required: false },
    pincode: { type: String, required: false },
    scale_value: { type: String, required: false },
    scale_unit: { type: String, required: false },
    scale_equals: { type: String, required: false },
    scale_equals_unit: { type: String, required: false },
  },
  { collection: "PdfDetails" }
);

module.exports = mongoose.model("PdfDetails", PdfDetailsSchema);
