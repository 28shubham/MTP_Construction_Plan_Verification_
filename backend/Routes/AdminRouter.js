const express = require("express");
const router = express.Router();
const {
  adminRegisterValidation,
  adminLoginValidation,
  isAdmin,
  isSuperAdmin,
} = require("../Middlewares/AdminValidation");
const {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
} = require("../Controllers/AdminController");

// Admin authentication routes
router.post("/register", adminRegisterValidation, registerAdmin);
router.post("/login", adminLoginValidation, loginAdmin);

// Admin management routes (protected by super_admin middleware)
router.get("/all", isSuperAdmin, getAllAdmins);
router.put("/:id", isSuperAdmin, updateAdmin);
router.delete("/:id", isSuperAdmin, deleteAdmin);

module.exports = router; 