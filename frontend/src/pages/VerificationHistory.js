import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { 
  FaHistory, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaEye, 
  FaDownload, 
  FaSearch,
  FaFilter,
  FaSort,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglass
} from "react-icons/fa";

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 80px auto 0;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Poppins', sans-serif;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h2`
  color: #1a2a6c;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
  
  svg {
    color: #6b7280;
  }
`;

const VerificationCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const VerificationCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  padding: 1.25rem;
  position: relative;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const CardDate = styled.div`
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  opacity: 0.9;
  
  svg {
    margin-right: 0.4rem;
    font-size: 0.8rem;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  background: ${props => {
    switch (props.status) {
      case 'Compliant': return 'rgba(16, 185, 129, 0.2)';
      case 'Non-Compliant': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(245, 158, 11, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Compliant': return '#059669';
      case 'Non-Compliant': return '#dc2626';
      default: return '#d97706';
    }
  }};
  font-size: 0.75rem;
  font-weight: 600;
  
  svg {
    margin-right: 0.35rem;
  }
`;

const CardBody = styled.div`
  padding: 1.25rem;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Property = styled.div`
  margin-bottom: 0.5rem;
`;

const PropertyLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const PropertyValue = styled.div`
  font-size: 0.95rem;
  color: #1f2937;
  font-weight: 500;
`;

const CardFooter = styled.div`
  border-top: 1px solid #f3f4f6;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: #1a2a6c;
    color: white;
    
    &:hover {
      background: #111d4a;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #4b5563;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  svg {
    font-size: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.25rem;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #6b7280;
    margin: 0;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 95%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #1a2a6c;
  font-size: 1.35rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: #1a2a6c;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #1f2937;
  }
`;

const PDFPreviewContainer = styled.div`
  margin: 1rem 0 2rem;
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
`;

const ResultCard = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => props.status === 'Compliant' ? '#059669' : '#dc2626'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ResultTitle = styled.h4`
  margin: 0;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
`;

const ResultStatus = styled.div`
  display: flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.status === 'Compliant' ? '#059669' : '#dc2626'};
  background: ${props => props.status === 'Compliant' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)'};
  
  svg {
    margin-right: 0.35rem;
  }
`;

const ResultMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Metric = styled.div`
  background: white;
  border-radius: 6px;
  padding: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const MetricLabel = styled.div`
  color: #6b7280;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 600;
`;

const VerificationHistoryPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchVerifications();
  }, []);
  
  const fetchVerifications = async () => {
    setLoading(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      // Make API call with authorization header
      const response = await axios.get(
        "http://localhost:8080/api/user/verifications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setVerifications(response.data);
    } catch (error) {
      console.error("Error fetching verification history:", error);
      toast.error("Failed to load verification history. Please try again later.");
      
      // If in development, load mock data for testing
      if (process.env.NODE_ENV === 'development') {
        console.log("Loading mock data for development");
        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            title: "Residential Villa Plan",
            type: "Residential",
            submissionDate: "2023-09-15T10:30:00",
            status: "Compliant",
            pdfUrl: "http://localhost:8080/files/sample1.pdf",
            results: [
              {
                space: "Living Room",
                area: "320 sq ft",
                length: "20 ft",
                width: "16 ft",
                status: "Compliant",
                coordinates: {
                  x0: 100,
                  y0: 150,
                  x1: 300,
                  y1: 350
                }
              },
              {
                space: "Master Bedroom",
                area: "240 sq ft",
                length: "16 ft",
                width: "15 ft",
                status: "Compliant",
                coordinates: {
                  x0: 320,
                  y0: 150,
                  x1: 480,
                  y1: 350
                }
              }
            ]
          },
          {
            id: 2,
            title: "Commercial Building Plan",
            type: "Commercial",
            submissionDate: "2023-08-23T14:45:00",
            status: "Non-Compliant",
            pdfUrl: "http://localhost:8080/files/sample2.pdf",
            results: [
              {
                space: "Office Space",
                area: "450 sq ft",
                length: "30 ft",
                width: "15 ft",
                status: "Compliant",
                coordinates: {
                  x0: 100,
                  y0: 150,
                  x1: 400,
                  y1: 300
                }
              },
              {
                space: "Conference Room",
                area: "180 sq ft",
                length: "12 ft",
                width: "15 ft",
                status: "Non-Compliant",
                coordinates: {
                  x0: 420,
                  y0: 150,
                  x1: 540,
                  y1: 300
                }
              }
            ]
          },
          {
            id: 3,
            title: "Studio Apartment Complex",
            type: "Group Housing",
            submissionDate: "2023-07-05T09:15:00",
            status: "Non-Compliant",
            pdfUrl: "http://localhost:8080/files/sample3.pdf",
            results: [
              {
                space: "Living Area",
                area: "200 sq ft",
                length: "20 ft",
                width: "10 ft",
                status: "Compliant",
                coordinates: {
                  x0: 100,
                  y0: 150,
                  x1: 300,
                  y1: 250
                }
              },
              {
                space: "Kitchen",
                area: "80 sq ft",
                length: "8 ft",
                width: "10 ft",
                status: "Non-Compliant",
                coordinates: {
                  x0: 320,
                  y0: 150,
                  x1: 400,
                  y1: 250
                }
              }
            ]
          }
        ];
        setVerifications(mockData);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewDetails = (verification) => {
    setSelectedVerification(verification);
    setIsModalOpen(true);
  };
  
  const handleDownloadPDF = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'verification-report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const filteredVerifications = verifications.filter(verification => 
    verification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (verification.city && verification.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (verification.pincode && verification.pincode.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Compliant':
        return <FaCheckCircle />;
      case 'Non-Compliant':
        return <FaTimesCircle />;
      default:
        return <FaHourglass />;
    }
  };
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <PageTitle>
              <FaHistory /> Verification History
            </PageTitle>
            <PageSubtitle>View all your previous construction plan verifications</PageSubtitle>
          </HeaderLeft>
          
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search by title, type, city or pincode..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchContainer>
        </PageHeader>
        
        <Toolbar>
          <FilterContainer>
            <FilterButton>
              <FaFilter /> Filter
            </FilterButton>
            <FilterButton>
              <FaSort /> Sort
            </FilterButton>
          </FilterContainer>
        </Toolbar>
        
        {loading ? (
          <div>Loading verification history...</div>
        ) : filteredVerifications.length > 0 ? (
          <VerificationCardsContainer>
            {filteredVerifications.map(verification => (
              <VerificationCard key={verification.id}>
                <CardHeader>
                  <CardTitle>
                    <FaFileAlt /> {verification.title}
                  </CardTitle>
                  <CardDate>
                    <FaCalendarAlt /> {formatDate(verification.submissionDate)}
                  </CardDate>
                  <StatusBadge status={verification.status}>
                    {getStatusIcon(verification.status)} {verification.status}
                  </StatusBadge>
                </CardHeader>
                
                <CardBody>
                  <PropertyGrid>
                    <Property>
                      <PropertyLabel>Type</PropertyLabel>
                      <PropertyValue>{verification.type}</PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>City</PropertyLabel>
                      <PropertyValue>{verification.city || 'Unknown'}</PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>Pincode</PropertyLabel>
                      <PropertyValue>{verification.pincode || 'Unknown'}</PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>Spaces Verified</PropertyLabel>
                      <PropertyValue>{verification.results?.length || 0}</PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>Compliant Spaces</PropertyLabel>
                      <PropertyValue>
                        {verification.results?.filter(r => r.status === 'Compliant').length || 0}
                      </PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>Non-Compliant Spaces</PropertyLabel>
                      <PropertyValue>
                        {verification.results?.filter(r => r.status === 'Non-Compliant').length || 0}
                      </PropertyValue>
                    </Property>
                  </PropertyGrid>
                </CardBody>
                
                <CardFooter>
                  <ActionButton 
                    className="secondary"
                    onClick={() => handleDownloadPDF(verification.pdfUrl, `${verification.title}.pdf`)}
                  >
                    <FaDownload /> Download
                  </ActionButton>
                  <ActionButton 
                    className="primary"
                    onClick={() => handleViewDetails(verification)}
                  >
                    <FaEye /> View Details
                  </ActionButton>
                </CardFooter>
              </VerificationCard>
            ))}
          </VerificationCardsContainer>
        ) : (
          <EmptyState>
            <FaHistory />
            <h3>No verification history found</h3>
            <p>Your previous verifications will appear here.</p>
          </EmptyState>
        )}
        
        {isModalOpen && selectedVerification && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  <FaFileAlt /> {selectedVerification.title}
                </ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
              </ModalHeader>
              
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <PropertyGrid style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <Property>
                      <PropertyLabel>Type</PropertyLabel>
                      <PropertyValue>{selectedVerification.type}</PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>Date</PropertyLabel>
                      <PropertyValue>{formatDate(selectedVerification.submissionDate)}</PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>Status</PropertyLabel>
                      <PropertyValue style={{ 
                        color: selectedVerification.status === 'Compliant' ? '#059669' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {getStatusIcon(selectedVerification.status)} {selectedVerification.status}
                      </PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>Spaces</PropertyLabel>
                      <PropertyValue>{selectedVerification.results?.length || 0}</PropertyValue>
                    </Property>
                  </PropertyGrid>
                </div>
                
                <PropertyGrid style={{ marginTop: '1rem' }}>
                  <Property>
                    <PropertyLabel>City</PropertyLabel>
                    <PropertyValue>{selectedVerification.city || 'Unknown'}</PropertyValue>
                  </Property>
                  <Property>
                    <PropertyLabel>Pincode</PropertyLabel>
                    <PropertyValue>{selectedVerification.pincode || 'Unknown'}</PropertyValue>
                  </Property>
                </PropertyGrid>
                
                <PDFPreviewContainer>
                  <PDFViewer src={selectedVerification.pdfUrl} title="PDF Preview" />
                </PDFPreviewContainer>
                
                <h4 style={{ margin: '1.5rem 0 1rem', color: '#1a2a6c' }}>Verification Results</h4>
                
                <ResultsGrid>
                  {selectedVerification.results.map((result, index) => (
                    <ResultCard key={index} status={result.status}>
                      <ResultHeader>
                        <ResultTitle>{result.space}</ResultTitle>
                        <ResultStatus status={result.status}>
                          {result.status === "Compliant" ? (
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
                          <MetricLabel>Area</MetricLabel>
                          <MetricValue>{result.area}</MetricValue>
                        </Metric>
                        <Metric>
                          <MetricLabel>Length</MetricLabel>
                          <MetricValue>{result.length}</MetricValue>
                        </Metric>
                        <Metric>
                          <MetricLabel>Width</MetricLabel>
                          <MetricValue>{result.width}</MetricValue>
                        </Metric>
                      </ResultMetrics>
                    </ResultCard>
                  ))}
                </ResultsGrid>
                
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <ActionButton 
                    className="secondary"
                    onClick={() => handleDownloadPDF(selectedVerification.pdfUrl, `${selectedVerification.title}.pdf`)}
                    style={{ marginRight: '1rem' }}
                  >
                    <FaDownload /> Download PDF
                  </ActionButton>
                  <ActionButton 
                    className="primary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </ActionButton>
                </div>
              </div>
            </ModalContent>
          </Modal>
        )}
      </PageContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default VerificationHistoryPage; 