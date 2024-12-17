import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Change to useNavigate for navigation
import './Body.css'; // Ensure this path is correct

function Body() {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleNavigation = () => {
    if (selectedType) {
      navigate(selectedType); // Navigate to the selected verification page
    } else {
      alert('Please select a residential type.');
    }
  };

  return (
    <div className="body-container">
      {/* Step 1: Verification */}
      <h2>1. Construction Plan Verification using Image/PDF</h2>

      {/* Verify Button Linked to VerificationImage */}
      <button 
        onClick={() => navigate('/verificationImage')} 
        className="verify-button"
      >
        Go to Verification Page
      </button>

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
          <option value="/verificationImage">Residential Independent</option>
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
