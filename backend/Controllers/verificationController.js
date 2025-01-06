const Joi = require("joi");
const VerificationForm = require("../Models/verificationForm"); // Import the Mongoose model

// Define the validation schema based on zoning requirements
const verificationFormSchema = Joi.object({
  plotSize: Joi.number().min(60).max(1000).required(),

  groundCoverage: Joi.number()
    .required()
    .when("plotSize", {
      is: Joi.number().min(60).max(100),
      then: Joi.number().max(
        Joi.ref("plotSize", { adjust: (plotSize) => 0.7 * plotSize })
      ),
    })
    .when("plotSize", {
      is: Joi.number().greater(100).less(150),
      then: Joi.number().max(
        Joi.ref("plotSize", { adjust: (plotSize) => 0.7 * plotSize })
      ),
    })
    .when("plotSize", {
      is: Joi.number().greater(150).less(250),
      then: Joi.number().max(
        Joi.ref("plotSize", { adjust: (plotSize) => 0.65 * plotSize })
      ),
    })
    .when("plotSize", {
      is: Joi.number().greater(250).less(350),
      then: Joi.number().max(
        Joi.ref("plotSize", { adjust: (plotSize) => 0.6 * plotSize })
      ),
    })
    .when("plotSize", {
      is: Joi.number().greater(350).less(450),
      then: Joi.number().max(
        Joi.ref("plotSize", { adjust: (plotSize) => 0.5 * plotSize })
      ),
    })
    .when("plotSize", {
      is: Joi.number().greater(450),
      then: Joi.number().max(
        Joi.ref("plotSize", { adjust: (plotSize) => 0.4 * plotSize })
      ),
    }),

  floorAreaRatio: Joi.number()
    .required()
    .max(Joi.ref("plotSize", { adjust: (plotSize) => 2.1 * plotSize })),

  plinthLevel: Joi.number().valid(900).required(),
  maxHeight: Joi.number().max(11).required(),
  maxStoreys: Joi.number().valid(3).required(),

  habitableRoom: Joi.object({
    minArea: Joi.number().min(9.5).required(),
    minWidth: Joi.number().min(2.4).required(),
    minHeight: Joi.number().min(2.75).required(),
  }).required(),

  kitchen: Joi.object({
    minArea: Joi.number().min(5).required(),
    minWidth: Joi.number().min(1.8).required(),
    minHeight: Joi.number().min(2.75).required(),
  }).required(),

  bathroom: Joi.object({
    minArea: Joi.number().min(1.8).required(),
    minWidth: Joi.number().min(1.2).required(),
    minHeight: Joi.number().min(2.1).required(),
  }).required(),

  garage: Joi.object({
    minArea: Joi.number().min(18).required(),
    minWidth: Joi.number().min(3).required(),
    minHeight: Joi.number().min(2.4).required(),
  }).required(),

  staircase: Joi.object({
    minWidth: Joi.number().min(900).required(),
    minTread: Joi.number().min(250).required(),
    maxRiser: Joi.number().max(190).required(),
    minHeadHeight: Joi.number().min(2200).required(),
  }).required(),

  lightVentilation: Joi.object({
    openings: Joi.string().required(),
    ventilationShaftSize: Joi.number().required().min(10), // Replace with appropriate calculation
  }).required(),

  constructionInBackCourtyard: Joi.string().valid("Not allowed").required(),

  lift: Joi.string().valid("YES").required(),

  mumty: Joi.object({
    maxHeight: Joi.number().max(2.75).required(),
    includedInFAR: Joi.boolean().required(),
  }).required(),

  services: Joi.object({
    solarPhotoVoltaic: Joi.boolean().required(),
    waterTank: Joi.boolean().required(),
    rainWaterPipes: Joi.boolean().required(),
    terraceDrainage: Joi.boolean().required(),
    machineRoom: Joi.boolean().required(),
    screeningParapet: Joi.boolean().required(),
  }).required(),

  gate: Joi.string().valid("YES").required(),

  boundaryWall: Joi.object({
    frontMaxHeight: Joi.number().valid(0.9).required(),
    rearHeight: Joi.number().valid(1.83).required(),
    sideMaxHeight: Joi.number().max(1.83).required(),
  }).required(),
});

// Define the function to validate and submit the form
const verifyForm = async (req, res) => {
  try {
    // Validate the request body against the Joi schema
    const { error, value } = verificationFormSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      // If validation fails, send a 400 response with error details
      return res.status(400).json({
        message: "Validation error",
        success: false,
        errors: error.details.map((detail) => detail.message),
      });
    }

    // Save the validated data to the database
    const verificationForm = new VerificationForm(value);
    await verificationForm.save();

    res.status(201).json({
      message: "Verification form submitted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Database save error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  verifyForm,
};
