const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin']
  },
  permissions: [{
    type: String,
    enum: ['manage_users', 'verify_plans', 'manage_admins', 'view_reports']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

const AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel; 