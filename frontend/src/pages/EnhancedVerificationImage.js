import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaFileAlt, FaBuilding, FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Main container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderIcon = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #1a2a6c;
  margin: 0;
  font-weight: 700;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UploadSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #1a2a6c;
  margin-top: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FileUploadContainer = styled.div`
  border: 2px dashed ${props => props.isDragging ? '#1a2a6c' : '#e5e7eb'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? 'rgba(26, 42, 108, 0.05)' : '#f9fafb'};
  cursor: pointer;
  
  &:hover {
    border-color: #1a2a6c;
    background: rgba(26, 42, 108, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #1a2a6c;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  margin-bottom: 1rem;
  
  p {
    margin: 0.5rem 0;
    color: #6b7280;
  }
  
  strong {
    color: #1a2a6c;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  margin-top: 1rem;
`;

const FileIcon = styled.div`
  color: #1a2a6c;
  font-size: 1.5rem;
`;

const FileDetails = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    color: #1f2937;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: #6b7280;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  border-radius: 4px;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1f2937;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231f2937'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.1);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const PreviewSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const PDFPreviewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  min-height: 300px;
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 350px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #d1d5db;
  }
  
  p {
    margin: 0;
  }
`;

const VerifyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1.5rem;
  background: #059669;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #047857;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a2a6c;
  margin: 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  
  &:hover {
    color: #1f2937;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const ResultCard = styled.div`
  background: ${props => props.status === 'Compliant' ? 'rgba(16, 185, 129, 0.1)' : props.status === 'Non-Compliant' ? 'rgba(239, 68, 68, 0.1)' : '#f9fafb'};
  border: 1px solid ${props => props.status === 'Compliant' ? 'rgba(16, 185, 129, 0.3)' : props.status === 'Non-Compliant' ? 'rgba(239, 68, 68, 0.3)' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1.25rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ResultStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  color: ${props => props.status === 'Compliant' ? '#059669' : props.status === 'Non-Compliant' ? '#dc2626' : '#6b7280'};
  background: ${props => props.status === 'Compliant' ? 'rgba(16, 185, 129, 0.2)' : props.status === 'Non-Compliant' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(107, 114, 128, 0.2)'};
`;

const ResultTitle = styled.h4`
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
`;

const ResultProperty = styled.div`
  margin-bottom: 0.75rem;
  
  h5 {
    margin: 0;
    color: #6b7280;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  p {
    margin: 0.25rem 0 0 0;
    color: #1f2937;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const CoordinatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

function EnhancedVerificationImage() {
  const [formData, setFormData] = useState({
    residentialType: "",
    file: null,
  });
  const [latestImage, setLatestImage] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  useEffect(() => {
    getLatestPdf();
  }, []);

  const getLatestPdf = async () => {
    try {
      const result = await axios.get("http://localhost:8080/get-files");
      const images = result.data?.data || [];
      if (images.length > 0) {
        const latestFile = images[images.length - 1];
        setLatestImage(latestFile);
        setPdfPreviewUrl(`http://localhost:8080/files/${latestFile.pdf}`);
      } else {
        setLatestImage(null);
        setPdfPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error loading previous files");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.residentialType) {
      toast.error("Please select a file and choose a residential type.");
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("title", formData.residentialType);
    data.append("file", formData.file);

    try {
      const result = await axios.post(
        "http://localhost:8080/upload-files",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.data.status === "ok") {
        toast.success("File uploaded successfully!");

        setPdfPreviewUrl(`http://localhost:8080/files/${result.data.filePath}`);
        setLatestImage({
          title: formData.residentialType,
          pdf: result.data.filePath,
        });

        setFormData({ residentialType: "", file: null });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!latestImage || !latestImage.pdf) {
      toast.error("No file available for verification.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/files/${latestImage.pdf}`,
        { responseType: "blob" }
      );

      const file = new File([response.data], "latest-construction-plan.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);

      const verificationResponse = await axios.post(
        "http://127.0.0.1:5000/verify-pdf",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setVerificationResult(verificationResponse.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error verifying file:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper function to format the file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <PageHeader>
        <HeaderIcon>
          <FaSearch />
        </HeaderIcon>
        <Title>Construction Plan Verification</Title>
      </PageHeader>
      
      <ContentWrapper>
        <UploadSection>
          <SectionTitle>
            <FaCloudUploadAlt /> Upload Construction Plan
          </SectionTitle>
          
          <StyledForm onSubmit={handleSubmit}>
            <FileUploadContainer 
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <HiddenInput 
                type="file"
                id="file-input"
                accept=".pdf"
                onChange={handleFileChange}
              />
              
              {!formData.file ? (
                <>
                  <UploadIcon>
                    <FaCloudUploadAlt />
                  </UploadIcon>
                  <UploadText>
                    <strong>Click to upload</strong> or drag and drop
                    <p>PDF files only (max. 10MB)</p>
                  </UploadText>
                </>
              ) : (
                <FileInfo>
                  <FileIcon>
                    <FaFileAlt />
                  </FileIcon>
                  <FileDetails>
                    <h4>{formData.file.name}</h4>
                    <p>{formatFileSize(formData.file.size)}</p>
                  </FileDetails>
                  <RemoveButton onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}>
                    <FaTimesCircle />
                  </RemoveButton>
                </FileInfo>
              )}
            </FileUploadContainer>
            
            <FormGroup>
              <Label htmlFor="residentialType">Select Building Type</Label>
              <Select
                id="residentialType"
                name="residentialType"
                value={formData.residentialType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                {Object.entries(residentialTypeOptions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isLoading || !formData.file || !formData.residentialType}>
              {isLoading ? 'Uploading...' : 'Upload Construction Plan'}
            </SubmitButton>
          </StyledForm>
        </UploadSection>
        
        <PreviewSection>
          <SectionTitle>
            <FaFileAlt /> Document Preview
          </SectionTitle>
          
          <PDFPreviewContainer>
            {pdfPreviewUrl ? (
              <>
                <PDFViewer 
                  src={pdfPreviewUrl}
                  title="PDF Preview"
                />
                {latestImage?.title && (
                  <div style={{marginTop: '0.75rem', fontSize: '0.9rem', color: '#6b7280'}}>
                    <FaBuilding style={{marginRight: '0.5rem'}} />
                    Type: {residentialTypeOptions[latestImage.title] || latestImage.title}
                  </div>
                )}
              </>
            ) : (
              <EmptyState>
                <FaFileAlt />
                <p>No document uploaded yet.</p>
                <p>Upload a construction plan to see the preview here.</p>
              </EmptyState>
            )}
          </PDFPreviewContainer>
          
          {pdfPreviewUrl && (
            <VerifyButton 
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Construction Plan'}
            </VerifyButton>
          )}
        </PreviewSection>
      </ContentWrapper>
      
      {isModalOpen && verificationResult && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                <FaCheckCircle style={{ color: '#059669' }} /> Verification Results
              </ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            
            <ResultsGrid>
              {verificationResult.map((item, index) => (
                <ResultCard key={index} status={item.status}>
                  <ResultHeader>
                    <ResultTitle>{item.space}</ResultTitle>
                    <ResultStatus status={item.status}>
                      {item.status === 'Compliant' ? 
                        <><FaCheckCircle size={12} /> Compliant</> : 
                        <><FaTimesCircle size={12} /> Non-Compliant</>
                      }
                    </ResultStatus>
                  </ResultHeader>
                  
                  <ResultProperty>
                    <h5>AREA</h5>
                    <p>{item.area}</p>
                  </ResultProperty>
                  
                  <ResultProperty>
                    <h5>DIMENSIONS</h5>
                    <p>Length: {item.length} × Width: {item.width}</p>
                  </ResultProperty>
                  
                  <ResultProperty>
                    <h5>COORDINATES</h5>
                    <CoordinatesGrid>
                      <div>X0: {item.coordinates.x0}</div>
                      <div>Y0: {item.coordinates.y0}</div>
                      <div>X1: {item.coordinates.x1}</div>
                      <div>Y1: {item.coordinates.y1}</div>
                    </CoordinatesGrid>
                  </ResultProperty>
                </ResultCard>
              ))}
            </ResultsGrid>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <SubmitButton onClick={() => setIsModalOpen(false)}>
                Close
              </SubmitButton>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

export default EnhancedVerificationImage; 