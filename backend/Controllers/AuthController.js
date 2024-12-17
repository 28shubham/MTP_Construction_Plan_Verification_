const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); // Fixed the incorrect module name
const UserModel = require("../Models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    // Create a new user
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10); // Hash the password

    // Save the user to the database
    await userModel.save();
    res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errorMsg = "Authentication failed: Email or Password is incorrect";

    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: errorMsg,
        success: false,
      });
    }

    // Compare the password
    const isPassEqual = await bcrypt.compare(password, user.password); // Fixed the arguments
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Fixed the typo 'expireIn' to 'expiresIn'
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};
