const BuildingPlan = require('../Models/BuildingPlan');
const ConstructionRule = require('../Models/ConstructionRule');
const { validationResult } = require('express-validator');

// Create a new building plan with associated rules
exports.createBuildingPlan = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      cityName, 
      pincode, 
      validFrom,
      validUntil,
      ruleSequence 
    } = req.body;

    // Check if a plan with this pincode already exists
    const existingPlan = await BuildingPlan.findOne({ pincode });
    if (existingPlan) {
      return res.status(400).json({ 
        message: 'A building plan with this pincode already exists' 
      });
    }

    // Ensure ruleSequence is an array
    let rulesArray = [];
    if (ruleSequence) {
      // Handle case where ruleSequence might be a string representation of JSON
      if (typeof ruleSequence === 'string') {
        try {
          rulesArray = JSON.parse(ruleSequence);
        } catch (e) {
          return res.status(400).json({ 
            message: 'Invalid format for ruleSequence', 
            error: 'ruleSequence must be a valid JSON array' 
          });
        }
      } else if (Array.isArray(ruleSequence)) {
        rulesArray = ruleSequence;
      } else {
        return res.status(400).json({ 
          message: 'Invalid format for ruleSequence', 
          error: 'ruleSequence must be an array' 
        });
      }
    }

    // Parse dates
    let parsedValidFrom = validFrom ? new Date(validFrom) : new Date();
    let parsedValidUntil = validUntil ? new Date(validUntil) : null;

    // Validate dates
    if (isNaN(parsedValidFrom.getTime())) {
      return res.status(400).json({ 
        message: 'Invalid validFrom date format' 
      });
    }

    if (parsedValidUntil && isNaN(parsedValidUntil.getTime())) {
      return res.status(400).json({ 
        message: 'Invalid validUntil date format' 
      });
    }

    if (parsedValidUntil && parsedValidFrom >= parsedValidUntil) {
      return res.status(400).json({ 
        message: 'validFrom date must be before validUntil date' 
      });
    }

    // Create new building plan document
    const newBuildingPlan = new BuildingPlan({
      cityName,
      pincode,
      validFrom: parsedValidFrom,
      validUntil: parsedValidUntil,
      ruleSequence: [], // We'll add rules after validation
      status: req.body.status || 'draft', // Default status is draft
      createdBy: req.user?.id, // If you have authentication
      createdAt: new Date()
    });

    // Process rule sequences
    if (rulesArray.length > 0) {
      for (let i = 0; i < rulesArray.length; i++) {
        const rule = rulesArray[i];
        const ruleEntry = {
          order: i + 1, // 1-based ordering
          description: rule.description || '',
          isRequired: rule.isRequired !== false // Default to true if not specified
        };

        if (rule.ruleId) {
          // Reference to existing rule
          try {
            const existingRule = await ConstructionRule.findById(rule.ruleId);
            if (!existingRule) {
              // Instead of returning an error, create a new rule if ruleId doesn't exist
              if (rule.rule) {
                // Use the rule definition if provided
                const newRule = new ConstructionRule({
                  name: rule.rule.name || `Rule ${i+1}`,
                  description: rule.rule.description || rule.description || '',
                  category: rule.rule.category || 'General',
                  type: rule.rule.type || 'custom',
                  validationParams: rule.rule.validationParams || {},
                  city: cityName,
                  createdBy: req.user?.id,
                  active: true
                });
                
                const savedRule = await newRule.save();
                ruleEntry.ruleId = savedRule._id;
              } else {
                // Create a placeholder rule if no rule definition is provided
                const newRule = new ConstructionRule({
                  name: `Rule ${i+1}`,
                  description: rule.description || `Automatically created rule ${i+1}`,
                  category: 'General',
                  type: 'custom',
                  validationParams: {},
                  city: cityName,
                  createdBy: req.user?.id,
                  active: true
                });
                
                const savedRule = await newRule.save();
                ruleEntry.ruleId = savedRule._id;
              }
            } else {
              ruleEntry.ruleId = rule.ruleId;
            }
          } catch (error) {
            console.error('Error processing rule:', error);
            // Create a new rule if there's an error finding the existing one
            const newRule = new ConstructionRule({
              name: rule.rule?.name || `Rule ${i+1}`,
              description: rule.rule?.description || rule.description || '',
              category: rule.rule?.category || 'General',
              type: rule.rule?.type || 'custom',
              validationParams: rule.rule?.validationParams || {},
              city: cityName,
              createdBy: req.user?.id,
              active: true
            });
            
            const savedRule = await newRule.save();
            ruleEntry.ruleId = savedRule._id;
          }
        } else if (rule.rule) {
          // New rule to create
          try {
            const newRule = new ConstructionRule({
              name: rule.rule.name,
              description: rule.rule.description || '',
              category: rule.rule.category || 'General',
              type: rule.rule.type || 'custom',
              validationParams: rule.rule.validationParams || {},
              city: cityName,
              createdBy: req.user?.id,
              active: true
            });
            
            const savedRule = await newRule.save();
            ruleEntry.ruleId = savedRule._id;
          } catch (error) {
            return res.status(400).json({
              message: 'Error creating new rule',
              error: error.message
            });
          }
        } else {
          return res.status(400).json({
            message: 'Each rule in the sequence must either have a ruleId or a complete rule definition',
          });
        }

        newBuildingPlan.ruleSequence.push(ruleEntry);
      }
    }

    // Save the building plan
    await newBuildingPlan.save();

    // Return the saved plan with rule details
    const populatedPlan = await BuildingPlan.findById(newBuildingPlan._id)
      .populate('ruleSequence.ruleId')
      .exec();

    res.status(201).json({
      message: 'Building plan saved successfully',
      buildingPlan: populatedPlan
    });
    
  } catch (error) {
    console.error('Error saving building plan:', error);
    res.status(500).json({ 
      message: 'Error saving building plan', 
      error: error.message 
    });
  }
};

