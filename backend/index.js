const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const { verifyForm } = require("./Controllers/verificationController");
const { PythonShell } = require("python-shell");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
require("./Models/db");

const PdfDetails = require("./Models/pdfDetails");

const app = express();
const PORT = process.env.PORT || 8080;

// 🛡️ **Middleware**
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Support form-data
app.use(cors());
app.use("/files", express.static(path.join(__dirname, "files"))); // Serve PDF files

// 🛡️ **Authentication & Product Routes**
app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);

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

  const { title } = req.body;
  const fileName = req.file.filename;

  try {
    // Store file details in the database
    const pdfEntry = await PdfDetails.create({ title, pdf: fileName });

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
