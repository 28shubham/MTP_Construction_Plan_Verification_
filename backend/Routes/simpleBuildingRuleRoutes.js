const express = require('express');
const router = express.Router();
const SimpleBuildingRuleController = require('../Controllers/SimpleBuildingRuleController');
const { check } = require('express-validator');
const authenticateToken = require('../Middlewares/AuthMiddleware');

// Create new building rules
router.post(
  '/',
  authenticateToken,
  [
    check('cityName', 'City name is required').not().isEmpty(),
    check('pincode', 'Pincode is required').not().isEmpty(),
    check('rules', 'At least one rule is required').isArray({ min: 1 })
  ],
  SimpleBuildingRuleController.createRule
);

// Get all building rules
router.get(
  '/',
  authenticateToken,
  SimpleBuildingRuleController.getAllRules
);

// Get building rules by city
router.get(
  '/city/:cityName',
  authenticateToken,
  SimpleBuildingRuleController.getRulesByCity
);

// Get building rules by pincode
router.get(
  '/pincode/:pincode',
  authenticateToken,
  SimpleBuildingRuleController.getRulesByPincode
);

// Get all cities and pincodes for dropdown selection
router.get(
  '/cities-pincodes',
  SimpleBuildingRuleController.getCitiesAndPincodes
);

// Update building rules
router.put(
  '/:id',
  authenticateToken,
  SimpleBuildingRuleController.updateRule
);

// Delete building rules
router.delete(
  '/:id',
  authenticateToken,
  SimpleBuildingRuleController.deleteRule
);

module.exports = router; 