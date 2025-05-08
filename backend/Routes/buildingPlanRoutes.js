const express = require('express');
const router = express.Router();
const buildingPlanController = require('../Controllers/BuildingPlanController');
const { check } = require('express-validator');
const authenticateToken = require('../Middlewares/AuthMiddleware');

// Create a new building plan with rules
router.post(
  '/',
  authenticateToken, // If you have authentication
  [
    check('cityName', 'City name is required').not().isEmpty(),
    check('pincode', 'Pincode is required').not().isEmpty()
  ],
  buildingPlanController.createBuildingPlan
);

// Get building plans by city
router.get(
  '/city/:cityName',
  authenticateToken, // If you have authentication
  buildingPlanController.getBuildingPlansByCity
);

// Get building plan by pincode
router.get(
  '/pincode/:pincode',
  authenticateToken, // If you have authentication
  buildingPlanController.getBuildingPlanByPincode
);

// Get all cities and pincodes for dropdown selection
router.get(
  '/cities-pincodes',
  buildingPlanController.getCitiesAndPincodes
);

// Get all active building plans
router.get(
  '/active',
  authenticateToken, // If you have authentication
  buildingPlanController.getActiveBuildingPlans
);

// Get all building plans
router.get(
  '/',
  authenticateToken, // If you have authentication
  buildingPlanController.getAllBuildingPlans
);

// Get building plan by ID
router.get(
  '/:id',
  authenticateToken, // If you have authentication
  buildingPlanController.getBuildingPlanById
);

// Update building plan
router.put(
  '/:id',
  authenticateToken, // If you have authentication
  buildingPlanController.updateBuildingPlan
);

// Delete building plan
router.delete(
  '/:id',
  authenticateToken, // If you have authentication
  buildingPlanController.deleteBuildingPlan
);

module.exports = router; 