// Get building plans by city
exports.getBuildingPlansByCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    
    const buildingPlans = await BuildingPlan.find({ cityName })
      .populate('ruleSequence.ruleId')
      .sort({ createdAt: -1 })
      .exec();
    
    res.status(200).json({
      message: `Building plans for ${cityName}`,
      count: buildingPlans.length,
      plans: buildingPlans
    });
    
  } catch (error) {
    console.error('Error fetching building plans:', error);
    res.status(500).json({ 
      message: 'Error fetching building plans', 
      error: error.message 
    });
  }
};

// Get building plans by pincode
exports.getBuildingPlanByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    
    const buildingPlan = await BuildingPlan.findOne({ pincode })
      .populate('ruleSequence.ruleId')
      .exec();
    
    if (!buildingPlan) {
      return res.status(404).json({ message: 'Building plan not found for this pincode' });
    }
    
    res.status(200).json({
      message: 'Building plan retrieved successfully',
      buildingPlan
    });
    
  } catch (error) {
    console.error('Error fetching building plan:', error);
    res.status(500).json({ 
      message: 'Error fetching building plan', 
      error: error.message 
    });
  }
};

// Get all active building plans
exports.getActiveBuildingPlans = async (req, res) => {
  try {
    const now = new Date();
    
    const buildingPlans = await BuildingPlan.find({
      status: 'active',
      validFrom: { $lte: now },
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: null },
        { validUntil: { $gte: now } }
      ]
    })
      .populate('ruleSequence.ruleId')
      .sort({ createdAt: -1 })
      .exec();
    
    res.status(200).json({
      message: 'Active building plans',
      count: buildingPlans.length,
      plans: buildingPlans
    });
    
  } catch (error) {
    console.error('Error fetching building plans:', error);
    res.status(500).json({ 
      message: 'Error fetching building plans', 
      error: error.message 
    });
  }
};

