import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCity, 
  FaBuilding, 
  FaPlus, 
  FaEye, 
  FaTrash, 
  FaEdit, 
  FaSearch,
  FaLeaf,
  FaSolarPanel,
  FaWater,
  FaRecycle
} from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 3rem;
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
`;

const HeroContent = styled.div`
  h1 {
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  p {
    font-size: 1.1rem;
    margin: 0 0 1.5rem 0;
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const HeroImage = styled.div`
  img {
    width: 100%;
    height: auto;
    max-width: 400px;
    margin: 0 auto;
    display: block;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 2rem;
    color: #1a2a6c;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #1a2a6c;
  }

  p {
    margin: 0;
    color: #4b5563;
    line-height: 1.6;
  }
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #1a2a6c;
      box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
    }
  }
  
  button {
    background: #1a2a6c;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #0f1a4c;
    }
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.variant === 'primary' ? '#1a2a6c' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#1a2a6c'};
  border: 2px solid #1a2a6c;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: ${props => props.variant === 'primary' ? '#0f1a4c' : '#f8fafc'};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
  border: 1px solid #eee;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`;

const CardHeader = styled.div`
  background: #1a2a6c;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const CardFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const PropertyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Property = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: ${props => props.color || '#f3f4f6'};
  color: ${props => props.textColor || '#1a2a6c'};
  border: none;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: #f9fafb;
  border-radius: 8px;
  
  h3 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #1a2a6c;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 2rem;
  }
  
  svg {
    font-size: 3rem;
    color: #1a2a6c;
    opacity: 0.5;
  }
`;

const Badge = styled.span`
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

const BuildingPlanDashboard = () => {
  const [buildingPlans, setBuildingPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const fetchBuildingPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/building-plans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setBuildingPlans(response.data.plans || []);
      setFilteredPlans(response.data.plans || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch building plans:', error);
      setError(error.response?.data?.message || 'Failed to fetch building plans');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBuildingPlans();
  }, []);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlans(buildingPlans);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = buildingPlans.filter(plan => 
      plan.cityName.toLowerCase().includes(searchLower)
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
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };
  
  const deleteBuildingPlan = async (id) => {
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
      
      // Refresh the list
      fetchBuildingPlans();
    } catch (error) {
      console.error('Failed to delete building plan:', error);
      alert(error.response?.data?.message || 'Failed to delete building plan');
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      {loading && <LoadingOverlay />}
      
      <HeroSection>
        <HeroContent>
          <h1>Smart Building Plan Management</h1>
          <p>
            Transform your construction projects with our intelligent plan verification system.
            Ensure compliance, optimize efficiency, and build sustainable structures for the future.
          </p>
          <ActionButton to="/building-plans/new" variant="primary">
            <FaPlus /> Create New Plan
          </ActionButton>
        </HeroContent>
        <HeroImage>
          <img src="/assets/building-plan-hero.svg" alt="Building Plan Hero" />
        </HeroImage>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard>
          <FaLeaf />
          <h3>Sustainable Design</h3>
          <p>Implement eco-friendly features and green building practices to minimize environmental impact and maximize energy efficiency.</p>
        </FeatureCard>
        <FeatureCard>
          <FaSolarPanel />
          <h3>Smart Integration</h3>
          <p>Incorporate modern technologies and smart systems for improved building performance and occupant comfort.</p>
        </FeatureCard>
        <FeatureCard>
          <FaWater />
          <h3>Resource Optimization</h3>
          <p>Optimize water usage and energy consumption through innovative design solutions and efficient systems.</p>
        </FeatureCard>
        <FeatureCard>
          <FaRecycle />
          <h3>Circular Economy</h3>
          <p>Promote sustainable materials and waste reduction strategies aligned with circular economy principles.</p>
        </FeatureCard>
      </FeaturesGrid>

      <SearchContainer>
        <input 
          type="text" 
          placeholder="Search plans by city name or project type..." 
          value={searchTerm}
          onChange={handleSearch}
        />
        <button>
          <FaSearch /> Search Plans
        </button>
      </SearchContainer>
      
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      {!loading && buildingPlans.length === 0 ? (
        <EmptyState>
          <FaCity />
          <h3>No Building Plans Found</h3>
          <p>Get started by creating your first building plan</p>
          <ActionButton to="/building-plans/new" variant="primary">
            <FaPlus /> Create New Plan
          </ActionButton>
        </EmptyState>
      ) : (
        <Grid>
          {filteredPlans.map(plan => (
            <Card key={plan._id}>
              <CardHeader>
                <CardTitle>{plan.cityName}</CardTitle>
                <Badge status={plan.status}>{getStatusLabel(plan.status)}</Badge>
              </CardHeader>
              <CardBody>
                <PropertyList>
                  <Property>
                    <strong>Floors:</strong>
                    <span>{plan.planData.floors}</span>
                  </Property>
                  <Property>
                    <strong>Total Area:</strong>
                    <span>{plan.planData.totalArea} sq ft</span>
                  </Property>
                  <Property>
                    <strong>Rules Applied:</strong>
                    <span>{plan.appliedRules?.length || 0}</span>
                  </Property>
                  <Property>
                    <strong>Created:</strong>
                    <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                  </Property>
                </PropertyList>
              </CardBody>
              <CardFooter>
                <ButtonGroup>
                  <IconButton to={`/building-plans/${plan._id}`} color="#1a2a6c" textColor="white">
                    <FaEye />
                  </IconButton>
                  <IconButton to={`/building-plans/${plan._id}/edit`} color="#7c3aed" textColor="white">
                    <FaEdit />
                  </IconButton>
                  <IconButton 
                    as="button" 
                    color="#ef4444" 
                    textColor="white"
                    onClick={() => deleteBuildingPlan(plan._id)}
                  >
                    <FaTrash />
                  </IconButton>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
};

export default BuildingPlanDashboard; 