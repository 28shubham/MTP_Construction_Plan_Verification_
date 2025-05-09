const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const adminRoutes = require("./Routes/AdminRoutes");
const ProductRouter = require("./Routes/ProductRouter");
const buildingPlanRoutes = require("./Routes/buildingPlanRoutes");
const constructionRuleRoutes = require("./Routes/constructionRuleRoutes");
const simpleBuildingRuleRoutes = require("./Routes/simpleBuildingRuleRoutes");
const verificationHistoryRoutes = require("./Routes/VerificationHistoryRoutes");
const { verifyForm } = require("./Controllers/verificationController");
const { PythonShell } = require("python-shell");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
require("./Models/db");

const PdfDetails = require("./Models/pdfDetails");

const app = express();
const PORT = process.env.PORT || 8081;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/files", express.static(path.join(__dirname, "files")));

// Routes
app.use("/auth", AuthRouter);
app.use("/admin", adminRoutes);
app.use("/products", ProductRouter);
app.use("/api/building-plans", buildingPlanRoutes);
app.use("/api/construction-rules", constructionRuleRoutes);
app.use("/api/simple-building-rules", simpleBuildingRuleRoutes);
app.use("/api/user", verificationHistoryRoutes);

// 🛡️ **Verify Form Route**
app.post("/api/verifyForm", verifyForm);

//  **Multer Configuration for PDF uploads**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "files"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// 📝 **Upload PDF without Verification**
app.post("/upload-files", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "No file uploaded or invalid file type.",
    });
  }

  const {
    title,
    city,
    pincode,
    scale_value,
    scale_unit,
    scale_equals,
    scale_equals_unit,
  } = req.body;

  const fileName = req.file.filename;

  try {
    // Store file details in the database
    const pdfEntry = await PdfDetails.create({
      title,
      pdf: fileName,
      city: city || null,
      pincode: pincode || null,
      scale_value: scale_value || "1",
      scale_unit: scale_unit || "inch",
      scale_equals: scale_equals || "1",
      scale_equals_unit: scale_equals_unit || "feet",
    });

    res.json({
      status: "ok",
      message: "File uploaded successfully",
      filePath: fileName,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 📝 **Get Uploaded Files**
app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfDetails.find({});
    res.json({ status: "ok", data });
  } catch (error) {
    console.error("Get Files Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 🛠️ **Serve PDF Files Dynamically**
app.get("/files/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "files", filename);
  res.sendFile(filePath);
});

// 🛠️ **Start Server**
app
  .listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server Error:", err);
  });
