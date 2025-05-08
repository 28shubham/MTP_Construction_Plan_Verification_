const express = require('express');
const router = express.Router();
const verificationHistoryController = require('../Controllers/VerificationHistoryController');
const authMiddleware = require('../Middlewares/authMiddleware');

// All routes are protected and require authentication
router.use(authMiddleware);

// Get all verifications for the logged-in user
router.get('/verifications', verificationHistoryController.getUserVerifications);

// Get a single verification by ID
router.get('/verifications/:id', verificationHistoryController.getVerificationById);

// Save a new verification
router.post('/save-verification', verificationHistoryController.saveVerification);

// Delete a verification
router.delete('/verifications/:id', verificationHistoryController.deleteVerification);

module.exports = router; 