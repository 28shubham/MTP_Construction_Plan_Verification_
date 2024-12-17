import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom'; // Change to useNavigate for navigation
import './Body.css'; // Ensure this path is correct

function Body() {
  const [file, setFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationPath, setVerificationPath] = useState('/api/verify'); // Default path
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  
  // Handle file upload and processing
  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]); // Assuming single file upload
  };

  // Function to verify the construction plan
  const verifyConstructionPlan = async () => {
    if (!file) {
      alert('Please upload a file before verifying.');
      return;
    }

    if (!verificationPath) {
      alert('Please enter a verification path.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(verificationPath, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying construction plan:', error);
    }
  };

  const handleNavigation = () => {
    if (selectedType) {
      navigate(selectedType); // Navigate to the selected verification page
    } else {
      alert('Please select a residential type.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'] // Accept both .jpeg and .jpg
    },
  });

  return (
    <div className="body-container">
      {/* Step 1: Upload Construction Plan */}
      <h2>1. Upload Construction Plan for Verification</h2>
      
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop your construction plan here, or click to select a file (PDF or JPEG)</p>
      </div>
      
      {file && (
        <div className="file-info">
          <h3>File Selected:</h3>
          <p>{file.name}</p>
        </div>
      )}

      {/* Verify Button */}
      <button onClick={verifyConstructionPlan} className="verify-button">
        Verify
      </button>
      
      {verificationResult && (
        <div className="verification-results">
          <h3>Verification Results:</h3>
          <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
        </div>
      )}

      {/* Step 2: Residential Dropdown */}
      <div className="dropdown-container">
        <h3>2. Verification By User Input:</h3>
        <label htmlFor="residentialType">Select an option</label>
        <select
          id="residentialType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="" disabled>Select an option</option>
          <option value="/VerificationForm">Residential Plots or Villas</option>
          <option value="/verificationI">Residential Independent</option>
          <option value="/verification/group-housing">Group Housing</option>
          <option value="/verification/studio-apartment">Studio Apartment</option>
          <option value="/verification/farm-house">Farm House</option>
        </select>
        
        {/* Button to navigate */}
        <button onClick={handleNavigation} className="navigate-button">
          Go to Verification Page
        </button>
      </div>
    </div>
  );
}

export default Body;