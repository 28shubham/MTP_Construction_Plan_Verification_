const jwt = require('jsonwebtoken');
const { handleError } = require('../utils/responseHandler');

const verifyToken = (req, res, next) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    
    // Check if auth header exists
    if (!authHeader) {
      return handleError(res, 'No token provided', 401);
    }
    
    // Extract token - handle both 'Bearer token' and plain 'token' formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;
    
    if (!token) {
      return handleError(res, 'Invalid token format', 401);
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Log successful verification for debugging
    console.log('Token verified for user:', decoded);
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return handleError(res, 'Invalid or expired token', 401);
  }
};

module.exports = verifyToken; 