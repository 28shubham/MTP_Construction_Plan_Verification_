const Joi = require("joi");
const AdminModel = require("../Models/Admin");

const adminRegisterValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    permissions: Joi.array().items(
      Joi.string().valid('manage_users', 'verify_plans', 'manage_admins', 'view_reports')
    )
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

const adminLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

const isAdmin = async (req, res, next) => {
  try {
    // Check if user object exists from previous auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: "Authentication required. Please log in.",
        success: false 
      });
    }
    
    // Find admin in database
    const admin = await AdminModel.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required.",
        success: false
      });
    }
    
    // Add admin info to request for use in controllers
    req.admin = admin;
    console.log('Admin verified:', admin.email);
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ 
      message: "Error verifying admin privileges", 
      error: error.message,
      success: false
    });
  }
};

module.exports = {
  adminRegisterValidation,
  adminLoginValidation,
  isAdmin,
}; 