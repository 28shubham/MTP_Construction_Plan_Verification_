import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaUserPlus, FaEnvelope, FaLock, FaUserShield, FaCheckSquare } from 'react-icons/fa';
import { registerAdmin } from '../services/adminService';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  color: #1f2937;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.8rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;

  svg {
    color: #1a2a6c;
    font-size: 2rem;
  }
`;

const Form = styled.form`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
  position: relative;

  svg {
    position: absolute;
    left: 1rem;
    top: 2.7rem;
    color: #6b7280;
    font-size: 1.2rem;
  }

  &:last-child {
    margin-bottom: 1.5rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.025em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
    background-color: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
    background-color: white;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(26, 42, 108, 0.05);
  }

  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 4px;
    border: 2px solid #1a2a6c;
    cursor: pointer;

    &:checked {
      background-color: #1a2a6c;
      border-color: #1a2a6c;
    }
  }

  span {
    font-size: 0.95rem;
    color: #4b5563;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &:before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1rem;
  }
`;

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const permissions = [
    'manage_users',
    'verify_plans',
    'manage_admins',
    'view_reports'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user makes changes
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 3) {
      setError('Password must be at least 3 characters long');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.permissions.length === 0) {
      setError('Please select at least one permission');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerAdmin(formData);
      toast.success('Admin registered successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        permissions: []
      });

      // Optionally redirect to admin list or dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register admin. Please try again.');
      toast.error(error.message || 'Failed to register admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>
        <FaUserPlus />
        Register New Admin
      </Title>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <FaUserShield />
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter admin's full name"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <FaEnvelope />
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter admin's email address"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <FaLock />
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a strong password"
            minLength="3"
          />
        </FormGroup>

        <FormGroup>
          <Label>
            <FaCheckSquare style={{ position: 'static', marginRight: '0.5rem' }} />
            Admin Permissions
          </Label>
          <CheckboxGroup>
            {permissions.map(permission => (
              <CheckboxLabel key={permission}>
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                />
                <span>
                  {permission.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        {error && (
          <ErrorMessage>
            <FaUserShield />
            {error}
          </ErrorMessage>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Admin'}
        </Button>
      </Form>
    </Container>
  );
};

export default AdminRegistration; 