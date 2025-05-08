import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCity, FaEye, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #1a2a6c;
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  margin-bottom: 2rem;
  
  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    font-size: 1rem;
  }
  
  button {
    background: #1a2a6c;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  background: #1a2a6c;
  color: white;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const CardFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1a2a6c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background: #0f1a4c;
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
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

const Property = styled.div`
  margin-bottom: 0.5rem;
  
  span:first-child {
    font-weight: 600;
    margin-right: 0.5rem;
  }
`;

const Message = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid #1a2a6c;
    border-color: #1a2a6c transparent #1a2a6c transparent;
    animation: spinner 1.2s linear infinite;
  }
  
  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BuildingPlanList = () => {
  const [buildingPlans, setBuildingPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBuildingPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('/api/building-plans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBuildingPlans(response.data.plans);
        setFilteredPlans(response.data.plans);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching building plans:', error);
        setError('Error fetching building plans. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchBuildingPlans();
  }, []);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlans(buildingPlans);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = buildingPlans.filter(plan => 
      plan.cityName.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredPlans(filtered);
  }, [searchTerm, buildingPlans]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending_validation': return 'Pending Validation';
      case 'requires_changes': return 'Requires Changes';
      default: return 'Draft';
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Title>
          <FaCity />
          Building Plans
        </Title>
        <LoadingSpinner />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Title>
          <FaCity />
          Building Plans
        </Title>
        <Message>{error}</Message>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>
        <FaCity />
        Building Plans
      </Title>
      
      <SearchBar>
        <input 
          type="text"
          placeholder="Search by city name..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button>
          <FaSearch />
        </button>
      </SearchBar>
      
      {filteredPlans.length === 0 ? (
        <Message>No building plans found. Create one to get started!</Message>
      ) : (
        <Grid>
          {filteredPlans.map(plan => (
            <Card key={plan._id}>
              <CardHeader>{plan.cityName}</CardHeader>
              <CardBody>
                <Property>
                  <span>Floors:</span>
                  <span>{plan.planData.floors}</span>
                </Property>
                <Property>
                  <span>Total Area:</span>
                  <span>{plan.planData.totalArea} sq ft</span>
                </Property>
                <Property>
                  <span>Rules Applied:</span>
                  <span>{plan.appliedRules.length}</span>
                </Property>
                <Property>
                  <span>Status:</span>
                  <Status status={plan.status}>{getStatusLabel(plan.status)}</Status>
                </Property>
              </CardBody>
              <CardFooter>
                <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                <Button to={`/building-plans/${plan._id}`}>
                  <FaEye /> View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      )}
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Button to="/building-plans/new" style={{ display: 'inline-flex' }}>
          <FaCity /> Create New Building Plan
        </Button>
      </div>
    </Container>
  );
};

export default BuildingPlanList; 