import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Body.css";
import Footer from "./footer";
import { 
  FaUpload, 
  FaClipboardList, 
  FaArrowRight, 
  FaFileAlt,
  FaCheckCircle,
  FaChartBar,
  FaUsers
} from "react-icons/fa";
import houseImage from "../images/houseimage.gif";

function Body() {
  const [selectedType, setSelectedType] = useState("");
  const [showFooter, setShowFooter] = useState(false);
  const navigate = useNavigate();
  const servicesRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      // Show footer when scrolled to bottom (with a small threshold)
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = () => {
    if (selectedType) {
      navigate(selectedType);
    } else {
      alert("Please select a residential type.");
    }
  };

  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="body-wrapper">
      {/* Hero Section with Iceberg Image */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Construction Plan Verification</h1>
          <p className="hero-subtitle">Building compliance made simple and efficient</p>
          <button 
            onClick={scrollToServices} 
            className="hero-button"
          >
            Get Started <FaArrowRight className="btn-icon" />
          </button>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Services Section */}
      <section className="services-section" ref={servicesRef}>
        <div className="section-title-container">
          <h2 className="section-title">Our Verification Services</h2>
          <p className="section-subtitle">Choose the verification method that works best for you</p>
        </div>
        
        <div className="services-grid">
          {/* Service 1: Document Upload */}
          <div className="service-card">
            <div className="service-icon-container">
              <FaUpload className="service-icon" />
            </div>
            <h3 className="service-title">Document Verification</h3>
            <p className="service-description">
              Upload construction plans as images or PDFs for automated analysis and verification.
            </p>
            <button
              onClick={() => navigate("/verificationImage")}
              className="service-button"
            >
              Upload Plans <FaArrowRight className="btn-icon" />
            </button>
          </div>
          
          {/* Service 2: Form Input */}
          <div className="service-card">
            <div className="service-icon-container">
              <FaClipboardList className="service-icon" />
            </div>
            <h3 className="service-title">Form Verification</h3>
            <p className="service-description">
              Enter specifications manually through our interactive form for detailed verification.
            </p>
            <div className="select-container">
              <select
                id="residentialType"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="" disabled>Select property type</option>
                <option value="/VerificationForm">Residential Plots or Villas</option>
                <option value="/verificationImage">Residential Independent</option>
                <option value="/verification/group-housing">Group Housing</option>
                <option value="/verification/studio-apartment">Studio Apartment</option>
                <option value="/verification/farm-house">Farm House</option>
              </select>
            </div>
            <button onClick={handleNavigation} className="service-button">
              Start Verification <FaArrowRight className="btn-icon" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section with Light Bulbs */}
      <section className="feature-section">
        <div className="feature-content">
          <h2 className="feature-title">Making verification easy and stress-free.
          </h2>
          <h3 className="feature-subtitle"></h3>
          <p className="feature-description">
          We know verifying construction plans can seem complex and overwhelming. That's why we're here — to review every detail, highlight what truly matters, and ensure your plans meet all required standards. With our support, you'll feel confident that your project is on the right track — verified, compliant, and ready to move forward.
          </p>
          <button 
            onClick={() => navigate("/about")} 
            className="feature-button"
          >
            Learn More <FaArrowRight className="btn-icon" />
          </button>
        </div>
        <div 
          className="feature-image-container" 
          style={{ 
            backgroundImage: `url(${houseImage})`,
            backgroundColor: '#f5f5f5'
          }}
        >
          {/* House image now loaded from imported image */}
        </div>
      </section>

      {/* Additional Services Section */}
<section className="additional-services-section">
  <div className="additional-services-grid">
    <div className="additional-service-card">
      <FaFileAlt className="additional-service-icon" />
      <h3 className="additional-service-title">Digital Plan Review</h3>
      <p className="additional-service-description">
        Upload and review your construction plans digitally through our secure platform.
      </p>
    </div>
    
    <div className="additional-service-card">
      <FaCheckCircle className="additional-service-icon" />
      <h3 className="additional-service-title">Code Compliance Check</h3>
      <p className="additional-service-description">
        Ensure your plans meet local building codes, zoning laws, and safety regulations.
      </p>
    </div>
    
    <div className="additional-service-card">
      <FaChartBar className="additional-service-icon" />
      <h3 className="additional-service-title">Detailed Reporting</h3>
      <p className="additional-service-description">
        Receive comprehensive verification reports highlighting issues and recommendations.
      </p>
    </div>
    
    <div className="additional-service-card">
      <FaUsers className="additional-service-icon" />
      <h3 className="additional-service-title">Stakeholder Collaboration</h3>
      <p className="additional-service-description">
        Share verified plans easily with architects, engineers, and regulatory authorities.
      </p>
    </div>
  </div>
</section>

      
      {showFooter && <Footer />}
    </div>
  );
}

export default Body;
