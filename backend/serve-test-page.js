const express = require('express');
const path = require('path');
const app = express();
const PORT = 3900;

// Serve the test HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-building-rule-upload.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Test page server running at http://localhost:${PORT}`);
  console.log('Open this URL in your browser to test building rule uploads');
}); 