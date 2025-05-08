const Admin = require("../Models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleError, handleSuccess } = require('../utils/responseHandler');

// Register a new admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      permissions,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      data: {
        name: admin.name,
        email: admin.email,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};

// Admin Login Controller
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return handleError(res, 'Email and password are required', 400);
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return handleError(res, 'Invalid email or password', 401);
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return handleError(res, 'Invalid email or password', 401);
    }

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        permissions: admin.permissions,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: "1d" }
    );

    // Send success response
    return handleSuccess(res, 'Login successful', {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          permissions: admin.permissions,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return handleError(res, 'Internal server error', 500);
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    // Find all admins and exclude sensitive data
    const admins = await Admin.find({}, { password: 0, __v: 0 });
    
    if (!admins || admins.length === 0) {
      return handleSuccess(res, 'No admins found', []);
    }

    return handleSuccess(res, 'Admins fetched successfully', admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return handleError(res, 'Failed to fetch admins', 500);
  }
};

// Get single admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id, { password: 0, __v: 0 });
    
    if (!admin) {
      return handleError(res, 'Admin not found', 404);
    }

    return handleSuccess(res, 'Admin fetched successfully', admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    return handleError(res, 'Failed to fetch admin', 500);
  }
};

// Update admin details
const updateAdmin = async (req, res) => {
  try {
    const { name, email, permissions } = req.body;
    const adminId = req.params.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (permissions) admin.permissions = permissions;

    await admin.save();

    res.status(200).json({
      message: "Admin updated successfully",
      data: {
        name: admin.name,
        email: admin.email,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin", error: error.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
}; 