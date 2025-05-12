const SimpleBuildingRule = require('../Models/SimpleBuildingRule');
const { validationResult } = require('express-validator');

// Create a new simple building rule
exports.createRule = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cityName, pincode, rules, validFrom, validUntil, status } = req.body;

    // Check if a rule for this city and pincode already exists
    const existingRule = await SimpleBuildingRule.findOne({ cityName, pincode });
    if (existingRule) {
      return res.status(400).json({
        message: 'Building rules for this city and pincode already exist'
      });
    }

    // Process rules to ensure sequences are correct
    let processedRules = [];
    if (Array.isArray(rules) && rules.length > 0) {
      // Sort by sequence if provided, otherwise assign sequence
      if (rules[0].sequence) {
        processedRules = [...rules].sort((a, b) => a.sequence - b.sequence);
      } else {
        processedRules = rules.map((rule, index) => ({
          ...rule,
          sequence: index + 1
        }));
      }
    }

    // Parse dates
    let parsedValidFrom = validFrom ? new Date(validFrom) : new Date();
    let parsedValidUntil = validUntil ? new Date(validUntil) : null;

    // Create new rule
    const newRule = new SimpleBuildingRule({
      cityName,
      pincode,
      rules: processedRules,
      validFrom: parsedValidFrom,
      validUntil: parsedValidUntil,
      status: status || 'draft',
      createdBy: req.user?.id
    });

    await newRule.save();

    res.status(201).json({
      message: 'Building rules created successfully',
      rule: newRule
    });

  } catch (error) {
    console.error('Error creating building rules:', error);
    res.status(500).json({
      message: 'Error creating building rules',
      error: error.message
    });
  }
};

// Get all simple building rules
exports.getAllRules = async (req, res) => {
  try {
    const rules = await SimpleBuildingRule.find()
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      message: 'Building rules retrieved successfully',
      count: rules.length,
      rules
    });
  } catch (error) {
    console.error('Error fetching building rules:', error);
    res.status(500).json({
      message: 'Error fetching building rules',
      error: error.message
    });
  }
};

// Get building rules by city
exports.getRulesByCity = async (req, res) => {
  try {
    const { cityName } = req.params;

    const rules = await SimpleBuildingRule.find({ cityName })
      .sort({ pincode: 1 })
      .exec();

    res.status(200).json({
      message: `Building rules for ${cityName}`,
      count: rules.length,
      rules
    });
  } catch (error) {
    console.error('Error fetching building rules by city:', error);
    res.status(500).json({
      message: 'Error fetching building rules',
      error: error.message
    });
  }
};

// Get building rules by pincode
exports.getRulesByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;

    const rule = await SimpleBuildingRule.findOne({ pincode })
      .exec();

    if (!rule) {
      return res.status(404).json({
        message: 'Building rules not found for this pincode'
      });
    }

    res.status(200).json({
      message: `Building rules for pincode ${pincode}`,
      rule
    });
  } catch (error) {
    console.error('Error fetching building rules by pincode:', error);
    res.status(500).json({
      message: 'Error fetching building rules',
      error: error.message
    });
  }
};

// Update building rules
exports.updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { cityName, pincode, rules, validFrom, validUntil, status } = req.body;

    // Check if rule exists
    const existingRule = await SimpleBuildingRule.findById(id);
    if (!existingRule) {
      return res.status(404).json({
        message: 'Building rules not found'
      });
    }

    // Build update object
    const updates = {};
    if (cityName) updates.cityName = cityName;
    if (pincode) updates.pincode = pincode;
    
    // Process rules if provided
    if (Array.isArray(rules) && rules.length > 0) {
      // Sort by sequence if provided, otherwise assign sequence
      let processedRules;
      if (rules[0].sequence) {
        processedRules = [...rules].sort((a, b) => a.sequence - b.sequence);
      } else {
        processedRules = rules.map((rule, index) => ({
          ...rule,
          sequence: index + 1
        }));
      }
      updates.rules = processedRules;
    }

    // Process dates if provided
    if (validFrom) {
      const parsedValidFrom = new Date(validFrom);
      if (!isNaN(parsedValidFrom.getTime())) {
        updates.validFrom = parsedValidFrom;
      }
    }

    if (validUntil) {
      const parsedValidUntil = new Date(validUntil);
      if (!isNaN(parsedValidUntil.getTime())) {
        updates.validUntil = parsedValidUntil;
      }
    }

    if (status) updates.status = status;

    // Always update timestamp
    updates.updatedAt = new Date();

    // Update the rule
    const updatedRule = await SimpleBuildingRule.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Building rules updated successfully',
      rule: updatedRule
    });
  } catch (error) {
    console.error('Error updating building rules:', error);
    res.status(500).json({
      message: 'Error updating building rules',
      error: error.message
    });
  }
};

// Delete building rules
exports.deleteRule = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if rule exists
    const existingRule = await SimpleBuildingRule.findById(id);
    if (!existingRule) {
      return res.status(404).json({
        message: 'Building rules not found'
      });
    }

    // Delete the rule
    await SimpleBuildingRule.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Building rules deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting building rules:', error);
    res.status(500).json({
      message: 'Error deleting building rules',
      error: error.message
    });
  }
};

// Get all cities and their pincodes from SimpleBuildingRule
exports.getCitiesAndPincodes = async (req, res) => {
  try {
    // Find all unique cities with their pincodes from SimpleBuildingRule
    const buildingRules = await SimpleBuildingRule.find({ status: 'active' })
      .select('cityName pincode')
      .sort({ cityName: 1, pincode: 1 })
      .exec();
    
    // Group by city name for easier frontend processing
    const citiesMap = {};
    
    buildingRules.forEach(rule => {
      if (!citiesMap[rule.cityName]) {
        citiesMap[rule.cityName] = [];
      }
      if (!citiesMap[rule.cityName].includes(rule.pincode)) {
        citiesMap[rule.cityName].push(rule.pincode);
      }
    });
    
    // Convert to array format
    const cities = Object.keys(citiesMap).map(cityName => ({
      name: cityName,
      pincodes: citiesMap[cityName]
    }));
    
    res.status(200).json({
      message: 'Cities and pincodes retrieved successfully from building rules',
      cities
    });
    
  } catch (error) {
    console.error('Error fetching cities and pincodes from building rules:', error);
    res.status(500).json({ 
      message: 'Error fetching cities and pincodes', 
      error: error.message 
    });
  }
}; 