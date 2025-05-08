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
  FaMapPin
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

// Before the VerificationImage component
const isUserLoggedIn = () => {
  // Check if the user has a valid token in local storage
  return localStorage.getItem('token') !== null;
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

      setVerificationResult(verificationResponse.data);
      
      // Save to verification history if user is logged in
      if (isUserLoggedIn()) {
        try {
          await axios.post(
            "http://localhost:8080/api/user/save-verification",
            {
              title: latestImage.title,
              type: latestImage.title, // Using the same value for type
              city: latestImage.city || "Unknown",
              pincode: latestImage.pincode || "Unknown",
              status: verificationResponse.data.some(item => item.status === "Non-Compliant") ? 
                "Non-Compliant" : "Compliant",
              pdfUrl: `http://localhost:8080/files/${latestImage.pdf}`,
              results: verificationResponse.data
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
      
      setIsModalOpen(true);
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

        {isModalOpen && verificationResult && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  <FaCheckCircle /> Verification Results
                </ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
              </ModalHeader>

              <ResultsGrid>
                {verificationResult.map((item, index) => (
                  <ResultCard key={index} status={item.status}>
                    <ResultHeader>
                      <ResultTitle>{item.space}</ResultTitle>
                      <ResultStatus status={item.status}>
                        {item.status === "Compliant" ? (
                          <>
                            <FaCheckCircle /> Compliant
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Non-Compliant
                          </>
                        )}
                      </ResultStatus>
                    </ResultHeader>

                    <ResultMetrics>
                      <Metric>
                        <MetricLabel>
                          <FaChartArea /> Area
                        </MetricLabel>
                        <MetricValue>{item.area}</MetricValue>
                      </Metric>
                      <Metric>
                        <MetricLabel>
                          <FaRuler /> Length
                        </MetricLabel>
                        <MetricValue>{item.length}</MetricValue>
                      </Metric>
                      <Metric>
                        <MetricLabel>
                          <FaRuler style={{ transform: 'rotate(90deg)' }} /> Width
                        </MetricLabel>
                        <MetricValue>{item.width}</MetricValue>
                      </Metric>
                    </ResultMetrics>

                    <CoordinatesContainer>
                      <CoordinatesLabel>Coordinates</CoordinatesLabel>
                      <CoordinatesGrid>
                        <Coordinate>X0: {item.coordinates.x0}</Coordinate>
                        <Coordinate>Y0: {item.coordinates.y0}</Coordinate>
                        <Coordinate>X1: {item.coordinates.x1}</Coordinate>
                        <Coordinate>Y1: {item.coordinates.y1}</Coordinate>
                      </CoordinatesGrid>
                    </CoordinatesContainer>
                  </ResultCard>
                ))}
              </ResultsGrid>

              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <SubmitButton onClick={() => setIsModalOpen(false)}>
                  Close Results
                </SubmitButton>
              </div>
            </ModalContent>
          </Modal>
        )}
      </PageContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default VerificationImage;
