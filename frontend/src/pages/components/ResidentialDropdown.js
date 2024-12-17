import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ResidentialDropdown = () => {
  const [selectedType, setSelectedType] = useState('');
  const history = useHistory(); // Initialize history for navigation

  // Navigate to the selected verification page
  const handleNavigation = () => {
    if (selectedType) {
      history.push(selectedType); // Navigate to the selected path
    } else {
      alert('Please select a residential type.');
    }
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="residentialType">Residential:</label>
      <select
        id="residentialType"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="" disabled>Select an option</option>
        <option value="/verification/residential-plots">Residential Plots or Villas</option>
        <option value="/verification/residential-independent">Residential Independent</option>
        <option value="/verification/group-housing">Group Housing</option>
        <option value="/verification/studio-apartment">Studio Apartment</option>
        <option value="/verification/farm-house">Farm House</option>
      </select>
      
      {/* Button to navigate */}
      <button onClick={handleNavigation} className="navigate-button">
        Go to Verification Page
      </button>
    </div>
  );
};

export default ResidentialDropdown;