// Get all building plans
exports.getAllBuildingPlans = async (req, res) => {
  try {
    const buildingPlans = await BuildingPlan.find()
      .populate('ruleSequence.ruleId')
      .sort({ createdAt: -1 })
      .exec();
    
    res.status(200).json({
      message: 'All building plans',
      count: buildingPlans.length,
      plans: buildingPlans
    });
    
  } catch (error) {
    console.error('Error fetching building plans:', error);
    res.status(500).json({ 
      message: 'Error fetching building plans', 
      error: error.message 
    });
  }
};

// Get building plan by ID
exports.getBuildingPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const buildingPlan = await BuildingPlan.findById(id)
      .populate('ruleSequence.ruleId')
      .exec();
    
    if (!buildingPlan) {
      return res.status(404).json({ message: 'Building plan not found' });
    }
    
    res.status(200).json({
      message: 'Building plan retrieved successfully',
      buildingPlan
    });
    
  } catch (error) {
    console.error('Error fetching building plan:', error);
    res.status(500).json({ 
      message: 'Error fetching building plan', 
      error: error.message 
    });
  }
};

// Get all cities and their pincodes for dropdown selection
exports.getCitiesAndPincodes = async (req, res) => {
  try {
    // Find all unique cities with their pincodes
    const buildingPlans = await BuildingPlan.find({ status: 'active' })
      .select('cityName pincode')
      .sort({ cityName: 1, pincode: 1 })
      .exec();
    
    // Group by city name for easier frontend processing
    const citiesMap = {};
    
    buildingPlans.forEach(plan => {
      if (!citiesMap[plan.cityName]) {
        citiesMap[plan.cityName] = [];
      }
      citiesMap[plan.cityName].push(plan.pincode);
    });
    
    // Convert to array format
    const cities = Object.keys(citiesMap).map(cityName => ({
      name: cityName,
      pincodes: citiesMap[cityName]
    }));
    
    res.status(200).json({
      message: 'Cities and pincodes retrieved successfully',
      cities
    });
    
  } catch (error) {
    console.error('Error fetching cities and pincodes:', error);
    res.status(500).json({ 
      message: 'Error fetching cities and pincodes', 
      error: error.message 
    });
  }
};

