const express = require("express");
const router = express.Router();
const AdminController = require("../Controllers/AdminController");
const { adminRegisterValidation, adminLoginValidation, isAdmin } = require("../Middlewares/AdminValidation");
const verifyToken = require("../Middlewares/authMiddleware");

// Public routes
router.post("/login", adminLoginValidation, AdminController.loginAdmin);

// Protected routes
router.use(verifyToken); // Apply token verification to all routes below

router.get("/", isAdmin, AdminController.getAllAdmins);
router.get("/:id", isAdmin, AdminController.getAdminById);
router.post("/register", isAdmin, adminRegisterValidation, AdminController.registerAdmin);
router.put("/:id", isAdmin, AdminController.updateAdmin);
router.delete("/:id", isAdmin, AdminController.deleteAdmin);

module.exports = router; 