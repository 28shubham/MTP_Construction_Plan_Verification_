import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaArrowLeft, FaBuilding, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1a2a6c;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1a2a6c;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  background: #1a2a6c;
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.variant === 'danger' ? '#ef4444' : props.variant === 'secondary' ? '#6b7280' : '#1a2a6c'};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const LinkButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.variant === 'danger' ? '#ef4444' : props.variant === 'secondary' ? '#6b7280' : '#1a2a6c'};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InfoColumn = styled.div`
  flex: 1;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  p {
    margin: 0;
    font-size: 1rem;
    color: #1f2937;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'approved': return '#d1fae5';
      case 'rejected': return '#fee2e2';
      case 'pending_validation': return '#fef3c7';
      default: return '#e5e7eb';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'approved': return '#065f46';
      case 'rejected': return '#b91c1c';
      case 'pending_validation': return '#92400e';
      default: return '#374151';
    }
  }};
`;

const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const RuleCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  background: #f9fafb;
  
  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.125rem;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    margin: 0 0 1rem 0;
    color: #4b5563;
    font-size: 0.875rem;
  }
`;

const RuleProperty = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-top: 1px dashed #e5e7eb;
  font-size: 0.875rem;
  
  strong {
    color: #6b7280;
  }
  
  span {
    color: #1f2937;
  }
`;

const JsonViewer = styled.pre`
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  overflow: auto;
  font-size: 0.875rem;
  color: #1f2937;
  max-height: 300px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  &::after {
    content: "";
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 6px solid #1a2a6c;
    border-color: #1a2a6c transparent #1a2a6c transparent;
    animation: spin 1.2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 1.5rem;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const BuildingPlanDetail = () => {
  const { id } = useParams();
  const [buildingPlan, setBuildingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBuildingPlan = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/building-plans/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBuildingPlan(response.data.buildingPlan);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch building plan:', error);
        setError(error.response?.data?.message || 'Failed to fetch building plan details');
        setLoading(false);
      }
    };
    
    fetchBuildingPlan();
  }, [id]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this building plan?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/building-plans/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      navigate('/building-plans');
    } catch (error) {
      console.error('Failed to delete building plan:', error);
      setError(error.response?.data?.message || 'Failed to delete building plan');
      setLoading(false);
    }
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending_validation': return 'Pending Validation';
      case 'requires_changes': return 'Requires Changes';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };
  
  const statusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <FaCheckCircle color="#065f46" />;
      case 'rejected':
        return <FaTimesCircle color="#b91c1c" />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return <LoadingOverlay />;
  }
  
  if (error) {
    return (
      <Container>
        <BackLink to="/building-plans">
          <FaArrowLeft /> Back to Building Plans
        </BackLink>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }
  
  if (!buildingPlan) {
    return (
      <Container>
        <BackLink to="/building-plans">
          <FaArrowLeft /> Back to Building Plans
        </BackLink>
        <ErrorMessage>Building plan not found</ErrorMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <BackLink to="/building-plans">
          <FaArrowLeft /> Back to Building Plans
        </BackLink>
        
        <ActionButtons>
          <LinkButton to={`/building-plans/${id}/edit`} variant="secondary">
            <FaEdit /> Edit Plan
          </LinkButton>
          <Button variant="danger" onClick={handleDelete}>
            <FaTrash /> Delete Plan
          </Button>
        </ActionButtons>
      </Header>
      
      <Card>
        <CardHeader>
          <Title>
            <FaBuilding /> {buildingPlan.cityName} Building Plan
          </Title>
          <Badge status={buildingPlan.status}>
            {statusIcon(buildingPlan.status)} {getStatusLabel(buildingPlan.status)}
          </Badge>
        </CardHeader>
        
        <CardBody>
          <InfoRow>
            <InfoColumn>
              <InfoItem>
                <h3>City</h3>
                <p>{buildingPlan.cityName}</p>
              </InfoItem>
              
              <InfoItem>
                <h3>Floors</h3>
                <p>{buildingPlan.planData.floors}</p>
              </InfoItem>
              
              <InfoItem>
                <h3>Total Area</h3>
                <p>{buildingPlan.planData.totalArea} sq ft</p>
              </InfoItem>
            </InfoColumn>
            
            <InfoColumn>
              <InfoItem>
                <h3>Created On</h3>
                <p>{new Date(buildingPlan.createdAt).toLocaleDateString()}</p>
              </InfoItem>
              
              <InfoItem>
                <h3>Last Updated</h3>
                <p>{new Date(buildingPlan.updatedAt).toLocaleDateString()}</p>
              </InfoItem>
              
              <InfoItem>
                <h3>Rules Applied</h3>
                <p>{buildingPlan.appliedRules?.length || 0} rules</p>
              </InfoItem>
            </InfoColumn>
          </InfoRow>
          
          <InfoItem>
            <h3>Building Plan Data</h3>
            <JsonViewer>{JSON.stringify(buildingPlan.planData, null, 2)}</JsonViewer>
          </InfoItem>
          
          <InfoItem>
            <h3>Applied Construction Rules</h3>
            {buildingPlan.appliedRules?.length > 0 ? (
              <RulesGrid>
                {buildingPlan.appliedRules.map(rule => (
                  <RuleCard key={rule._id}>
                    <h3>{rule.name}</h3>
                    <p>{rule.description || 'No description provided'}</p>
                    
                    <RuleProperty>
                      <strong>Category</strong>
                      <span>{rule.category}</span>
                    </RuleProperty>
                    
                    <RuleProperty>
                      <strong>Type</strong>
                      <span>{rule.type}</span>
                    </RuleProperty>
                    
                    <RuleProperty>
                      <strong>Severity</strong>
                      <span>{rule.severity}</span>
                    </RuleProperty>
                    
                    {rule.validationParams && Object.keys(rule.validationParams).length > 0 && (
                      <RuleProperty>
                        <strong>Parameters</strong>
                        <span>{Object.keys(rule.validationParams).length} parameters</span>
                      </RuleProperty>
                    )}
                  </RuleCard>
                ))}
              </RulesGrid>
            ) : (
              <p>No rules applied to this building plan</p>
            )}
          </InfoItem>
          
          {buildingPlan.validationResults && (
            <InfoItem>
              <h3>Validation Results</h3>
              <JsonViewer>{JSON.stringify(buildingPlan.validationResults, null, 2)}</JsonViewer>
            </InfoItem>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default BuildingPlanDetail; 