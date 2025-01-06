const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
  {
    pdf: { type: String, required: true },
    title: { type: String, required: true },
  },
  { collection: "PdfDetails" }
);

module.exports = mongoose.model("PdfDetails", PdfDetailsSchema);
