import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { 
  FaUserPlus, 
  FaEnvelope, 
  FaLock, 
  FaUserShield, 
  FaCheckSquare, 
  FaExclamationCircle,
  FaArrowLeft
} from 'react-icons/fa';
import { registerAdmin } from '../services/adminService';
import AdminDashboardLayout from '../components/AdminDashboardLayout';

const PageContent = styled.div`
  padding: 2rem;
  max-width: 1400px;
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

const Header = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 2rem;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    font-size: 1rem;
  }
`;

const Form = styled.form`
  background: white;
  padding: 2.5rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background: #f8fafc;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  h2 {
    margin: 0 0 1.5rem 0;
    color: #1a2a6c;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 1rem;
    top: 2.7rem;
    color: #6b7280;
    font-size: 1.2rem;
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
  background-color: white;

  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PermissionCard = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1a2a6c;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
    font-weight: 500;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;

  svg {
    color: #dc2626;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
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
    'view_reports',
    'manage_settings',
    'audit_logs'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
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
      await registerAdmin(formData);
      toast.success('Admin registered successfully!');
      navigate('/admin/lists');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register admin. Please try again.');
      toast.error(error.message || 'Failed to register admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <PageContent>
        <Header>
          <BackButton onClick={() => navigate('/admin/lists')}>
            <FaArrowLeft />
            Back to List
          </BackButton>
          <Title>
            <FaUserPlus />
            Register New Admin
          </Title>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <FaExclamationCircle />
              {error}
            </ErrorMessage>
          )}

          <FormSection>
            <h2>
              <FaUserShield />
              Basic Information
            </h2>
            <FormGrid>
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
            </FormGrid>
          </FormSection>

          <FormSection>
            <h2>
              <FaCheckSquare />
              Admin Permissions
            </h2>
            <PermissionsGrid>
              {permissions.map(permission => (
                <PermissionCard key={permission}>
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
                </PermissionCard>
              ))}
            </PermissionsGrid>
          </FormSection>

          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Admin'}
          </Button>
        </Form>
      </PageContent>
    </AdminDashboardLayout>
  );
};

export default AdminRegistration; 