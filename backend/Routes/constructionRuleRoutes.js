const express = require('express');
const router = express.Router();
const constructionRuleController = require('../Controllers/ConstructionRuleController');
const { check } = require('express-validator');
const authenticateToken = require('../Middlewares/AuthMiddleware');

// Get all construction rules
router.get(
  '/',
  authenticateToken, // If you have authentication
  constructionRuleController.getAllRules
);

// Get construction rules by city
router.get(
  '/city/:cityName',
  authenticateToken, // If you have authentication
  constructionRuleController.getRulesByCity
);

// Get construction rule by ID
router.get(
  '/:id',
  authenticateToken, // If you have authentication
  constructionRuleController.getRuleById
);

// Create a new construction rule
router.post(
  '/',
  authenticateToken, // If you have authentication
  [
    check('name', 'Rule name is required').not().isEmpty(),
    check('type', 'Rule type is required').not().isEmpty()
  ],
  constructionRuleController.createRule
);

// Update construction rule
router.put(
  '/:id',
  authenticateToken, // If you have authentication
  constructionRuleController.updateRule
);

// Delete construction rule
router.delete(
  '/:id',
  authenticateToken, // If you have authentication
  constructionRuleController.deleteRule
);

module.exports = router; 