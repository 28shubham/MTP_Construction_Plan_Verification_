const router = require("express").Router();
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const { signup, login } = require("../Controllers/AuthController");

// Route for user login with validation middleware
router.post("/login", loginValidation, login);

// Route for user signup with validation middleware
router.post("/signup", signupValidation, signup);

module.exports = router;
