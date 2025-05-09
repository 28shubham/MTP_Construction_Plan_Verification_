const express = require("express");
const router = express.Router();
const SimpleBuildingRuleController = require("../Controllers/SimpleBuildingRuleController");
const { check } = require("express-validator");
const authenticateToken = require("../Middlewares/AuthMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Verification = require("../models/Verification");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Multer destination called for file:", file.originalname);
    // Ensure absolute path is used
    const filesPath = path.resolve(__dirname, "../files");
    console.log("Files directory absolute path:", filesPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(filesPath)) {
      console.log("Creating files directory");
      fs.mkdirSync(filesPath, { recursive: true });
    }

    cb(null, filesPath);
  },
  filename: (req, file, cb) => {
    console.log("Multer filename called for file:", file.originalname);
    // Generate a safer filename with timestamp
    const timestamp = Date.now();
    const fileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_"); // Replace special chars
    const newFilename = `building_rule_${timestamp}_${fileName}`;
    console.log("Generated filename:", newFilename);
    cb(null, newFilename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(
    "Multer fileFilter called for file:",
    file.originalname,
    file.mimetype
  );

  // Accept more MIME types and file extensions
  const allowedMimeTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Additional PDF mime types that some browsers/systems might use
    "application/x-pdf",
    "application/acrobat",
    "application/vnd.pdf",
    "text/pdf",
    "binary/octet-stream", // Some systems use this for file uploads
  ];

  // Always log the actual mimetype for debugging
  console.log("Detected mimetype:", file.mimetype);

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    console.log(
      "File accepted - Filename:",
      file.originalname,
      "MIME type:",
      file.mimetype
    );
    cb(null, true);
  } else {
    console.log(
      "File rejected - Filename:",
      file.originalname,
      "MIME type:",
      file.mimetype
    );
    cb(
      new Error(
        `File type not allowed. Allowed types: PDF, TXT, DOC, DOCX. Got: ${file.mimetype}`
      ),
      false
    );
  }
};

// Add error handling middleware for multer
const multerErrorHandler = (err, req, res, next) => {
  console.error("Multer error:", err);
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: `Multer upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Define multer upload object
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Modified upload middleware with better error handling
const handleUpload = (req, res, next) => {
  console.log("Upload middleware called for request path:", req.path);
  console.log("Content-Type header:", req.headers["content-type"]);

  // Use single file upload with field name 'documentFile'
  upload.single("documentFile")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      if (err instanceof multer.MulterError) {
        // A Multer error occurred during upload
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File size exceeded. Maximum allowed is 10MB." });
        }
        return res
          .status(400)
          .json({ message: `Multer upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message });
    }

    if (req.file) {
      console.log("Upload successful, file details:", {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } else {
      console.log("No file was uploaded with this request, continuing");
    }
    next();
  });
};

// Create new building rules with file upload
router.post(
  "/",
  authenticateToken,
  handleUpload,
  [
    check("cityName", "City name is required").not().isEmpty(),
    check("pincode", "Pincode is required").not().isEmpty(),
    check("rules", "At least one rule is required").not().isEmpty(),
  ],
  SimpleBuildingRuleController.createRule
);

// Define routes with error handling
router.get("/", authenticateToken, (req, res, next) => {
  try {
    return SimpleBuildingRuleController.getAllRules(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/cities-pincodes", (req, res, next) => {
  try {
    return SimpleBuildingRuleController.getCitiesAndPincodes(req, res);
  } catch (error) {
    next(error);
  }
});

// Verification route
router.get("/verifications", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const verifications = await Verification.find({ userId }).sort({
      submissionDate: -1,
    });
    res.json(verifications);
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({ error: "Failed to fetch verification history" });
  }
});

// Other routes with explicit error handling
router.get("/city/:cityName", authenticateToken, (req, res, next) => {
  try {
    return SimpleBuildingRuleController.getRulesByCity(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/pincode/:pincode", authenticateToken, (req, res, next) => {
  try {
    return SimpleBuildingRuleController.getRulesByPincode(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/document", (req, res, next) => {
  try {
    return SimpleBuildingRuleController.getDocumentFile(req, res);
  } catch (error) {
    next(error);
  }
});

// Update building rules with file upload
router.put(
  "/:id",
  authenticateToken,
  handleUpload,
  SimpleBuildingRuleController.updateRule
);

// Delete building rules
router.delete(
  "/:id",
  authenticateToken,
  SimpleBuildingRuleController.deleteRule
);

module.exports = router;
