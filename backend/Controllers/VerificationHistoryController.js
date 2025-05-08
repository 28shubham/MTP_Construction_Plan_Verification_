const VerificationHistory = require('../Models/VerificationHistory');

// Get all verifications for a user
exports.getUserVerifications = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware adds user to req
    const verifications = await VerificationHistory.find({ userId })
      .sort({ submissionDate: -1 }); // Sort by date, newest first
    
    res.status(200).json(verifications);
  } catch (error) {
    console.error('Error fetching verification history:', error);
    res.status(500).json({
      message: 'Error fetching verification history',
      error: error.message
    });
  }
};

// Get a single verification by ID
exports.getVerificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const verification = await VerificationHistory.findOne({ 
      _id: id,
      userId
    });
    
    if (!verification) {
      return res.status(404).json({
        message: 'Verification not found'
      });
    }
    
    res.status(200).json(verification);
  } catch (error) {
    console.error('Error fetching verification:', error);
    res.status(500).json({
      message: 'Error fetching verification',
      error: error.message
    });
  }
};

// Save a new verification
exports.saveVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      type,
      city,
      pincode,
      status,
      pdfUrl,
      results
    } = req.body;
    
    // Create a new verification history entry
    const newVerification = new VerificationHistory({
      userId,
      title,
      type,
      city: city || 'Unknown',
      pincode: pincode || 'Unknown',
      status,
      pdfUrl,
      results
    });
    
    await newVerification.save();
    
    res.status(201).json({
      message: 'Verification saved successfully',
      verification: newVerification
    });
  } catch (error) {
    console.error('Error saving verification:', error);
    res.status(500).json({
      message: 'Error saving verification',
      error: error.message
    });
  }
};

// Delete a verification
exports.deleteVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const verification = await VerificationHistory.findOneAndDelete({
      _id: id,
      userId
    });
    
    if (!verification) {
      return res.status(404).json({
        message: 'Verification not found'
      });
    }
    
    res.status(200).json({
      message: 'Verification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting verification:', error);
    res.status(500).json({
      message: 'Error deleting verification',
      error: error.message
    });
  }
}; 