// Update building plan
exports.updateBuildingPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      cityName, 
      pincode, 
      validFrom,
      validUntil,
      ruleSequence,
      status
    } = req.body;

    // Check if plan exists
    const buildingPlan = await BuildingPlan.findById(id);
    if (!buildingPlan) {
      return res.status(404).json({ message: 'Building plan not found' });
    }

    // If pincode is changing, make sure it's not already used
    if (pincode && pincode !== buildingPlan.pincode) {
      const existingPlan = await BuildingPlan.findOne({ pincode });
      if (existingPlan && existingPlan._id.toString() !== id) {
        return res.status(400).json({ 
          message: 'A building plan with this pincode already exists' 
        });
      }
    }

    // Parse dates if provided
    let updates = {};
    
    if (cityName) updates.cityName = cityName;
    if (pincode) updates.pincode = pincode;
    
    if (validFrom) {
      const parsedValidFrom = new Date(validFrom);
      if (isNaN(parsedValidFrom.getTime())) {
        return res.status(400).json({ message: 'Invalid validFrom date format' });
      }
      updates.validFrom = parsedValidFrom;
    }

    if (validUntil) {
      const parsedValidUntil = new Date(validUntil);
      if (isNaN(parsedValidUntil.getTime())) {
        return res.status(400).json({ message: 'Invalid validUntil date format' });
      }
      updates.validUntil = parsedValidUntil;
    }

    // Validate dates if both are being updated
    if (updates.validFrom && updates.validUntil && 
        updates.validFrom >= updates.validUntil) {
      return res.status(400).json({ 
        message: 'validFrom date must be before validUntil date' 
      });
    }

    // Validate if one date is provided and the other is already set
    if (updates.validFrom && buildingPlan.validUntil && 
        updates.validFrom >= buildingPlan.validUntil) {
      return res.status(400).json({ 
        message: 'validFrom date must be before existing validUntil date' 
      });
    }

    if (updates.validUntil && buildingPlan.validFrom && 
        buildingPlan.validFrom >= updates.validUntil) {
      return res.status(400).json({ 
        message: 'Existing validFrom date must be before validUntil date' 
      });
    }

    if (status) {
      if (!['active', 'inactive', 'expired', 'draft'].includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status value' 
        });
      }
      updates.status = status;
    }

    // Update rule sequence if provided
    if (ruleSequence) {
      let rulesArray = [];
      
      // Handle case where ruleSequence might be a string representation of JSON
      if (typeof ruleSequence === 'string') {
        try {
          rulesArray = JSON.parse(ruleSequence);
        } catch (e) {
          return res.status(400).json({ 
            message: 'Invalid format for ruleSequence', 
            error: 'ruleSequence must be a valid JSON array' 
          });
        }
      } else if (Array.isArray(ruleSequence)) {
        rulesArray = ruleSequence;
      } else {
        return res.status(400).json({ 
          message: 'Invalid format for ruleSequence', 
          error: 'ruleSequence must be an array' 
        });
      }

      // Process the rules
      const newRuleSequence = [];
      
      for (let i = 0; i < rulesArray.length; i++) {
        const rule = rulesArray[i];
        const ruleEntry = {
          order: i + 1, // 1-based ordering
          description: rule.description || '',
          isRequired: rule.isRequired !== false // Default to true if not specified
        };

        if (rule.ruleId) {
          // Reference to existing rule
          const existingRule = await ConstructionRule.findById(rule.ruleId);
          if (!existingRule) {
            return res.status(400).json({
              message: `Rule with ID ${rule.ruleId} does not exist`,
            });
          }
          ruleEntry.ruleId = rule.ruleId;
        } else if (rule.rule) {
          // New rule to create
          try {
            const newRule = new ConstructionRule({
              name: rule.rule.name,
              description: rule.rule.description || '',
              category: rule.rule.category || 'General',
              type: rule.rule.type || 'custom',
              validationParams: rule.rule.validationParams || {},
              city: cityName || buildingPlan.cityName,
              createdBy: req.user?.id,
              active: true
            });
            
            const savedRule = await newRule.save();
            ruleEntry.ruleId = savedRule._id;
          } catch (error) {
            return res.status(400).json({
              message: 'Error creating new rule',
              error: error.message
            });
          }
        } else {
          return res.status(400).json({
            message: 'Each rule in the sequence must either have a ruleId or a complete rule definition',
          });
        }

        newRuleSequence.push(ruleEntry);
      }

      updates.ruleSequence = newRuleSequence;
    }

    // Update the building plan
    updates.updatedAt = new Date();
    
    const updatedPlan = await BuildingPlan.findByIdAndUpdate(
      id, 
      { $set: updates }, 
      { new: true, runValidators: true }
    ).populate('ruleSequence.ruleId');

    res.status(200).json({
      message: 'Building plan updated successfully',
      buildingPlan: updatedPlan
    });
    
  } catch (error) {
    console.error('Error updating building plan:', error);
    res.status(500).json({ 
      message: 'Error updating building plan', 
      error: error.message 
    });
  }
};

// Delete building plan
exports.deleteBuildingPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if plan exists
    const buildingPlan = await BuildingPlan.findById(id);
    if (!buildingPlan) {
      return res.status(404).json({ message: 'Building plan not found' });
    }

    // Delete the building plan
    await BuildingPlan.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Building plan deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting building plan:', error);
    res.status(500).json({ 
      message: 'Error deleting building plan', 
      error: error.message 
    });
  }
}; 