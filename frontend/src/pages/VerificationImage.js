//-----------------------------------------------------

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { getCitiesAndPincodesFromRules } from "../services/simpleBuildingRuleService";
import { 
  FaCloudUploadAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaFileAlt, 
  FaBuilding, 
  FaSearch, 
  FaRuler, 
  FaRegCheckCircle,
  FaArrowRight,
  FaChartArea,
  FaHistory,
  FaUserLock,
  FaMapMarkerAlt,
  FaMapPin,
  FaInfoCircle
} from "react-icons/fa";

// Styled Components
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 60px auto 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Poppins', sans-serif;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #1a2a6c 0%, #b21f1f 100%);
    border-radius: 2px;
  }
`;

const PageTitle = styled.h2`
  color: #1a2a6c;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.5rem;
  }
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #1a2a6c;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #1a2a6c;
    font-size: 1.1rem;
  }
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #1a2a6c;
  }
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    height: 2px;
    background: #e5e7eb;
    z-index: 0;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const StepIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%)' : 'white'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.4rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  svg {
    color: ${props => props.active ? 'white' : '#9ca3af'};
    font-size: 0.8rem;
  }
`;

const StepLabel = styled.span`
  font-size: 0.7rem;
  color: ${props => props.active ? '#1a2a6c' : '#9ca3af'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;
`;

const FileInput = styled.div`
  position: relative;
  margin-top: 0.25rem;
  
  input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 2;
  }
`;

const FileInputPreview = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  background: #f9fafb;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  &:hover {
    border-color: #1a2a6c;
    background: rgba(26, 42, 108, 0.05);
  }
  
  svg {
    font-size: 2.5rem;
    color: #1a2a6c;
    margin-bottom: 0.75rem;
  }
  
  p {
    margin: 0.3rem 0;
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  strong {
    color: #1a2a6c;
    font-weight: 600;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.15);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 10px rgba(26, 42, 108, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(26, 42, 108, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const VerifyButton = styled(SubmitButton)`
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  width: 100%;
  margin-top: 1rem;
  box-shadow: 0 4px 10px rgba(5, 150, 105, 0.2);
  
  &:hover {
    box-shadow: 0 6px 15px rgba(5, 150, 105, 0.3);
  }
`;

const NotificationContainer = styled.div`
  background: ${props => props.type === 'success' ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'};
  color: ${props => props.type === 'success' ? '#166534' : '#b91c1c'};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => props.type === 'success' ? '#166534' : '#b91c1c'};
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PDFPreviewContainer = styled.div`
  flex-grow: 1;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 350px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const PDFPreviewTitle = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  
  svg {
    color: #1a2a6c;
    margin-right: 0.4rem;
  }
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 350px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: #9ca3af;
  text-align: center;
  
  svg {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    color: #d1d5db;
  }
  
  p {
    margin: 0.3rem 0;
    font-size: 0.9rem;
  }
`;

const ScaleInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ScaleInput = styled.input`
  width: 60px;
  padding: 0.75rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.15);
  }
`;

const ScaleEquals = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0.5rem;
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #1a2a6c;
    font-size: 0.8rem;
  }
`;

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 0.8rem;
  }
`;

const RetryButton = styled.button`
  margin-left: 0.5rem;
  color: #1a2a6c;
  border: none;
  background: none;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  font-weight: 500;
  
  &:hover {
    color: #b21f1f;
  }
`;

const LoginLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #1a2a6c;
  background: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-color: #1a2a6c;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const ScaleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  width: fit-content;
  
  svg {
    color: #1a2a6c;
    font-size: 0.8rem;
  }
`;

const LocationBadge = styled.span`
  font-size: 0.8rem;
  margin-left: 0.5rem;
  background: rgba(26, 42, 108, 0.1);
  color: #1a2a6c;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  
  svg {
    font-size: 0.7rem;
  }
`;

// Add these styled components after the existing styled components and before the isUserLoggedIn function
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 1200px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #F3F4F6;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #1F2937;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6B7280;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #1F2937;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ResultCard = styled.div`
  background: ${props => props.status === "Compliant" ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"};
  border: 1px solid ${props => props.status === "Compliant" ? "#86efac" : "#fecaca"};
  border-left: 5px solid ${props => props.status === "Compliant" ? "#16a34a" : "#dc2626"};
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${props => props.status === "Compliant" ? "#bbf7d0" : "#fecaca"};
`;

const ResultTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
`;

const ResultStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.status === "Compliant" ? "#16a34a" : "#dc2626"};
  background: ${props => props.status === "Compliant" ? "#dcfce7" : "#fee2e2"};
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
`;

const ResultMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const MetricLabel = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const MetricValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
`;

const CoordinatesContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const CoordinatesLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const CoordinatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const Coordinate = styled.div`
  font-size: 0.8rem;
  color: #4b5563;
`;

const ComplianceMessage = styled.div`
  font-size: 0.8rem;
  color: ${props => props.status === "Compliant" ? "#16a34a" : "#dc2626"};
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: ${props => props.status === "Compliant" ? "#f0fdf4" : "#fef2f2"};
  border-radius: 6px;
`;

const ComplianceSummary = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 10px;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.type === "total") return "#1f2937";
    if (props.type === "compliant") return "#16a34a";
    if (props.type === "non_compliant") return "#dc2626";
    return "#1f2937";
  }};
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.2rem;
`;

// Before the VerificationImage component
const isUserLoggedIn = () => {
  // Check if the user has a valid token in local storage
  return localStorage.getItem('token') !== null;
};

// Add this new component before the VerificationImage component
const VerificationDetailsWindow = ({ isOpen, onClose, verificationResult }) => {
  if (!isOpen) return null;

  return (
    <div className="verification-window-overlay">
      <div className="verification-window">
        <div className="verification-window-header">
          <div className="verification-window-title">
            <FaCheckCircle style={{ 
              color: verificationResult?.compliance_summary.non_compliant === 0 ? '#059669' : '#DC2626',
              marginRight: '0.5rem'
            }} />
            Verification Results
          </div>
          <button className="verification-window-close" onClick={onClose}>×</button>
        </div>

        <div className="verification-window-content">
          {/* Plan Information */}
          <section className="verification-section">
            <h3 className="section-title">
              <FaBuilding /> Plan Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">City</span>
                <span className="info-value">{verificationResult.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Pincode</span>
                <span className="info-value">{verificationResult.pincode}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Residential Type</span>
                <span className="info-value">{verificationResult.residentialType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Scale</span>
                <span className="info-value">
                  {verificationResult.scale.value} {verificationResult.scale.unit} = {verificationResult.scale.equals} {verificationResult.scale.equals_unit}
                </span>
              </div>
            </div>
          </section>

          {/* Compliance Summary */}
          <section className="verification-section">
            <h3 className="section-title">
              <FaChartArea /> Compliance Summary
            </h3>
            <div className="compliance-grid">
              <div className="compliance-card total">
                <div className="compliance-value">{verificationResult.compliance_summary.total}</div>
                <div className="compliance-label">Total Spaces</div>
              </div>
              <div className="compliance-card compliant">
                <div className="compliance-value">{verificationResult.compliance_summary.compliant}</div>
                <div className="compliance-label">Compliant</div>
              </div>
              <div className="compliance-card non-compliant">
                <div className="compliance-value">{verificationResult.compliance_summary.non_compliant}</div>
                <div className="compliance-label">Non-Compliant</div>
              </div>
            </div>
          </section>

          {/* Room Distribution */}
          <section className="verification-section">
            <h3 className="section-title">
              <FaHistory /> Room Distribution
            </h3>
            <div className="room-grid">
              {Object.entries(verificationResult.room_counts)
                .filter(([_, count]) => count > 0)
                .map(([room, count]) => (
                  <div key={room} className="room-card">
                    <div className="room-name">{room.charAt(0).toUpperCase() + room.slice(1)}</div>
                    <div className="room-count">{count}</div>
                  </div>
                ))}
            </div>
          </section>

          {/* Space Details */}
          <section className="verification-section">
            <h3 className="section-title">
              <FaSearch /> Space Details
            </h3>
            <div className="spaces-grid">
              {verificationResult.shapes.map((shape, index) => (
                <div key={index} className={`space-card ${shape.status.toLowerCase()}`}>
                  <div className="space-header">
                    <h4>{shape.space}</h4>
                    <span className={`status-badge ${shape.status.toLowerCase()}`}>
                      {shape.status}
                    </span>
                  </div>
                  <div className="space-metrics">
                    <div className="metric">
                      <span className="metric-label">Area</span>
                      <span className="metric-value">{shape.area}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Width</span>
                      <span className="metric-value">{shape.width}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Length</span>
                      <span className="metric-value">{shape.length}</span>
                    </div>
                  </div>
                  {shape.message && (
                    <div className="space-message">
                      <FaInfoCircle /> {shape.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Building Rules */}
          <section className="verification-section">
            <h3 className="section-title">
              <FaRuler /> Building Rules
            </h3>
            {verificationResult.building_rules && verificationResult.building_rules.length > 0 ? (
              <div className="rules-grid">
                {verificationResult.building_rules.map((rule, index) => (
                  <div key={index} className="rule-card">
                    <div className="rule-header">
                      <h4>{rule.roomType.charAt(0).toUpperCase() + rule.roomType.slice(1)}</h4>
                    </div>
                    <div className="rule-metrics">
                      <div className="metric">
                        <span className="metric-label">Min Area</span>
                        <span className="metric-value">{rule.dimensions.minArea} {rule.dimensions.unit}²</span>
                      </div>
                      {rule.dimensions.maxArea && (
                        <div className="metric">
                          <span className="metric-label">Max Area</span>
                          <span className="metric-value">{rule.dimensions.maxArea} {rule.dimensions.unit}²</span>
                        </div>
                      )}
                      <div className="metric">
                        <span className="metric-label">Min Width</span>
                        <span className="metric-value">{rule.dimensions.minWidth} {rule.dimensions.unit}</span>
                      </div>
                      {rule.dimensions.maxWidth && (
                        <div className="metric">
                          <span className="metric-label">Max Width</span>
                          <span className="metric-value">{rule.dimensions.maxWidth} {rule.dimensions.unit}</span>
                        </div>
                      )}
                      <div className="metric">
                        <span className="metric-label">Min Length</span>
                        <span className="metric-value">{rule.dimensions.minLength} {rule.dimensions.unit}</span>
                      </div>
                      {rule.dimensions.maxLength && (
                        <div className="metric">
                          <span className="metric-label">Max Length</span>
                          <span className="metric-value">{rule.dimensions.maxLength} {rule.dimensions.unit}</span>
                        </div>
                      )}
                    </div>
                    {rule.additionalRequirements && (
                      <div className="additional-requirements">
                        <FaInfoCircle /> {rule.additionalRequirements}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-rules-message">No building rules found for this location.</div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        .verification-window-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .verification-window {
          background: white;
          width: 90%;
          max-width: 1200px;
          max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideIn 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .verification-window-header {
          padding: 1.5rem;
          border-bottom: 2px solid #F3F4F6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 16px 16px 0 0;
        }

        .verification-window-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1F2937;
          display: flex;
          align-items: center;
        }

        .verification-window-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6B7280;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .verification-window-close:hover {
          background: #F3F4F6;
          color: #1F2937;
        }

        .verification-window-content {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .verification-section {
          background: #F9FAFB;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .verification-section:hover {
          transform: translateY(-2px);
        }

        .section-title {
          color: #1F2937;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .info-item {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .info-label {
          color: #6B7280;
          font-size: 0.875rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        .info-value {
          color: #1F2937;
          font-weight: 500;
        }

        .compliance-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .compliance-card {
          text-align: center;
          padding: 1.5rem;
          border-radius: 12px;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .compliance-card:hover {
          transform: translateY(-2px);
        }

        .compliance-card.total {
          background: #F3F4F6;
        }

        .compliance-card.compliant {
          background: #ECFDF5;
          color: #059669;
        }

        .compliance-card.non-compliant {
          background: #FEF2F2;
          color: #DC2626;
        }

        .compliance-value {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .compliance-label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .room-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .room-card {
          background: white;
          padding: 1.25rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .room-card:hover {
          transform: translateY(-2px);
        }

        .room-name {
          color: #6B7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .room-count {
          color: #1F2937;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .spaces-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .space-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .space-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .space-card.compliant {
          border-color: #059669;
          background: #ECFDF5;
        }

        .space-card.non-compliant {
          border-color: #DC2626;
          background: #FEF2F2;
        }

        .space-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .space-header h4 {
          margin: 0;
          color: #1F2937;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .status-badge.compliant {
          background: #059669;
          color: white;
        }

        .status-badge.non-compliant {
          background: #DC2626;
          color: white;
        }

        .shape-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.5);
          padding: 0.75rem;
          border-radius: 8px;
        }

        .metric .label {
          color: #6B7280;
          font-size: 0.75rem;
        }

        .metric .value {
          color: #1F2937;
          font-weight: 500;
        }

        .space-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #6B7280;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .rules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .rule-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .rule-card:hover {
          transform: translateY(-2px);
        }

        .rule-header h4 {
          margin: 0 0 1rem 0;
          color: #1F2937;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .rule-metrics {
          display: grid;
          gap: 0.75rem;
        }

        .additional-requirements {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #F3F4F6;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            padding: 1.5rem;
          }

          .compliance-grid {
            grid-template-columns: 1fr;
          }

          .shapes-grid {
            grid-template-columns: 1fr;
          }

          .rules-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

function VerificationImage() {
  const [formData, setFormData] = useState({
    residentialType: "",
    city: "",
    pincode: "",
    file: null,
    scale_value: "1",
    scale_unit: "inch",
    scale_equals: "1",
    scale_equals_unit: "feet"
  });
  const [latestImage, setLatestImage] = useState(null);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cities, setCities] = useState([]);
  const [availablePincodes, setAvailablePincodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const residentialTypeOptions = {
    Residential: "Residential Plots or Villas",
    "Residential Independent": "Residential Independent",
    Group: "Group Housing",
    Studio: "Studio Apartment",
    Farm: "Farm House",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showNotification("Please upload a PDF file only.", "error");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(""), 3000);
  };

  const fetchCitiesAndPincodes = () => {
    setIsLoading(true);
    setLoadError(false);
    console.log('Fetching cities and pincodes from building rules...');
    
    getCitiesAndPincodesFromRules()
      .then((data) => {
        console.log('Received cities data from building rules:', data);
        if (data && data.cities) {
          setCities(data.cities);
          console.log(`Loaded ${data.cities.length} cities with pincodes from building rules`);
        } else {
          console.warn('No cities data received from the building rules');
          setCities([]);
          setLoadError(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching cities and pincodes from building rules:", error);
        showNotification("Failed to load cities data from building rules. Please try again later.", "error");
        setCities([]);
        setLoadError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getLatestPdf();
    // Fetch cities and pincodes data
    fetchCitiesAndPincodes();
  }, []);

  // Filter pincodes based on selected city
  useEffect(() => {
    if (formData.city && cities.length > 0) {
      const selectedCityData = cities.find(city => city.name === formData.city);
      if (selectedCityData) {
        setAvailablePincodes(selectedCityData.pincodes);
      } else {
        setAvailablePincodes([]);
      }
      // Reset pincode when city changes
      setFormData(prev => ({ ...prev, pincode: "" }));
    } else {
      setAvailablePincodes([]);
    }
  }, [formData.city, cities]);

  const getLatestPdf = async () => {
    try {
      const result = await axios.get("http://localhost:8080/get-files");
      const images = result.data?.data || [];
      if (images.length > 0) {
        const latestFile = images[images.length - 1];
        
        // Create an updated latestImage object with city and pincode
        const updatedLatestImage = {
          ...latestFile,
          // If latestFile doesn't have city/pincode but we had them in state, preserve them
          city: latestFile.city || (latestImage?.city || null),
          pincode: latestFile.pincode || (latestImage?.pincode || null),
          // Handle scale information
          scale_value: latestFile.scale_value || formData.scale_value || "1",
          scale_unit: latestFile.scale_unit || formData.scale_unit || "inch",
          scale_equals: latestFile.scale_equals || formData.scale_equals || "1",
          scale_equals_unit: latestFile.scale_equals_unit || formData.scale_equals_unit || "feet"
        };
        
        setLatestImage(updatedLatestImage);
        setPdfPreviewUrl(`http://localhost:8080/files/${latestFile.pdf}`);
        
        console.log('Latest PDF loaded with location and scale:', updatedLatestImage);
        
        // Update form data with the scale from the latest file
        setFormData(prev => ({
          ...prev,
          scale_value: updatedLatestImage.scale_value || prev.scale_value,
          scale_unit: updatedLatestImage.scale_unit || prev.scale_unit,
          scale_equals: updatedLatestImage.scale_equals || prev.scale_equals,
          scale_equals_unit: updatedLatestImage.scale_equals_unit || prev.scale_equals_unit
        }));
      } else {
        setLatestImage(null);
        setPdfPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      showNotification("Failed to load previous files.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.residentialType || !formData.city || !formData.pincode) {
      showNotification("Please select a file, residential type, city and pincode.", "error");
      return;
    }

    // Validate if selected city and pincode combination is valid
    const selectedCity = cities.find(city => city.name === formData.city);
    if (!selectedCity) {
      showNotification("Selected city is not valid. Please select from the dropdown.", "error");
      return;
    }

    if (!selectedCity.pincodes.includes(formData.pincode)) {
      showNotification("Selected pincode is not valid for this city. Please select from the dropdown.", "error");
      return;
    }

    // Validate scale values
    if (parseFloat(formData.scale_value) <= 0 || parseFloat(formData.scale_equals) <= 0) {
      showNotification("Scale values must be greater than zero.", "error");
      return;
    }

    setIsUploading(true);
    const data = new FormData();
    data.append("title", formData.residentialType);
    data.append("file", formData.file);
    data.append("city", formData.city);
    data.append("pincode", formData.pincode);
    
    // Add scale information to the form data
    data.append("scale_value", formData.scale_value);
    data.append("scale_unit", formData.scale_unit);
    data.append("scale_equals", formData.scale_equals);
    data.append("scale_equals_unit", formData.scale_equals_unit);

    try {
      console.log(`Uploading plan for city: ${formData.city}, pincode: ${formData.pincode}`);
      console.log(`Using scale: ${formData.scale_value} ${formData.scale_unit} = ${formData.scale_equals} ${formData.scale_equals_unit}`);
      
      const result = await axios.post(
        "http://localhost:8080/upload-files",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.data.status === "ok") {
        showNotification("File uploaded successfully!");

        setPdfPreviewUrl(`http://localhost:8080/files/${result.data.filePath}`);
        setLatestImage({
          title: formData.residentialType,
          city: formData.city,
          pincode: formData.pincode,
          pdf: result.data.filePath,
          scale_value: formData.scale_value,
          scale_unit: formData.scale_unit,
          scale_equals: formData.scale_equals,
          scale_equals_unit: formData.scale_equals_unit
        });

        setFormData({ 
          residentialType: "", 
          city: "", 
          pincode: "", 
          file: null,
          scale_value: formData.scale_value,
          scale_unit: formData.scale_unit,
          scale_equals: formData.scale_equals,
          scale_equals_unit: formData.scale_equals_unit
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showNotification("Failed to upload file. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerify = async () => {
    if (!latestImage || !latestImage.pdf) {
      showNotification("No file available for verification.", "error");
      return;
    }

    // Check if there's city and pincode data
    if (!latestImage.city || !latestImage.pincode) {
      showNotification("City and pincode information missing. Please reupload with location details.", "error");
      return;
    }

    setIsVerifying(true);
    try {
      console.log(`Verifying plan for city: ${latestImage.city}, pincode: ${latestImage.pincode}`);
      console.log(`Using scale: ${formData.scale_value} ${formData.scale_unit} = ${formData.scale_equals} ${formData.scale_equals_unit}`);
      console.log(`Residential type: ${latestImage.title || "Not specified"}`);
      
      const response = await axios.get(
        `http://localhost:8080/files/${latestImage.pdf}`,
        { responseType: "blob" }
      );

      const file = new File([response.data], "latest-construction-plan.pdf", {
        type: "application/pdf",
      });

      const verificationFormData = new FormData();
      verificationFormData.append("file", file);
      verificationFormData.append("city", latestImage.city);
      verificationFormData.append("pincode", latestImage.pincode);
      
      // Add residential type
      verificationFormData.append("residentialType", latestImage.title || "");
      
      // Add scale information
      verificationFormData.append("scale_value", formData.scale_value);
      verificationFormData.append("scale_unit", formData.scale_unit);
      verificationFormData.append("scale_equals", formData.scale_equals);
      verificationFormData.append("scale_equals_unit", formData.scale_equals_unit);

      const verificationResponse = await axios.post(
        "http://127.0.0.1:5000/verify-pdf",
        verificationFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (verificationResponse.data.status === "error") {
        throw new Error(verificationResponse.data.message);
      }

      // Structure the verification result with all necessary information
      const result = {
        ...verificationResponse.data,
        city: latestImage.city,
        pincode: latestImage.pincode,
        residentialType: latestImage.title,
        scale: {
          value: formData.scale_value,
          unit: formData.scale_unit,
          equals: formData.scale_equals,
          equals_unit: formData.scale_equals_unit
        },
        building_rules: verificationResponse.data.building_rules || [],
        room_counts: verificationResponse.data.room_counts || {},
        compliance_summary: verificationResponse.data.compliance_summary || {
          total: verificationResponse.data.shapes?.length || 0,
          compliant: verificationResponse.data.shapes?.filter(s => s.status === "Compliant").length || 0,
          non_compliant: verificationResponse.data.shapes?.filter(s => s.status !== "Compliant").length || 0
        },
        shapes: verificationResponse.data.shapes?.map(shape => ({
          ...shape,
          space: shape.space || shape.color?.charAt(0).toUpperCase() + shape.color?.slice(1) || "Unknown",
          status: shape.status || (shape.is_compliant ? "Compliant" : "Non-Compliant"),
          area: shape.area || `${shape.real_dimensions?.area} ${shape.real_dimensions?.unit}²`,
          width: shape.width || `${shape.real_dimensions?.width} ${shape.real_dimensions?.unit}`,
          length: shape.length || `${shape.real_dimensions?.height} ${shape.real_dimensions?.unit}`,
          message: shape.message || shape.compliance_message || null
        })) || []
      };

      console.log("Verification result:", result);
      setVerificationResult(result);
      setIsModalOpen(true);
      
      // Save to verification history if user is logged in
      if (isUserLoggedIn()) {
        try {
          await axios.post(
            "http://localhost:8080/api/user/save-verification",
            {
              title: latestImage.title,
              type: latestImage.title,
              city: latestImage.city || "Unknown",
              pincode: latestImage.pincode || "Unknown",
              status: verificationResponse.data.compliance_summary.non_compliant > 0 ? 
                "Non-Compliant" : "Compliant",
              pdfUrl: `http://localhost:8080/files/${latestImage.pdf}`,
              results: verificationResponse.data.shapes,
              compliance_summary: verificationResponse.data.compliance_summary
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          console.log("Verification saved to history");
        } catch (historyError) {
          console.error("Error saving to history:", historyError);
          // Don't show error to user - continue with verification process
        }
      } else {
        console.log("User not logged in, skipping history save");
      }
    } catch (error) {
      console.error("Error verifying file:", error);
      showNotification("Verification failed. Please try again.", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <style>
          {`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
              opacity: 0;
              animation: fadeIn 0.3s ease forwards;
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            .modal-content {
              background: white;
              padding: 2rem;
              border-radius: 16px;
              max-width: 1000px;
              width: 90%;
              max-height: 85vh;
              overflow-y: auto;
              position: relative;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              transform: scale(0.95);
              animation: popIn 0.3s ease forwards;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            @keyframes popIn {
              from {
                transform: scale(0.95);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }

            .modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 2px solid #F3F4F6;
              position: sticky;
              top: 0;
              background: white;
              z-index: 10;
            }

            .modal-header h2 {
              margin: 0;
              color: #1F2937;
              font-size: 1.5rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 0.75rem;
            }

            .close-button {
              background: none;
              border: none;
              font-size: 1.5rem;
              color: #6B7280;
              cursor: pointer;
              padding: 0.5rem;
              transition: all 0.2s ease;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
            }

            .close-button:hover {
              color: #1F2937;
              background: #F3F4F6;
            }

            .modal-body {
              display: flex;
              flex-direction: column;
              gap: 2rem;
              padding-right: 0.5rem;
            }

            .modal-body::-webkit-scrollbar {
              width: 8px;
            }

            .modal-body::-webkit-scrollbar-track {
              background: #F3F4F6;
              border-radius: 4px;
            }

            .modal-body::-webkit-scrollbar-thumb {
              background: #D1D5DB;
              border-radius: 4px;
            }

            .modal-body::-webkit-scrollbar-thumb:hover {
              background: #9CA3AF;
            }

            .verification-summary,
            .compliance-summary,
            .room-counts,
            .shapes-list,
            .building-rules {
              background: #F9FAFB;
              border-radius: 12px;
              padding: 1.5rem;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s ease;
            }

            .verification-summary:hover,
            .compliance-summary:hover,
            .room-counts:hover,
            .shapes-list:hover,
            .building-rules:hover {
              transform: translateY(-2px);
            }

            .summary-header,
            .compliance-header,
            .room-counts-header,
            .shapes-header,
            .rules-header {
              margin-bottom: 1rem;
            }

            .summary-header h3,
            .compliance-header h3,
            .room-counts-header h3,
            .shapes-header h3,
            .rules-header h3 {
              color: #1F2937;
              font-size: 1.25rem;
              font-weight: 600;
              margin: 0;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
            }

            .summary-item {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              background: white;
              padding: 1rem;
              border-radius: 8px;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }

            .summary-item .label {
              color: #6B7280;
              font-size: 0.875rem;
            }

            .summary-item .value {
              color: #1F2937;
              font-weight: 500;
            }

            .compliance-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1rem;
            }

            .compliance-item {
              text-align: center;
              padding: 1.5rem 1rem;
              border-radius: 12px;
              background: white;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s ease;
            }

            .compliance-item:hover {
              transform: translateY(-2px);
            }

            .compliance-item.total {
              background: #F3F4F6;
            }

            .compliance-item.compliant {
              background: #ECFDF5;
              color: #059669;
            }

            .compliance-item.non-compliant {
              background: #FEF2F2;
              color: #DC2626;
            }

            .compliance-item .value {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 0.5rem;
              line-height: 1;
            }

            .compliance-item .label {
              font-size: 0.875rem;
              font-weight: 500;
            }

            .room-counts-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 1rem;
            }

            .room-count-item {
              background: white;
              padding: 1.25rem;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s ease;
            }

            .room-count-item:hover {
              transform: translateY(-2px);
            }

            .room-count-item .room-name {
              color: #6B7280;
              font-size: 0.875rem;
              margin-bottom: 0.5rem;
            }

            .room-count-item .room-count {
              color: #1F2937;
              font-size: 1.75rem;
              font-weight: 600;
            }

            .shapes-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 1rem;
            }

            .shape-item {
              background: white;
              padding: 1.5rem;
              border-radius: 12px;
              border: 1px solid #E5E7EB;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              transition: all 0.2s ease;
            }

            .shape-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .shape-item.compliant {
              border-color: #059669;
              background: #ECFDF5;
            }

            .shape-item.non-compliant {
              border-color: #DC2626;
              background: #FEF2F2;
            }

            .shape-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1rem;
            }

            .shape-header h4 {
              margin: 0;
              color: #1F2937;
              font-size: 1.125rem;
              font-weight: 600;
            }

            .status-badge {
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.75rem;
              font-weight: 500;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }

            .status-badge.compliant {
              background: #059669;
              color: white;
            }

            .status-badge.non-compliant {
              background: #DC2626;
              color: white;
            }

            .shape-metrics {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1rem;
              margin-bottom: 1rem;
            }

            .metric {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
              background: rgba(255, 255, 255, 0.5);
              padding: 0.75rem;
              border-radius: 8px;
            }

            .metric .label {
              color: #6B7280;
              font-size: 0.75rem;
            }

            .metric .value {
              color: #1F2937;
              font-weight: 500;
            }

            .message {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem;
              background: white;
              border-radius: 8px;
              font-size: 0.875rem;
              color: #6B7280;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }

            .rules-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 1rem;
            }

            .rule-item {
              background: white;
              padding: 1.5rem;
              border-radius: 12px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s ease;
            }

            .rule-item:hover {
              transform: translateY(-2px);
            }

            .rule-header h4 {
              margin: 0 0 1rem 0;
              color: #1F2937;
              font-size: 1.125rem;
              font-weight: 600;
            }

            .rule-metrics {
              display: grid;
              gap: 0.75rem;
            }

            .additional-requirements {
              margin-top: 1rem;
              padding: 0.75rem;
              background: #F3F4F6;
              border-radius: 8px;
              font-size: 0.875rem;
              color: #6B7280;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            @media (max-width: 768px) {
              .modal-content {
                width: 95%;
                padding: 1.5rem;
              }

              .compliance-grid {
                grid-template-columns: 1fr;
              }

              .shapes-grid {
                grid-template-columns: 1fr;
              }

              .rules-grid {
                grid-template-columns: 1fr;
              }
            }
          `}
        </style>
        <PageHeader>
          <PageTitle>
            <FaFileAlt /> Construction Plan Verification
          </PageTitle>
          <PageSubtitle>Upload and verify building plans for compliance</PageSubtitle>
        </PageHeader>

        {notification && (
          <NotificationContainer type={notificationType}>
            {notificationType === "success" ? (
              <FaCheckCircle />
            ) : (
              <FaTimesCircle />
            )}
            <p>{notification}</p>
          </NotificationContainer>
        )}

        <ContentGrid>
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCloudUploadAlt /> Upload Construction Plan
              </CardTitle>
            </CardHeader>

            <UploadForm onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <StepNumber>1</StepNumber> Upload PDF Plan
                </Label>
                <FileInput>
                  <input
                    type="file"
                    name="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <FileInputPreview>
                    <FaCloudUploadAlt />
                    <p>
                      <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p>PDF files only</p>
                  </FileInputPreview>
                </FileInput>
              </FormGroup>

              <FormGroup>
                <Label>
                  <StepNumber>2</StepNumber> Select Residential Type
                </Label>
                <Select
                  name="residentialType"
                  value={formData.residentialType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  {Object.entries(residentialTypeOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  <StepNumber>3</StepNumber> 
                  <FaMapMarkerAlt /> Select City (from Building Rules)
                </Label>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <option value="">Loading cities from rules database...</option>
                  ) : cities.length === 0 ? (
                    <option value="">No cities available in rules database</option>
                  ) : (
                    <>
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </>
                  )}
                </Select>
                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#4b5563' }}>
                  Cities and pincodes are loaded from the building rules database to ensure verification uses the correct rules.
                </div>
                {cities.length === 0 && !isLoading && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    No cities found in building rules database.
                    {loadError && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          fetchCitiesAndPincodes();
                        }}
                        style={{
                          marginLeft: '0.5rem',
                          color: '#1a2a6c',
                          border: 'none',
                          background: 'none',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '0.8rem'
                        }}
                      >
                        Try again
                      </button>
                    )}
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  <StepNumber>4</StepNumber>
                  <FaMapPin /> Select Pincode (from Building Rules)
                </Label>
                <Select
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={!formData.city || availablePincodes.length === 0 || isLoading}
                  required
                  style={!formData.city ? { 
                    opacity: 0.6, 
                    cursor: 'not-allowed',
                    background: '#f5f5f5' 
                  } : {}}
                >
                  {!formData.city ? (
                    <option value="">Select a city first</option>
                  ) : availablePincodes.length === 0 ? (
                    <option value="">No pincodes available for this city</option>
                  ) : (
                    <>
                      <option value="">Select a pincode</option>
                      {availablePincodes.map((pincode) => (
                        <option key={pincode} value={pincode}>
                          {pincode}
                        </option>
                      ))}
                    </>
                  )}
                </Select>
                {formData.city && availablePincodes.length === 0 && !isLoading && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    No pincodes found for selected city in building rules.
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  <StepNumber>5</StepNumber>
                  <FaRuler /> Plan Scale
                </Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input
                    type="number"
                    name="scale_value"
                    value={formData.scale_value}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    style={{ 
                      width: '50px',
                      padding: '0.6rem 0.4rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                    }}
                  />
                  <Select
                    name="scale_unit"
                    value={formData.scale_unit}
                    onChange={handleChange}
                    style={{ flex: '1' }}
                  >
                    <option value="inch">inch</option>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                  </Select>
                  <span style={{ margin: '0 0.4rem' }}>=</span>
                  <input
                    type="number"
                    name="scale_equals"
                    value={formData.scale_equals}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    style={{ 
                      width: '50px',
                      padding: '0.6rem 0.4rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                    }}
                  />
                  <Select
                    name="scale_equals_unit"
                    value={formData.scale_equals_unit}
                    onChange={handleChange}
                    style={{ flex: '1' }}
                  >
                    <option value="feet">feet</option>
                    <option value="meters">meters</option>
                  </Select>
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#4b5563' }}>
                  Specify the scale of your construction plan (e.g., 1 inch = 5 feet)
                </div>
              </FormGroup>

              <SubmitButton type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Plan"}
                {!isUploading && <FaArrowRight />}
              </SubmitButton>
              
              {!isUserLoggedIn() && (
                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                    Login to save your verification history
                  </p>
                  <LoginLink href="/login">
                    <FaUserLock /> Login to Save History
                  </LoginLink>
                </div>
              )}
            </UploadForm>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <FaFileAlt /> Document Preview
              </CardTitle>
            </CardHeader>

            <PreviewContainer>
              <PDFPreviewContainer>
                {pdfPreviewUrl ? (
                  <>
                    <PDFPreviewTitle>
                      <FaBuilding />
                      {latestImage?.title
                        ? residentialTypeOptions[latestImage.title] ||
                          latestImage.title
                        : "Uploaded PDF"}
                      {latestImage?.city && latestImage?.pincode && (
                        <span style={{ 
                          fontSize: "0.8rem", 
                          marginLeft: "0.5rem", 
                          backgroundColor: "rgba(26, 42, 108, 0.1)",
                          color: "#1a2a6c", 
                          padding: "0.2rem 0.4rem",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.2rem"
                        }}>
                          <FaMapMarkerAlt size={10} /> {latestImage.city}, {latestImage.pincode}
                        </span>
                      )}
                    </PDFPreviewTitle>
                    
                    {latestImage?.scale_value && latestImage?.scale_unit && latestImage?.scale_equals && latestImage?.scale_equals_unit && (
                      <div style={{ 
                        fontSize: "0.75rem", 
                        marginBottom: "0.5rem", 
                        color: "#4b5563",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem"
                      }}>
                        <FaRuler size={10} /> Scale: {latestImage.scale_value} {latestImage.scale_unit} = {latestImage.scale_equals} {latestImage.scale_equals_unit}
                      </div>
                    )}
                    <PDFViewer
                      src={pdfPreviewUrl}
                      title="PDF Preview"
                    />
                  </>
                ) : (
                  <EmptyState>
                    <FaFileAlt />
                    <p>No files uploaded yet</p>
                    <p>Upload a construction plan to see preview</p>
                  </EmptyState>
                )}
              </PDFPreviewContainer>

              {pdfPreviewUrl && (
                <VerifyButton onClick={handleVerify} disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify Construction Plan"}
                  {!isVerifying && <FaRegCheckCircle />}
                </VerifyButton>
              )}
            </PreviewContainer>
          </Card>
        </ContentGrid>

        <VerificationDetailsWindow
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          verificationResult={verificationResult}
        />
      </PageContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default VerificationImage;
