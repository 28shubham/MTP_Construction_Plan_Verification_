import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHammer, FaPlus, FaEdit, FaTrash, FaSearch, FaPlusCircle, FaMinusCircle, FaSave, FaTimes, FaCalendarAlt, FaChevronDown, FaChevronUp, FaArrowLeft, FaArrowRight, FaRobot } from 'react-icons/fa';
import { 
  getAllRules, 
  getRulesByCity, 
  getRulesByPincode, 
  createRule, 
  updateRule, 
  deleteRule 
} from '../services/simpleBuildingRuleService';
import { getAdminInfo, isAdminAuthenticated, getAuthHeader } from '../services/adminService';
import AdminDashboardLayout from '../components/AdminDashboardLayout';
import { generateRuleRecommendations } from '../services/aiService';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #1a2a6c;
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  
  svg {
    color: #1a2a6c;
    font-size: 2rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100px;
    height: 4px;
    background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
    border-radius: 2px;
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #e5e7eb;
    z-index: -1;
  }
`;

const Tab = styled.button`
  padding: 0.85rem 1.75rem;
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#1a2a6c' : 'transparent'};
  color: ${props => props.active ? '#1a2a6c' : '#6b7280'};
  font-weight: ${props => props.active ? '700' : '500'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 6px -4px rgba(0,0,0,0.1)' : 'none'};
  border-radius: 4px 4px 0 0;
  
  &:hover {
    color: #1a2a6c;
    background: ${props => props.active ? 'white' : '#f9fafb'};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  flex: 1;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const Select = styled.select`
  padding: 0.85rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a2a6c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.secondary ? 'white' : '#1a2a6c'};
  background-image: ${props => props.secondary ? 'none' : 'linear-gradient(135deg, #1a2a6c 0%, #2a3a7c 100%)'};
  color: ${props => props.secondary ? '#1a2a6c' : 'white'};
  border: 1px solid ${props => props.secondary ? '#1a2a6c' : 'transparent'};
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.secondary ? 'none' : '0 4px 6px rgba(0,0,0,0.12)'};
  
  &:hover {
    background-color: ${props => props.secondary ? '#f3f4f6' : '#111e4a'};
    background-image: ${props => props.secondary ? 'none' : 'linear-gradient(135deg, #111e4a 0%, #1a2a6c 100%)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary ? 'none' : '0 6px 10px rgba(0,0,0,0.15)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: none;
  }
  
  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
    padding: 0.6rem 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
    
    button, a {
      width: 100%;
      justify-content: center;
    }
  }
`;

const RuleCard = styled.div`
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    transform: translateY(-4px);
  }
`;

const RuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const RuleTitle = styled.h2`
  font-size: 1.15rem;
  color: #1a2a6c;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const RuleInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 1.5rem;
  background: white;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  
  span:first-child {
    font-weight: 600;
    color: #4b5563;
  }
  
  span:last-child {
    color: #111827;
    font-weight: 500;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${props => {
    if (props.status === 'active') return '#dcfce7';
    if (props.status === 'inactive') return '#fee2e2';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.status === 'active') return '#166534';
    if (props.status === 'inactive') return '#b91c1c';
    return '#374151';
  }};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid ${props => {
    if (props.status === 'active') return '#86efac';
    if (props.status === 'inactive') return '#fecaca';
    return '#e5e7eb';
  }};
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => {
      if (props.status === 'active') return '#166534';
      if (props.status === 'inactive') return '#b91c1c';
      return '#374151';
    }};
  }
`;

const RulesList = styled.div`
  padding: 0 1.5rem 1.5rem;
  
  h3 {
    margin: 0 0 1rem 0;
    color: #4b5563;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  
  @media (max-width: 768px) {
    padding: 0 1rem 1rem;
  }
`;

const RuleItem = styled.div`
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #fcfcfd;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  
  &:hover {
    background: #f9fafb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transform: translateY(-1px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h3 {
    margin: 0 0 0.75rem 0;
    color: #1a2a6c;
    font-size: 0.95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #1a2a6c;
      border-radius: 50%;
      margin-right: 0.6rem;
    }
  }
  
  p {
    color: #4b5563;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2.5rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const FormTitle = styled.h2`
  font-size: 1.35rem;
  margin-bottom: 1.75rem;
  color: #1a2a6c;
  position: relative;
  font-weight: 700;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
    border-radius: 2px;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || 1};
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.95rem;
`;

const Message = styled.div`
  padding: 1.25rem;
  background: ${props => props.type === 'success' ? '#f0fdf4' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#166534' : '#b91c1c'};
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid ${props => props.type === 'success' ? '#22c55e' : '#ef4444'};
  display: flex;
  align-items: center;
  
  &::before {
    content: ${props => props.type === 'success' ? '"✓"' : '"✕"'};
    font-size: 1.1rem;
    font-weight: bold;
    margin-right: 0.75rem;
    display: inline-block;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    border-radius: 50%;
    background: ${props => props.type === 'success' ? '#dcfce7' : '#fee2e2'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
  
  svg {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    color: #d1d5db;
    opacity: 0.7;
  }
  
  h3 {
    margin-bottom: 0.75rem;
    color: #374151;
    font-size: 1.5rem;
  }
  
  p {
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

const RuleGroup = styled.div`
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  position: relative;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.08);
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #fee2e2;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b91c1c;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fecaca;
    transform: scale(1.1);
  }
`;

const EditModeHeader = styled.div`
  background: linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #1a2a6c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #1a2a6c;
  }
  
  p {
    margin: 0;
    color: #4b5563;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const DateInput = styled.input`
  padding: 0.85rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
  
  &::-webkit-calendar-picker-indicator {
    color: #6b7280;
    opacity: 0.6;
    cursor: pointer;
  }
  
  &::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
`;

const DateInputGroup = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    pointer-events: none;
  }
`;

const CollapseToggle = styled.button`
  background: none;
  border: none;
  color: #1a2a6c;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  padding: 0.4rem;
  margin-left: auto;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  svg {
    font-size: 0.75rem;
  }
  
  &:hover {
    background: rgba(26, 42, 108, 0.05);
  }
`;

const NavigationBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #1a2a6c;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  margin-right: 1rem;
  
  &:hover {
    background: #f9fafb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Add a styled component for the scrollable rules container
const ScrollableRulesContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
  margin-top: 1.5rem;
  
  /* Animation for card appearance */
  & > div {
    animation: fadeInUp 0.4s ease forwards;
    opacity: 0;
    transform: translateY(10px);
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Apply a staggered delay to each card */
  & > div:nth-child(1) { animation-delay: 0.05s; }
  & > div:nth-child(2) { animation-delay: 0.1s; }
  & > div:nth-child(3) { animation-delay: 0.15s; }
  & > div:nth-child(4) { animation-delay: 0.2s; }
  & > div:nth-child(5) { animation-delay: 0.25s; }
  & > div:nth-child(6) { animation-delay: 0.3s; }
  & > div:nth-child(7) { animation-delay: 0.35s; }
  & > div:nth-child(8) { animation-delay: 0.4s; }
  & > div:nth-child(9) { animation-delay: 0.45s; }
  & > div:nth-child(10) { animation-delay: 0.5s; }
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1a2a6c;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #b21f1f;
  }
`;

// Add a fixed position container for the search
const StickySearchContainer = styled.div`
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
`;

const ConstructionRules = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [originalRuleData, setOriginalRuleData] = useState(null);
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  // Form state for creating/updating rules
  const [formData, setFormData] = useState({
    cityName: '',
    pincode: '',
    rules: [createEmptyRule()],
    status: 'active',
    validFrom: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    validUntil: ''
  });
  
  // In component state, add status filter
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Add state for tracking which rule sets are expanded
  const [expandedRules, setExpandedRules] = useState({});
  
  // Add this state near the top of the file:
  const [isGeneratingRules, setIsGeneratingRules] = useState(false);
  
  // Function to create an empty rule
  function createEmptyRule() {
    return {
      sequence: 1,
      roomType: 'bedroom',
      description: '',
      dimensions: {
        minLength: 0,
        minWidth: 0,
        minArea: 0,
        maxLength: 0,
        maxWidth: 0,
        maxArea: 0,
        unit: 'meters'
      },
      additionalRequirements: '',
      isRequired: true
    };
  }
  
  // Fetch all rules on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  // Update validUntil when status changes to inactive
  useEffect(() => {
    if (formData.status === 'inactive' && (!formData.validUntil || formData.validUntil === '')) {
      // Set validUntil to current date if status is inactive and validUntil is not set
      setFormData({
        ...formData,
        validUntil: new Date().toISOString().split('T')[0]
      });
    }
  }, [formData.status]);
  
  // Fetch rules based on search criteria
  const fetchRules = async () => {
    setLoading(true);
    try {
      let response;
      
      if (searchType === 'all' || !searchValue) {
        response = await getAllRules();
        setRules(response.rules || []);
      } else if (searchType === 'city') {
        response = await getRulesByCity(searchValue);
        setRules(response.rules || []);
      } else if (searchType === 'pincode') {
        response = await getRulesByPincode(searchValue);
        setRules(response.rule ? [response.rule] : []);
      }
    } catch (error) {
      toast.error('Failed to fetch rules. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchRules();
  };
  
  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Simply update the form with the new value, without changing status
    // We'll determine the actual status at display time
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle rule input change
  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...formData.rules];
    
    if (field.includes('.')) {
      // Handle nested fields like dimensions.minLength
      const [parent, child] = field.split('.');
      updatedRules[index] = {
        ...updatedRules[index],
        [parent]: {
          ...updatedRules[index][parent],
          [child]: value
        }
      };
    } else {
      // Handle direct fields
      updatedRules[index] = {
        ...updatedRules[index],
        [field]: value
      };
    }
    
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };
  
  // Add a new rule to the form
  const addRule = () => {
    const newRule = createEmptyRule();
    newRule.sequence = formData.rules.length + 1;
    
    setFormData({
      ...formData,
      rules: [...formData.rules, newRule]
    });
  };
  
  // Remove a rule from the form
  const removeRule = (index) => {
    if (formData.rules.length <= 1) {
      toast.error('Cannot remove the last rule. At least one rule is required.');
      return;
    }
    
    const updatedRules = [...formData.rules];
    updatedRules.splice(index, 1);
    
    // Update sequences
    updatedRules.forEach((rule, i) => {
      rule.sequence = i + 1;
    });
    
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };
  
  // Validate form data
  const validateForm = () => {
    if (!formData.cityName || !formData.pincode || formData.rules.length === 0) {
      toast.error('Please fill in all required fields and add at least one rule.');
      return false;
    }
    
    // Validate rules
    for (const rule of formData.rules) {
      if (!rule.description) {
        toast.error('All rules must have a description.');
        return false;
      }
      
      // Validate dimensions when max dimensions are provided
      const { dimensions } = rule;
      if (dimensions.maxLength > 0 && dimensions.maxLength < dimensions.minLength) {
        toast.error(`Max Length must be greater than or equal to Min Length for rule ${rule.sequence}.`);
        return false;
      }
      
      if (dimensions.maxWidth > 0 && dimensions.maxWidth < dimensions.minWidth) {
        toast.error(`Max Width must be greater than or equal to Min Width for rule ${rule.sequence}.`);
        return false;
      }
      
      if (dimensions.maxArea > 0 && dimensions.maxArea < dimensions.minArea) {
        toast.error(`Max Area must be greater than or equal to Min Area for rule ${rule.sequence}.`);
        return false;
      }
    }

    // Check if validUntil date is after validFrom
    if (formData.validUntil && new Date(formData.validUntil) < new Date(formData.validFrom)) {
      toast.error('Valid Until date must be after Valid From date.');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission for creating new rules
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createRule(formData);
      
      toast.success('Building rules created successfully!');
      
      // Reset form
      setFormData({
        cityName: '',
        pincode: '',
        rules: [createEmptyRule()],
        status: 'active',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: ''
      });
      
      // Refresh rules list
      fetchRules();
      
      // Switch to browse tab
      setActiveTab('browse');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create building rules');
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new function to determine real-time status based on dates
  const determineStatus = (rule) => {
    const now = new Date();
    const validUntil = rule.validUntil ? new Date(rule.validUntil) : null;
    
    // If validUntil date exists and has passed, return 'inactive'
    if (validUntil && now > validUntil) {
      return 'inactive';
    }
    
    // Otherwise return the rule's stored status, or 'active' as default
    return rule.status || 'active';
  };
  
  // Format date string for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format as DD/MM/YY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    
    return `${day}/${month}/${year}`;
  };
  
  // Start editing a rule
  const handleEdit = (ruleSet) => {
    // Keep a copy of the original data
    setOriginalRuleData(JSON.parse(JSON.stringify(ruleSet)));
    
    // Format dates for form inputs
    const validFrom = ruleSet.validFrom ? new Date(ruleSet.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const validUntil = ruleSet.validUntil ? new Date(ruleSet.validUntil).toISOString().split('T')[0] : '';
    
    // Set form data with rule set data
    setFormData({
      _id: ruleSet._id,
      cityName: ruleSet.cityName,
      pincode: ruleSet.pincode,
      rules: ruleSet.rules.map(rule => ({
        ...rule,
        // Ensure all required properties exist
        dimensions: rule.dimensions || {
          minLength: 0,
          minWidth: 0,
          minArea: 0,
          maxLength: 0,
          maxWidth: 0,
          maxArea: 0,
          unit: 'meters'
        },
        additionalRequirements: rule.additionalRequirements || '',
        isRequired: rule.isRequired !== false
      })),
      status: ruleSet.status || 'active',
      validFrom: validFrom,
      validUntil: validUntil
    });
    
    setEditMode(true);
    setEditingRuleId(ruleSet._id);
    setActiveTab('create'); // Switch to create tab which will now be in edit mode
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingRuleId(null);
    setOriginalRuleData(null);
    
    // Reset form data
    setFormData({
      cityName: '',
      pincode: '',
      rules: [createEmptyRule()],
      status: 'active',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: ''
    });
  };
  
  // Save edited rule
  const handleUpdateRule = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await updateRule(editingRuleId, formData);
      
      toast.success('Building rules updated successfully!');
      
      // Reset edit mode
      setEditMode(false);
      setEditingRuleId(null);
      setOriginalRuleData(null);
      
      // Reset form
      setFormData({
        cityName: '',
        pincode: '',
        rules: [createEmptyRule()],
        status: 'active',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: ''
      });
      
      // Refresh rules list
      fetchRules();
      
      // Switch to browse tab
      setActiveTab('browse');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update building rules');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle rule deletion
  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteRule(id);
      
      toast.success('Building rule deleted successfully!');
      
      // Refresh rules list
      fetchRules();
    } catch (error) {
      toast.error('Failed to delete rule. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Add a function to filter rules by status
  const getFilteredRules = () => {
    if (statusFilter === 'all') return rules;
    
    return rules.filter(ruleSet => determineStatus(ruleSet) === statusFilter);
  };
  
  // Add a function to toggle expanded state for a rule set
  const toggleRuleExpand = (ruleId) => {
    setExpandedRules(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };
  
  // Add this function in the component, near the other handlers:
  const handleGenerateRules = async () => {
    // Check if we have the city and type selected
    if (!selectedCity || !selectedCategory) {
      handleError('Please select a city and category to generate rules');
      return;
    }
    
    setIsGeneratingRules(true);
    try {
      const result = await generateRuleRecommendations(selectedCity, selectedCategory);
      if (result.success && result.rules && result.rules.length > 0) {
        // Convert AI-generated rules to the format our application uses
        const aiGeneratedRules = result.rules.map((rule, index) => ({
          name: rule.name,
          description: rule.description,
          category: rule.category || selectedCategory,
          type: 'standard',
          ruleId: `ai-generated-${Date.now()}-${index}`,
          isRequired: true,
          city: selectedCity,
          validationParams: {
            requirements: rule.requirements || ''
          }
        }));
        
        // Add the new rules to the rules list
        const updatedRules = [...rules, ...aiGeneratedRules];
        setRules(updatedRules);
        
        handleSuccess(`Generated ${aiGeneratedRules.length} rules using AI`);
      } else {
        handleError('Failed to generate rules. Try again or create rules manually.');
      }
    } catch (error) {
      console.error('Error generating rules:', error);
      handleError('An error occurred while generating rules');
    } finally {
      setIsGeneratingRules(false);
    }
  };
  
  // Content to render within the admin layout
  const content = (
    <Container>
      <Title>
        <FaHammer />
        Construction Rules
      </Title>
      
      <Tabs>
        <Tab 
          active={activeTab === 'browse'} 
          onClick={() => {
            if (editMode) {
              if (window.confirm('Are you sure you want to cancel editing? Any unsaved changes will be lost.')) {
                handleCancelEdit();
                setActiveTab('browse');
              }
            } else {
              setActiveTab('browse');
            }
          }}
        >
          Browse Rules
        </Tab>
        <Tab 
          active={activeTab === 'create'} 
          onClick={() => {
            if (!editMode) {
              setActiveTab('create');
            }
          }}
        >
          {editMode ? 'Edit Rule' : 'Create New Rules'}
        </Tab>
      </Tabs>
      
      {activeTab === 'browse' && (
        <>
          <StickySearchContainer>
            <SearchContainer>
              <Select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">All Rules</option>
                <option value="city">By City</option>
                <option value="pincode">By Pincode</option>
              </Select>
              
              {searchType !== 'all' && (
                <Input 
                  type="text"
                  placeholder={searchType === 'city' ? "Enter city name" : "Enter pincode"}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )}
              
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Rules</option>
                <option value="inactive">Inactive Rules</option>
              </Select>
              
              <Button onClick={handleSearch} disabled={loading}>
                <FaSearch />
                Search
              </Button>
            </SearchContainer>
          </StickySearchContainer>
          
          {loading ? (
            <p>Loading...</p>
          ) : getFilteredRules().length === 0 ? (
            <EmptyState>
              <FaHammer />
              <h3>No construction rules found</h3>
              <p>Create new rules using the 'Create New Rules' tab</p>
            </EmptyState>
          ) : (
            <ScrollableRulesContainer>
              {getFilteredRules().map((ruleSet) => (
                <RuleCard key={ruleSet._id}>
                  <RuleHeader>
                    <div>
                      <RuleTitle>{ruleSet.cityName} - {ruleSet.pincode}</RuleTitle>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Badge status={determineStatus(ruleSet)}>{determineStatus(ruleSet)}</Badge>
                      <CollapseToggle 
                        onClick={() => toggleRuleExpand(ruleSet._id)}
                        aria-label={expandedRules[ruleSet._id] ? "Collapse rules" : "Expand rules"}
                      >
                        {expandedRules[ruleSet._id] ? <FaChevronUp /> : <FaChevronDown />}
                        {expandedRules[ruleSet._id] ? 'Hide Details' : 'Show Details'}
                      </CollapseToggle>
                      <ButtonGroup>
                        <Button onClick={() => handleEdit(ruleSet)}>
                          <FaEdit />
                          Edit
                        </Button>
                        <Button secondary onClick={() => handleDeleteRule(ruleSet._id)}>
                          <FaTrash />
                          Delete
                        </Button>
                      </ButtonGroup>
                    </div>
                  </RuleHeader>
                  
                  <RuleInfo>
                    <InfoItem>
                      <span>Valid From:</span>
                      <span>{formatDate(ruleSet.validFrom)}</span>
                    </InfoItem>
                    {ruleSet.validUntil && (
                      <InfoItem>
                        <span>Valid Until:</span>
                        <span>{formatDate(ruleSet.validUntil)}</span>
                      </InfoItem>
                    )}
                    <InfoItem>
                      <span>Total Rules:</span>
                      <span>{ruleSet.rules.length}</span>
                    </InfoItem>
                  </RuleInfo>
                  
                  {expandedRules[ruleSet._id] && (
                    <RulesList>
                      <h3 style={{ margin: '0 0 1rem 0', color: '#4b5563' }}>Construction Rules</h3>
                      {ruleSet.rules.map((rule) => (
                        <RuleItem key={rule._id || rule.sequence}>
                          <h3>{rule.sequence}. {rule.roomType} Requirements</h3>
                          <p>{rule.description}</p>
                          
                          <RuleInfo>
                            <InfoItem>
                              <span>Min Dimensions:</span>
                              <span>
                                {rule.dimensions.minLength} × {rule.dimensions.minWidth} {rule.dimensions.unit}
                                {rule.dimensions.minArea ? ` (${rule.dimensions.minArea} sq ${rule.dimensions.unit})` : ''}
                              </span>
                            </InfoItem>
                            <InfoItem>
                              <span>Max Dimensions:</span>
                              <span>
                                {rule.dimensions.maxLength && rule.dimensions.maxWidth ? 
                                  `${rule.dimensions.maxLength} × ${rule.dimensions.maxWidth} ${rule.dimensions.unit}` : 
                                  'Not specified'}
                                {rule.dimensions.maxArea ? ` (${rule.dimensions.maxArea} sq ${rule.dimensions.unit})` : ''}
                              </span>
                            </InfoItem>
                            <InfoItem>
                              <span>Required:</span>
                              <span>{rule.isRequired ? 'Yes' : 'No'}</span>
                            </InfoItem>
                          </RuleInfo>
                          
                          {rule.additionalRequirements && (
                            <p>
                              <strong>Additional Requirements:</strong> {rule.additionalRequirements}
                            </p>
                          )}
                        </RuleItem>
                      ))}
                    </RulesList>
                  )}
                </RuleCard>
              ))}
            </ScrollableRulesContainer>
          )}
        </>
      )}
      
      {activeTab === 'create' && (
        <form onSubmit={editMode ? handleUpdateRule : handleSubmit}>
          {editMode && (
            <EditModeHeader>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Editing Rule: {formData.cityName} - {formData.pincode}</h3>
                <p style={{ margin: 0 }}>Make your changes and click 'Save Changes' when done.</p>
              </div>
              <ButtonGroup>
                <Button type="button" secondary onClick={handleCancelEdit}>
                  <FaTimes />
                  Cancel Edit
                </Button>
              </ButtonGroup>
            </EditModeHeader>
          )}
          
          <FormSection>
            <FormTitle>General Information</FormTitle>
            
            <FormRow>
              <FormGroup>
                <Label>City Name *</Label>
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
                <Label>Pincode *</Label>
                <Input 
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Valid From *</Label>
                <DateInputGroup>
                  <DateInput 
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    required
                  />
                  <FaCalendarAlt />
                </DateInputGroup>
              </FormGroup>
              
              <FormGroup>
                <Label>Valid Until {formData.status === 'inactive' && '(Required for inactive status)'}</Label>
                <DateInputGroup>
                  <DateInput 
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    min={formData.validFrom} // Cannot select a date before validFrom
                    required={formData.status === 'inactive'}
                  />
                  <FaCalendarAlt />
                </DateInputGroup>
                {formData.status === 'inactive' && !formData.validUntil && (
                  <small style={{ color: '#ef4444', marginTop: '0.25rem' }}>
                    Required for inactive status
                  </small>
                )}
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <FormTitle>
              Building Rules
              <Button 
                type="button" 
                onClick={addRule}
                style={{ float: 'right', padding: '0.5rem 1rem' }}
              >
                <FaPlusCircle />
                Add Rule
              </Button>
            </FormTitle>
            
            {formData.rules.map((rule, index) => (
              <RuleGroup key={index}>
                <RemoveButton type="button" onClick={() => removeRule(index)}>
                  <FaMinusCircle />
                </RemoveButton>
                
                <FormRow>
                  <FormGroup flex="0 0 80px">
                    <Label>Sequence</Label>
                    <Input 
                      type="number"
                      value={rule.sequence}
                      readOnly
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Room Type *</Label>
                    <Select 
                      value={rule.roomType}
                      onChange={(e) => handleRuleChange(index, 'roomType', e.target.value)}
                      required
                    >
                      <option value="bedroom">Bedroom</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="hall">Hall/Living Room</option>
                      <option value="bathroom">Bathroom</option>
                      <option value="balcony">Balcony</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup flex="2">
                    <Label>Description *</Label>
                    <Input 
                      type="text"
                      value={rule.description}
                      onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
                      placeholder="Enter rule description"
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <Label>Min Length (meters) *</Label>
                    <Input 
                      type="number"
                      value={rule.dimensions.minLength}
                      onChange={(e) => handleRuleChange(index, 'dimensions.minLength', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Min Width (meters) *</Label>
                    <Input 
                      type="number"
                      value={rule.dimensions.minWidth}
                      onChange={(e) => handleRuleChange(index, 'dimensions.minWidth', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Min Area (sq. meters) *</Label>
                    <Input 
                      type="number"
                      value={rule.dimensions.minArea}
                      onChange={(e) => handleRuleChange(index, 'dimensions.minArea', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Unit</Label>
                    <Select 
                      value={rule.dimensions.unit}
                      onChange={(e) => handleRuleChange(index, 'dimensions.unit', e.target.value)}
                    >
                      <option value="meters">meters</option>
                      <option value="feet">feet</option>
                    </Select>
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label>Max Length (meters)</Label>
                    <Input 
                      type="number"
                      value={rule.dimensions.maxLength}
                      onChange={(e) => handleRuleChange(index, 'dimensions.maxLength', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Max Width (meters)</Label>
                    <Input 
                      type="number"
                      value={rule.dimensions.maxWidth}
                      onChange={(e) => handleRuleChange(index, 'dimensions.maxWidth', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Max Area (sq. meters)</Label>
                    <Input 
                      type="number"
                      value={rule.dimensions.maxArea}
                      onChange={(e) => handleRuleChange(index, 'dimensions.maxArea', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    {/* Empty group for alignment */}
                  </FormGroup>
                </FormRow>
                
                <FormGroup>
                  <Label>Additional Requirements</Label>
                  <Input 
                    type="text"
                    value={rule.additionalRequirements}
                    onChange={(e) => handleRuleChange(index, 'additionalRequirements', e.target.value)}
                    placeholder="Enter any additional requirements"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    <input 
                      type="checkbox"
                      checked={rule.isRequired}
                      onChange={(e) => handleRuleChange(index, 'isRequired', e.target.checked)}
                    />
                    {' '}Is this rule required?
                  </Label>
                </FormGroup>
              </RuleGroup>
            ))}
          </FormSection>
          
          <ButtonGroup>
            <Button type="submit" disabled={loading}>
              {editMode ? <><FaSave /> Save Changes</> : <><FaPlus /> Create Building Rules</>}
            </Button>
            <Button 
              type="button" 
              secondary 
              onClick={() => {
                if (editMode) {
                  handleCancelEdit();
                }
                setActiveTab('browse');
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      )}
    </Container>
  );
  
  return (
    <AdminDashboardLayout>
      {content}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </AdminDashboardLayout>
  );
};

export default ConstructionRules;