import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar"; // Import Navbar component
import Body from "./components/Body"; // Import Body component
import "./Home.css"; // Import Home styles
import { isAuthenticated } from "../services/auth"; // Import auth service
import { 
  FaShieldAlt, 
  FaLeaf, 
  FaClock,
  FaFileAlt,
  FaRegLightbulb,
  FaChartLine,
  FaUserCheck
} from 'react-icons/fa';

const FeaturesSection = styled.div`
  margin: 4rem auto;
  max-width: 1400px;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #1a2a6c;
  margin: 0 0 2rem 0;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #1a2a6c, #2a4858);
    border-radius: 2px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  svg {
    font-size: 2.5rem;
    color: #1a2a6c;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #1a2a6c;
    margin: 0 0 1rem 0;
  }

  p {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }
`;

const ProcessSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin: 4rem auto;
  max-width: 1400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProcessStep = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${props => props.bg || '#f8fafc'};
  border-radius: 15px;
  position: relative;

  .step-number {
    width: 40px;
    height: 40px;
    background: #1a2a6c;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin: 0 auto 1rem;
  }

  h3 {
    color: #1a2a6c;
    margin: 0 0 1rem 0;
  }

  p {
    color: #4b5563;
    margin: 0;
    line-height: 1.6;
  }
`;

function Home() {
  const navigate = useNavigate();

  // Verify token on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="main-content">
        {/* Add spacing between Navbar and Body */}
        <div style={{ marginTop: "20px" }}>
          <Body />
        </div>

        <FeaturesSection>
          <SectionTitle>Why Choose Our Platform?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FaShieldAlt />
              <h3>Smart Verification</h3>
              <p>Advanced AI-powered system that ensures accurate and efficient verification of construction plans according to local regulations and standards.</p>
            </FeatureCard>
            <FeatureCard>
              <FaLeaf />
              <h3>Sustainability Focus</h3>
              <p>Promote eco-friendly construction practices with built-in sustainability checks and green building compliance verification.</p>
            </FeatureCard>
            <FeatureCard>
              <FaClock />
              <h3>Time Efficiency</h3>
              <p>Streamline the verification process with automated checks and real-time feedback, reducing approval times significantly.</p>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        <ProcessSection>
          <SectionTitle>How It Works</SectionTitle>
          <ProcessSteps>
            <ProcessStep bg="#f0fdf4">
              <div className="step-number">1</div>
              <h3>Plan Submission</h3>
              <p>Upload your construction plans through our intuitive digital platform.</p>
            </ProcessStep>
            <ProcessStep bg="#eff6ff">
              <div className="step-number">2</div>
              <h3>Automated Verification</h3>
              <p>Our system analyzes plans against current building codes and regulations.</p>
            </ProcessStep>
            <ProcessStep bg="#fef3c7">
              <div className="step-number">3</div>
              <h3>Expert Review</h3>
              <p>Qualified professionals review the results and provide detailed feedback.</p>
            </ProcessStep>
            <ProcessStep bg="#fee2e2">
              <div className="step-number">4</div>
              <h3>Final Approval</h3>
              <p>Receive your verification report and proceed with confidence.</p>
            </ProcessStep>
          </ProcessSteps>
        </ProcessSection>
      </main>

      <ToastContainer />
    </div>
  );
}

export default Home;
