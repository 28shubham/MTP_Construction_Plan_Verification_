import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaHourglass, FaEye, FaDownload, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import AdminDashboardLayout from '../components/AdminDashboardLayout';
import { handleSuccess, handleError } from '../utils';
import axios from 'axios';
import { analyzeVerification } from '../services/aiService';

// Styled components for the verification page
const PageContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${props => props.background || '#fff'};
  color: ${props => props.color || '#333'};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  font-size: 28px;
  margin-right: 16px;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: space-between;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border-radius: 6px;
  border: 1px solid #dce1e8;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #798796;
  font-size: 16px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #dce1e8;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #f5f7fa;
  }
`;

const VerificationTableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #212529;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  background: ${props => 
    props.status === 'approved' ? '#e6f7ee' :
    props.status === 'rejected' ? '#fbe9e7' : '#fff8e1'};
  color: ${props => 
    props.status === 'approved' ? '#00a36a' :
    props.status === 'rejected' ? '#d32f2f' : '#ff9800'};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  padding: 6px;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(74, 144, 226, 0.1);
  }

  &.delete {
    color: #d32f2f;
    &:hover {
      background-color: rgba(211, 47, 47, 0.1);
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 6px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  gap: 8px;
`;

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? '#4a90e2' : '#dce1e8'};
  background: ${props => props.active ? '#4a90e2' : 'white'};
  color: ${props => props.active ? 'white' : '#495057'};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#4a90e2' : '#f5f7fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #343a40;
  }
`;

const ModalBody = styled.div``;

const ButtonsContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #4a90e2;
    color: white;
    border: none;
    
    &:hover {
      background: #3a7bc8;
    }
  }
  
  &.secondary {
    background: white;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #f8f9fa;
    }
  }

  &.danger {
    background: #d32f2f;
    color: white;
    border: none;
    
    &:hover {
      background: #b71c1c;
    }
  }

  &.success {
    background: #00a36a;
    color: white;
    border: none;
    
    &:hover {
      background: #008c5c;
    }
  }
`;

const AdminVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for demonstration purposes
  useEffect(() => {
    // In a real application, this would be an API call
    const fetchVerifications = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockData = [
          {
            id: 1,
            applicantName: "John Doe",
            projectTitle: "Residential Villa",
            submissionDate: "2023-07-15T10:30:00",
            status: "pending",
            type: "Residential",
            location: "123 Main St, Anytown",
            documentUrl: "#"
          },
          {
            id: 2,
            applicantName: "Jane Smith",
            projectTitle: "Commercial Building",
            submissionDate: "2023-07-10T14:45:00",
            status: "approved",
            type: "Commercial",
            location: "456 Business Ave, Commerce City",
            documentUrl: "#"
          },
          {
            id: 3,
            applicantName: "Robert Johnson",
            projectTitle: "Studio Apartment Complex",
            submissionDate: "2023-07-05T09:15:00",
            status: "rejected",
            type: "Residential",
            location: "789 Urban St, Downtown",
            documentUrl: "#"
          },
          {
            id: 4,
            applicantName: "Emily Brown",
            projectTitle: "Farm House Renovation",
            submissionDate: "2023-07-01T11:00:00",
            status: "approved",
            type: "Farm House",
            location: "321 Rural Rd, Countryside",
            documentUrl: "#"
          },
          {
            id: 5,
            applicantName: "Michael Wilson",
            projectTitle: "Group Housing Project",
            submissionDate: "2023-06-28T16:20:00",
            status: "pending",
            type: "Group Housing",
            location: "555 Community Ln, Suburban Heights",
            documentUrl: "#"
          },
          {
            id: 6,
            applicantName: "Sarah Garcia",
            projectTitle: "Residential Independent House",
            submissionDate: "2023-06-25T13:10:00",
            status: "pending",
            type: "Residential Independent",
            location: "777 Liberty Ave, New Town",
            documentUrl: "#"
          },
          {
            id: 7,
            applicantName: "David Martinez",
            projectTitle: "Studio Apartment Building",
            submissionDate: "2023-06-20T10:45:00",
            status: "approved",
            type: "Studio Apartment",
            location: "888 Artist Way, Creative District",
            documentUrl: "#"
          },
          {
            id: 8,
            applicantName: "Lisa Anderson",
            projectTitle: "Luxury Villa",
            submissionDate: "2023-06-15T09:30:00",
            status: "rejected",
            type: "Residential",
            location: "999 Elite Blvd, Prestige Heights",
            documentUrl: "#"
          },
          {
            id: 9,
            applicantName: "Thomas Taylor",
            projectTitle: "Farmhouse with Pool",
            submissionDate: "2023-06-10T14:00:00",
            status: "pending",
            type: "Farm House",
            location: "444 Countryside Rd, Rural County",
            documentUrl: "#"
          },
          {
            id: 10,
            applicantName: "Jennifer White",
            projectTitle: "Group Housing Complex",
            submissionDate: "2023-06-05T11:30:00",
            status: "approved",
            type: "Group Housing",
            location: "222 Community Circle, Neighborhoodville",
            documentUrl: "#"
          },
          {
            id: 11,
            applicantName: "Daniel Harris",
            projectTitle: "Eco-friendly Residence",
            submissionDate: "2023-06-01T15:45:00",
            status: "pending",
            type: "Residential",
            location: "333 Green St, Eco Park",
            documentUrl: "#"
          },
          {
            id: 12,
            applicantName: "Patricia Clark",
            projectTitle: "Studio Apartment Renovation",
            submissionDate: "2023-05-28T10:15:00",
            status: "rejected",
            type: "Studio Apartment",
            location: "111 Loft Ave, Arts District",
            documentUrl: "#"
          }
        ];
        
        setVerifications(mockData);
        
        // Calculate stats
        const pending = mockData.filter(v => v.status === 'pending').length;
        const approved = mockData.filter(v => v.status === 'approved').length;
        const rejected = mockData.filter(v => v.status === 'rejected').length;
        
        setStats({
          pending,
          approved,
          rejected,
          total: mockData.length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching verifications:', error);
        handleError('Failed to load verification data');
        setLoading(false);
      }
    };

    fetchVerifications();
  }, []);

  // Filter verifications based on search term
  const filteredVerifications = verifications.filter(verification => 
    verification.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVerifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVerifications.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const viewVerification = (verification) => {
    setSelectedVerification(verification);
    setAiAnalysis(null);
    setShowViewModal(true);
  };

  const handleApprove = (id) => {
    // In a real app, this would be an API call
    const updatedVerifications = verifications.map(verification => 
      verification.id === id ? { ...verification, status: 'approved' } : verification
    );
    
    setVerifications(updatedVerifications);
    
    if (selectedVerification?.id === id) {
      setSelectedVerification({ ...selectedVerification, status: 'approved' });
    }
    
    // Update stats
    setStats({
      ...stats,
      pending: stats.pending - 1,
      approved: stats.approved + 1
    });
    
    handleSuccess('Verification approved successfully');
  };

  const handleReject = (id) => {
    // In a real app, this would be an API call
    const updatedVerifications = verifications.map(verification => 
      verification.id === id ? { ...verification, status: 'rejected' } : verification
    );
    
    setVerifications(updatedVerifications);
    
    if (selectedVerification?.id === id) {
      setSelectedVerification({ ...selectedVerification, status: 'rejected' });
    }
    
    // Update stats
    setStats({
      ...stats,
      pending: stats.pending - 1,
      rejected: stats.rejected + 1
    });
    
    handleSuccess('Verification rejected');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const performAiAnalysis = async (verification) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeVerification(verification);
      if (result.success) {
        setAiAnalysis(result.text);
      } else {
        handleError('AI analysis failed, please try again');
      }
    } catch (error) {
      console.error('Error during AI analysis:', error);
      handleError('Failed to complete AI analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Verification Management</PageTitle>
        </PageHeader>

        <StatsContainer>
          <StatCard background="#f0f9ff" color="#0c63e4">
            <StatIcon>
              <FaHourglass />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.pending}</StatValue>
              <StatLabel>Pending Verifications</StatLabel>
            </StatContent>
          </StatCard>
          
          <StatCard background="#e6f7ee" color="#00a36a">
            <StatIcon>
              <FaCheckCircle />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.approved}</StatValue>
              <StatLabel>Approved Plans</StatLabel>
            </StatContent>
          </StatCard>
          
          <StatCard background="#fbe9e7" color="#d32f2f">
            <StatIcon>
              <FaTimesCircle />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.rejected}</StatValue>
              <StatLabel>Rejected Plans</StatLabel>
            </StatContent>
          </StatCard>
          
          <StatCard background="#f5f5f5" color="#495057">
            <StatIcon>
              <FaEye />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Total Submissions</StatLabel>
            </StatContent>
          </StatCard>
        </StatsContainer>

        <ToolbarContainer>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search by name, project, type or location..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchContainer>
          
          <FilterButton>
            <FaFilter />
            Filter
          </FilterButton>
        </ToolbarContainer>

        <VerificationTableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Applicant</TableHeaderCell>
                <TableHeaderCell>Project</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Submission Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <tbody>
              {currentItems.map(verification => (
                <TableRow key={verification.id}>
                  <TableCell>{verification.applicantName}</TableCell>
                  <TableCell>{verification.projectTitle}</TableCell>
                  <TableCell>{verification.type}</TableCell>
                  <TableCell>{formatDate(verification.submissionDate)}</TableCell>
                  <TableCell>
                    <Status status={verification.status}>
                      {verification.status === 'approved' && <FaCheckCircle style={{ marginRight: '6px' }} />}
                      {verification.status === 'rejected' && <FaTimesCircle style={{ marginRight: '6px' }} />}
                      {verification.status === 'pending' && <FaHourglass style={{ marginRight: '6px' }} />}
                      {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                    </Status>
                  </TableCell>
                  <TableCell>
                    <ActionContainer>
                      <ActionButton title="View Details" onClick={() => viewVerification(verification)}>
                        <FaEye />
                      </ActionButton>
                      <ActionButton title="Download Document">
                        <FaDownload />
                      </ActionButton>
                      {verification.status === 'pending' && (
                        <>
                          <ActionButton 
                            title="Approve" 
                            onClick={() => handleApprove(verification.id)}
                            style={{ color: '#00a36a' }}
                          >
                            <FaCheckCircle />
                          </ActionButton>
                          <ActionButton 
                            title="Reject" 
                            onClick={() => handleReject(verification.id)}
                            className="delete"
                          >
                            <FaTimesCircle />
                          </ActionButton>
                        </>
                      )}
                    </ActionContainer>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PageButton 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </PageButton>
            
            {[...Array(totalPages).keys()].map(number => (
              <PageButton
                key={number + 1}
                active={currentPage === number + 1}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </PageButton>
            ))}
            
            <PageButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </PageButton>
          </Pagination>
        </VerificationTableContainer>
      </PageContainer>

      {showViewModal && selectedVerification && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Verification Details</ModalTitle>
              <CloseButton onClick={() => setShowViewModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', margin: '0 0 10px' }}>Project Information</h3>
                  <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Project Title</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedVerification.projectTitle}</div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Type</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedVerification.type}</div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Location</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedVerification.location}</div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Status</div>
                      <Status status={selectedVerification.status} style={{ fontSize: '12px' }}>
                        {selectedVerification.status === 'approved' && <FaCheckCircle style={{ marginRight: '6px' }} />}
                        {selectedVerification.status === 'rejected' && <FaTimesCircle style={{ marginRight: '6px' }} />}
                        {selectedVerification.status === 'pending' && <FaHourglass style={{ marginRight: '6px' }} />}
                        {selectedVerification.status.charAt(0).toUpperCase() + selectedVerification.status.slice(1)}
                      </Status>
                    </div>
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', margin: '0 0 10px' }}>Applicant Information</h3>
                  <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Applicant Name</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedVerification.applicantName}</div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Submission Date</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{formatDate(selectedVerification.submissionDate)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 style={{ fontSize: '16px', margin: '20px 0 10px' }}>Document Preview</h3>
              <div style={{ border: '1px solid #e9ecef', borderRadius: '6px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <iframe 
                  src={selectedVerification.documentUrl} 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Document Preview"
                />
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', margin: '0 0 10px' }}>AI Analysis</h3>
                  {!aiAnalysis && !isAnalyzing && (
                    <Button 
                      className="primary" 
                      onClick={() => performAiAnalysis(selectedVerification)}
                      style={{ margin: '0' }}
                    >
                      Analyze with Gemini AI
                    </Button>
                  )}
                </div>
                
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '6px',
                  minHeight: '100px'
                }}>
                  {isAnalyzing ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div className="loading-spinner" style={{ 
                          border: '4px solid #f3f3f3',
                          borderTop: '4px solid #3498db',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          animation: 'spin 2s linear infinite',
                          margin: '0 auto 10px'
                        }}></div>
                        <p style={{ color: '#6c757d' }}>Analyzing verification data with Gemini AI...</p>
                      </div>
                    </div>
                  ) : aiAnalysis ? (
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{aiAnalysis}</div>
                  ) : (
                    <p style={{ color: '#6c757d', textAlign: 'center' }}>
                      Click "Analyze with Gemini AI" to get an AI-powered analysis of this verification
                    </p>
                  )}
                </div>
              </div>
              
              <ButtonsContainer>
                {selectedVerification.status === 'pending' && (
                  <>
                    <Button 
                      className="success"
                      onClick={() => {
                        handleApprove(selectedVerification.id);
                        setShowViewModal(false);
                      }}
                    >
                      Approve Verification
                    </Button>
                    <Button 
                      className="danger"
                      onClick={() => {
                        handleReject(selectedVerification.id);
                        setShowViewModal(false);
                      }}
                    >
                      Reject Verification
                    </Button>
                  </>
                )}
                <Button className="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
              </ButtonsContainer>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminVerifications; 