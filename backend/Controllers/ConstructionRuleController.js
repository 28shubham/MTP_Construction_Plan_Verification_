const ConstructionRule = require('../Models/ConstructionRule');
const { validationResult } = require('express-validator');

// Get all construction rules
exports.getAllRules = async (req, res) => {
    try {
        const rules = await ConstructionRule.find()
            .sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json({
            message: 'Construction rules fetched successfully',
            count: rules.length,
            rules
        });
    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ 
            message: 'Failed to fetch construction rules',
            error: error.message
        });
    }
};

// Get construction rules by city
exports.getRulesByCity = async (req, res) => {
    try {
        const { cityName } = req.params;
        
        const rules = await ConstructionRule.find({ city: cityName })
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            message: `Construction rules for ${cityName}`,
            count: rules.length,
            rules
        });
    } catch (error) {
        console.error('Error fetching rules by city:', error);
        res.status(500).json({ 
            message: 'Failed to fetch construction rules',
            error: error.message
        });
    }
};

// Get a single rule by ID
exports.getRuleById = async (req, res) => {
    try {
        const rule = await ConstructionRule.findById(req.params.id);
        if (!rule) {
            return res.status(404).json({ message: 'Construction rule not found' });
        }
        
        res.status(200).json({
            message: 'Construction rule fetched successfully',
            rule
        });
    } catch (error) {
        console.error('Error fetching rule:', error);
        res.status(500).json({ 
            message: 'Failed to fetch construction rule',
            error: error.message
        });
    }
};

// Create a new rule
exports.createRule = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { 
            name, 
            description, 
            category, 
            type, 
            validationParams,
            city,
            severity,
            active
        } = req.body;
        
        const newRule = new ConstructionRule({
            name,
            description: description || '',
            category: category || 'General',
            type,
            validationParams: validationParams || {},
            city: city || '',
            severity: severity || 'error',
            active: active !== undefined ? active : true,
            createdBy: req.user?.id
        });
        
        await newRule.save();
        
        res.status(201).json({
            message: 'Construction rule created successfully',
            rule: newRule
        });
    } catch (error) {
        console.error('Error creating rule:', error);
        res.status(500).json({ 
            message: 'Failed to create construction rule',
            error: error.message
        });
    }
};

// Update a rule
exports.updateRule = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            category, 
            type, 
            validationParams,
            city,
            severity,
            active
        } = req.body;
        
        // Build update object with only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (type !== undefined) updateData.type = type;
        if (validationParams !== undefined) updateData.validationParams = validationParams;
        if (city !== undefined) updateData.city = city;
        if (severity !== undefined) updateData.severity = severity;
        if (active !== undefined) updateData.active = active;
        
        // Always update timestamp
        updateData.updatedAt = Date.now();
        
        const updatedRule = await ConstructionRule.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!updatedRule) {
            return res.status(404).json({ message: 'Construction rule not found' });
        }
        
        res.status(200).json({
            message: 'Construction rule updated successfully',
            rule: updatedRule
        });
    } catch (error) {
        console.error('Error updating rule:', error);
        res.status(500).json({ 
            message: 'Failed to update construction rule',
            error: error.message
        });
    }
};

// Delete a rule
exports.deleteRule = async (req, res) => {
    try {
        const deletedRule = await ConstructionRule.findByIdAndDelete(req.params.id);
        
        if (!deletedRule) {
            return res.status(404).json({ message: 'Construction rule not found' });
        }
        
        res.status(200).json({
            message: 'Construction rule deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting rule:', error);
        res.status(500).json({ 
            message: 'Failed to delete construction rule',
            error: error.message
        });
    }
}; 