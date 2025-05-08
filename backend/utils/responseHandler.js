const handleSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const handleError = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: message
  });
};

module.exports = {
  handleSuccess,
  handleError
}; 