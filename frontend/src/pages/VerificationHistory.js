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
  FaBuilding,
  FaMapMarkerAlt,
  FaRuler
} from "react-icons/fa";

// Styled Components
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 80px auto 0;
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Poppins', sans-serif;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h2`
  color: #1a2a6c;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 1rem;
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.5;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 350px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 4px rgba(26, 42, 108, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1.2rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    color: #64748b;
    font-size: 1.1rem;
  }
`;

const VerificationCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const VerificationCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
  color: white;
  padding: 1.5rem;
  position: relative;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.2rem;
  }
`;

const CardDate = styled.div`
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  opacity: 0.9;
  
  svg {
    margin-right: 0.5rem;
    font-size: 0.9rem;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: ${props => props.status === 'Compliant' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.status === 'Compliant' ? '#059669' : '#dc2626'};
  font-size: 0.875rem;
  font-weight: 600;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Property = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PropertyLabel = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1rem;
  }
`;

const PropertyValue = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

const CardActions = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: #1a2a6c;
    color: white;
    
    &:hover {
      background: #151f4d;
    }
  ` : `
    background: #f1f5f9;
    color: #475569;
    
    &:hover {
      background: #e2e8f0;
  }
  `}

  svg {
    font-size: 1.1rem;
  }
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 1.1rem;
`;

const VerificationHistoryPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchVerifications();
  }, []);
  
  const fetchVerifications = async () => {
    try {
      const response = await axios.get("/api/verifications");
      setVerifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("Failed to load verifications");
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewDetails = (verification) => {
    // Implement view details functionality
    console.log("View details:", verification);
  };
  
  const handleDownloadPDF = (url, filename) => {
    // Implement PDF download functionality
    console.log("Download PDF:", url, filename);
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusIcon = (status) => {
    return status === 'Compliant' ? 
      <FaCheckCircle /> : 
      <FaTimesCircle />;
  };

  const filteredVerifications = verifications.filter(verification =>
    verification.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <PageTitle>
              <FaHistory />
              Verification History
            </PageTitle>
            <PageSubtitle>
              Track and manage all your construction plan verifications
            </PageSubtitle>
          </HeaderLeft>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search by project name or location..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchContainer>
        </PageHeader>
        
        <Toolbar>
          <FilterContainer>
            <FilterButton>
              <FaFilter />
              Filter
            </FilterButton>
            <FilterButton>
              <FaSort />
              Sort By
            </FilterButton>
          </FilterContainer>
        </Toolbar>
        
        {loading ? (
          <NoResultsMessage>Loading verifications...</NoResultsMessage>
        ) : filteredVerifications.length === 0 ? (
          <NoResultsMessage>No verifications found</NoResultsMessage>
        ) : (
          <VerificationCardsContainer>
            {filteredVerifications.map((verification) => (
              <VerificationCard key={verification._id}>
                <CardHeader>
                  <CardTitle>
                    <FaBuilding />
                    {verification.projectName}
                  </CardTitle>
                  <CardDate>
                    <FaCalendarAlt />
                    {formatDate(verification.submissionDate)}
                  </CardDate>
                  <StatusBadge status={verification.status}>
                    {getStatusIcon(verification.status)}
                    {verification.status}
                  </StatusBadge>
                </CardHeader>
                <CardBody>
                  <PropertyGrid>
                    <Property>
                      <PropertyLabel>
                        <FaMapMarkerAlt />
                        Location
                      </PropertyLabel>
                      <PropertyValue>{verification.location}</PropertyValue>
                    </Property>
                    <Property>
                      <PropertyLabel>
                        <FaRuler />
                        Plot Size
                      </PropertyLabel>
                      <PropertyValue>{verification.plotSize} sq.m</PropertyValue>
                    </Property>
                  </PropertyGrid>
                  <CardActions>
                  <ActionButton 
                      primary
                      onClick={() => handleViewDetails(verification)}
                  >
                      <FaEye />
                      View Details
                  </ActionButton>
                  <ActionButton 
                      onClick={() => handleDownloadPDF(verification.pdfUrl, verification.projectName)}
                  >
                      <FaDownload />
                      Download
                  </ActionButton>
                  </CardActions>
                </CardBody>
              </VerificationCard>
            ))}
          </VerificationCardsContainer>
        )}
        <ToastContainer position="bottom-right" />
      </PageContainer>
    </>
  );
};

export default VerificationHistoryPage; 