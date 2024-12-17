const Joi = require("joi");
const VerificationForm = require("../Models/verificationForm"); // Import the Mongoose model

// Define the validation schema for the form
const verificationFormSchema = Joi.object({
  plotSize: Joi.number().min(60).max(1000).required(),
  
  groundCoverage: Joi.number()
    .max(Joi.ref('plotSize', { adjust: (plotSize) => 0.70 * plotSize }))
    .required(),
  
  floorAreaRatio: Joi.number()
    .max(Joi.ref('plotSize', { adjust: (plotSize) => 2.1 * plotSize }))
    .required(),
  
  plinthLevel: Joi.number().max(900).required(),
  maxHeight: Joi.number().max(11).required(),
  maxStoreys: Joi.number().max(3).required(),
  verandah: Joi.number().min(3).required(),
  staircaseWidth: Joi.number().min(3).required(),
  staircaseTread: Joi.number().min(3).required(),
  staircaseRiser: Joi.number().min(3).required(),
  staircaseHeadHeight: Joi.number().min(3).required(),
  constructionInBackCourtyard: Joi.number().min(3).required(),
  ramp: Joi.string().required(),
  allowableProjection: Joi.number().min(3).required(),
  allowableBalcony: Joi.number().min(3).required(),
  rainWaterHarvesting: Joi.string().required(),
  solarWaterHeating: Joi.string().required(),
  flushingSystem: Joi.number().min(3).required(),
  minimumPassage: Joi.number().min(3).required(),
  amalgamationOrFragmentation: Joi.string().required()
});

// Define the function to validate and submit the form
const verifyForm = async (req, res) => {
  try {
    // Validate the request body against the Joi schema
    const { error, value } = verificationFormSchema.validate(req.body, { abortEarly: false });

    if (error) {
      // If validation fails, send a 400 response with error details
      // abortEarly: false ensures we collect all errors, not just the first one
      return res.status(400).json({
        message: "Validation error",
        success: false,
        errors: error.details.map((detail) => detail.message) // Send an array of error messages
      });
    }

    // If validation passes, save the data to the database
    const verificationForm = new VerificationForm(value); // Use validated data
    await verificationForm.save();

    res.status(201).json({
      message: "Verification form submitted successfully",
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

module.exports = {
  verifyForm
};
