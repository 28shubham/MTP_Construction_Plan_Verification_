import React, { useState } from "react";
import "./VerificationForm.css"; 
import Navbar from "./components/Navbar";

function VerificationImage() {
  const [formData, setFormData] = useState({
    plotSize: "",
    residentialType: "", // New field for Residential dropdown
    file: null, 
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Handle file upload and other form data submission
  };

  const handleNavigation = () => {
    // Logic to navigate to the verification page
    window.location.href = "/verification-page"; // Replace with actual routing logic if needed
  };

  return (
    <div className="my">
      <div className="mynew">
        <Navbar />
      </div>
      <div className="verification-form-container">
        <h2>Construction Plan Verification using Image</h2>
        <form onSubmit={handleSubmit} className="verification-form">
          {/* Section 1: File Upload */}
          <label>
            1. Upload Construction Plan for Verification
            <input
              type="file"
              name="file"
              accept=".pdf, .jpeg"
              onChange={handleFileChange}
            />
            <p>
              Drag & drop your construction plan here, or click to select a file
              (PDF)
            </p>
          </label>

          {/* Section 2: Residential Type */}
          <label>
            2. Residential:
            <select
              name="residentialType"
              value={formData.residentialType}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="Residential">Residential Plots or Villas</option>
              <option value="Residential Indepent">
                Residential Independent
              </option>
              <option value="Group">Group Housing</option>
              <option value="Studio">Studio Apartment</option>
              <option value="Farm">Farm House</option>
              {/* Add other options if necessary */}
            </select>
          </label>

          {/* Add other form fields here... */}

          <button type="submit">Submit</button>

          {/* Go to Verification Page Button */}
          <button onClick={handleNavigation} className="navigate-button">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerificationImage;
