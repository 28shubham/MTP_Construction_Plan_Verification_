const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = 3600;

// Enable CORS
app.use(cors());

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Destination called for file:', file.originalname);
    cb(null, './files');
  },
  filename: (req, file, cb) => {
    console.log('Filename called for file:', file.originalname);
    const timestamp = Date.now();
    cb(null, `test_${timestamp}_${file.originalname}`);
  }
});

// Create multer upload instance
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File filter called with file:', file.originalname, 'mime:', file.mimetype);
    cb(null, true);
  }
});

// Debug middleware to log request details
app.use((req, res, next) => {
  console.log('\n--- Incoming Request ---');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Headers:', req.headers);
  next();
});

// API endpoint with documentFile field
app.post('/test-documentFile', upload.single('documentFile'), (req, res) => {
  console.log('\n--- /test-documentFile Request ---');
  console.log('File:', req.file ? req.file.originalname : 'No file uploaded');
  console.log('Body fields:', Object.keys(req.body));
  
  if (!req.file) {
    return res.status(400).json({ 
      error: 'No file uploaded with field name "documentFile"',
      receivedFields: Object.keys(req.body)
    });
  }
  
  res.json({
    success: true,
    fieldName: 'documentFile',
    fileName: req.file.originalname,
    fileSize: req.file.size,
    body: req.body
  });
});

// Alternate API endpoint with file field
app.post('/test-file', upload.single('file'), (req, res) => {
  console.log('\n--- /test-file Request ---');
  console.log('File:', req.file ? req.file.originalname : 'No file uploaded');
  console.log('Body fields:', Object.keys(req.body));
  
  if (!req.file) {
    return res.status(400).json({ 
      error: 'No file uploaded with field name "file"',
      receivedFields: Object.keys(req.body)
    });
  }
  
  res.json({
    success: true,
    fieldName: 'file',
    fileName: req.file.originalname,
    fileSize: req.file.size,
    body: req.body
  });
});

// HTML page for testing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Multer Field Test</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
        form { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; }
        button { padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        pre { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <h1>Multer Field Name Test</h1>
      
      <h2>Test with "documentFile" field (expected by your API)</h2>
      <form id="form1" enctype="multipart/form-data">
        <div>
          <label>City Name: <input type="text" name="cityName" value="TestCity"></label>
        </div>
        <div>
          <label>Pincode: <input type="text" name="pincode" value="123456"></label>
        </div>
        <div>
          <label>Field name "documentFile": <input type="file" name="documentFile"></label>
        </div>
        <button type="submit">Test documentFile field</button>
      </form>
      <pre id="result1">Results will appear here</pre>

      <h2>Test with "file" field (alternative)</h2>
      <form id="form2" enctype="multipart/form-data">
        <div>
          <label>City Name: <input type="text" name="cityName" value="TestCity"></label>
        </div>
        <div>
          <label>Pincode: <input type="text" name="pincode" value="123456"></label>
        </div>
        <div>
          <label>Field name "file": <input type="file" name="file"></label>
        </div>
        <button type="submit">Test file field</button>
      </form>
      <pre id="result2">Results will appear here</pre>

      <script>
        document.getElementById('form1').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const result = document.getElementById('result1');
          result.textContent = 'Uploading...';
          
          try {
            const response = await fetch('/test-documentFile', {
              method: 'POST',
              body: formData
            });
            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
          } catch (err) {
            result.textContent = 'Error: ' + err.message;
          }
        });

        document.getElementById('form2').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const result = document.getElementById('result2');
          result.textContent = 'Uploading...';
          
          try {
            const response = await fetch('/test-file', {
              method: 'POST',
              body: formData
            });
            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
          } catch (err) {
            result.textContent = 'Error: ' + err.message;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Use this page to test which multer field name works');
}); 