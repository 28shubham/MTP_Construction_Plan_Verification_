import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCity, FaHammer, FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.secondary ? '#f3f4f6' : '#1a2a6c'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.secondary ? '#e5e7eb' : '#0f1a4c'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const RuleItem = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  margin-bottom: 1rem;
`;

const RuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const RulesList = styled.div`
  margin-top: 1rem;
`;

const Message = styled.div`
  padding: 1rem;
  background: ${props => props.type === 'success' ? '#f0fdf4' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#166534' : '#b91c1c'};
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const BuildingPlanForm = () => {
  const [formData, setFormData] = useState({
    cityName: '',
    buildingPlan: {
      floors: 1,
      totalArea: 0,
      rooms: []
    }
  });
  
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    category: 'General',
    type: 'numeric',
    validationParams: {}
  });
  
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('buildingPlan.')) {
      const planField = name.split('.')[1];
      setFormData({
        ...formData,
        buildingPlan: {
          ...formData.buildingPlan,
          [planField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleRuleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('validationParams.')) {
      const paramField = name.split('.')[1];
      setNewRule({
        ...newRule,
        validationParams: {
          ...newRule.validationParams,
          [paramField]: value
        }
      });
    } else {
      setNewRule({
        ...newRule,
        [name]: value
      });
    }
  };
  
  const addRule = () => {
    if (!newRule.name) {
      setMessage({ type: 'error', text: 'Rule name is required' });
      return;
    }
    
    setRules([...rules, { ...newRule }]);
    setNewRule({
      name: '',
      description: '',
      category: 'General',
      type: 'numeric',
      validationParams: {}
    });
  };
  
  const removeRule = (index) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        '/api/building-plans',
        {
          cityName: formData.cityName,
          buildingPlan: formData.buildingPlan,
          appliedRules: rules
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMessage({ type: 'success', text: 'Building plan saved successfully!' });
      
      // Clear form after successful submission
      setFormData({
        cityName: '',
        buildingPlan: {
          floors: 1,
          totalArea: 0,
          rooms: []
        }
      });
      setRules([]);
      
    } catch (error) {
      console.error('Error saving building plan:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error saving building plan' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Title>
        <FaCity />
        Building Plan Submission
      </Title>
      
      {message && (
        <Message type={message.type}>{message.text}</Message>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>City Name</Label>
          <Input 
            type="text" 
            name="cityName"
            value={formData.cityName}
            onChange={handleInputChange}
            placeholder="Enter city name"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Number of Floors</Label>
          <Input 
            type="number" 
            name="buildingPlan.floors"
            value={formData.buildingPlan.floors}
            onChange={handleInputChange}
            min="1"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Total Area (sq ft)</Label>
          <Input 
            type="number" 
            name="buildingPlan.totalArea"
            value={formData.buildingPlan.totalArea}
            onChange={handleInputChange}
            min="0"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Building Plan Details (JSON)</Label>
          <TextArea 
            name="buildingPlan.details"
            value={JSON.stringify(formData.buildingPlan, null, 2)}
            onChange={(e) => {
              try {
                const parsedValue = JSON.parse(e.target.value);
                setFormData({
                  ...formData,
                  buildingPlan: parsedValue
                });
              } catch (error) {
                // If invalid JSON, don't update state
              }
            }}
            placeholder="Enter building plan details in JSON format"
          />
        </FormGroup>
        
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
            <FaHammer /> Construction Rules
          </h2>
          
          <RuleItem>
            <RuleHeader>
              <h3>Add New Rule</h3>
            </RuleHeader>
            
            <FormGroup>
              <Label>Rule Name</Label>
              <Input 
                type="text" 
                name="name"
                value={newRule.name}
                onChange={handleRuleChange}
                placeholder="Enter rule name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea 
                name="description"
                value={newRule.description}
                onChange={handleRuleChange}
                placeholder="Enter rule description"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Category</Label>
              <Select 
                name="category"
                value={newRule.category}
                onChange={handleRuleChange}
              >
                <option value="General">General</option>
                <option value="Room Size">Room Size</option>
                <option value="Safety">Safety</option>
                <option value="Structural">Structural</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Rule Type</Label>
              <Select 
                name="type"
                value={newRule.type}
                onChange={handleRuleChange}
              >
                <option value="numeric">Numeric</option>
                <option value="spatial">Spatial</option>
                <option value="boolean">Boolean</option>
                <option value="custom">Custom</option>
              </Select>
            </FormGroup>
            
            {newRule.type === 'numeric' && (
              <>
                <FormGroup>
                  <Label>Minimum Value</Label>
                  <Input 
                    type="number" 
                    name="validationParams.minValue"
                    value={newRule.validationParams.minValue || ''}
                    onChange={handleRuleChange}
                    placeholder="Minimum value"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Maximum Value</Label>
                  <Input 
                    type="number" 
                    name="validationParams.maxValue"
                    value={newRule.validationParams.maxValue || ''}
                    onChange={handleRuleChange}
                    placeholder="Maximum value"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Unit</Label>
                  <Input 
                    type="text" 
                    name="validationParams.unit"
                    value={newRule.validationParams.unit || ''}
                    onChange={handleRuleChange}
                    placeholder="Unit (e.g., sqft, meters)"
                  />
                </FormGroup>
              </>
            )}
            
            <ButtonGroup>
              <Button type="button" onClick={addRule} secondary>
                <FaPlus /> Add Rule
              </Button>
            </ButtonGroup>
          </RuleItem>
          
          <RulesList>
            <h3>Applied Rules</h3>
            {rules.length === 0 ? (
              <p>No rules added yet</p>
            ) : (
              rules.map((rule, index) => (
                <RuleItem key={index}>
                  <RuleHeader>
                    <h3>{rule.name}</h3>
                    <DeleteButton type="button" onClick={() => removeRule(index)}>
                      <FaTimes />
                    </DeleteButton>
                  </RuleHeader>
                  <p>{rule.description}</p>
                  <div>
                    <strong>Category:</strong> {rule.category}
                  </div>
                  <div>
                    <strong>Type:</strong> {rule.type}
                  </div>
                </RuleItem>
              ))
            )}
          </RulesList>
        </div>
        
        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : 'Save Building Plan'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default BuildingPlanForm; 