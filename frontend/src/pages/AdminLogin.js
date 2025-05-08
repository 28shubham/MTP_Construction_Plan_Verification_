import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, isAdminLoggedIn } from "../services/adminService";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import { FaLock, FaEnvelope } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import './AdminLogin.css';

// ========== Styled Components ==========
const LoginContainer = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

const GraphicSection = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  padding: 4rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin-bottom: 1rem;
  }

  p {
    opacity: 0.9;
    font-size: clamp(0.875rem, 2vw, 1rem);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SecurityInfo = styled.div`
  div {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;

    svg {
      font-size: 1.2rem;
    }
  }
`;

const FormSection = styled.div`
  padding: 4rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const FormTitle = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  color: #374151;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: clamp(0.875rem, 2vw, 1rem);
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.3s ease;

  &:focus {
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
    outline: none;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 2.6rem;
  color: #9ca3af;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1a2a6c 20%, #b21f1f);
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const BackToLogin = styled.div`
  text-align: center;
  margin: 1rem 0;

  a {
    color: #1a2a6c;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAdminLoggedIn()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await loginAdmin(credentials);
      if (response.message === 'Login successful') {
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <GraphicSection>
          <div>
            <h2>Admin Portal</h2>
            <p>Access the administrative dashboard to manage construction plan verifications and user accounts.</p>
          </div>
          <SecurityInfo>
            <div>
              <FaLock />
              <p>Secure admin access with role-based permissions</p>
            </div>
            <div>
              <FaEnvelope />
              <p>Manage verification requests and user communications</p>
            </div>
          </SecurityInfo>
        </GraphicSection>

        <FormSection>
          <FormTitle>Admin Login</FormTitle>
          <FormSubtitle>Enter your credentials to access the admin dashboard</FormSubtitle>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <InputGroup>
              <InputLabel htmlFor="email">Email</InputLabel>
              <InputField
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
              <IconWrapper>
                <FaEnvelope />
              </IconWrapper>
            </InputGroup>

            <InputGroup>
              <InputLabel htmlFor="password">Password</InputLabel>
              <InputField
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              <IconWrapper>
                <FaLock />
              </IconWrapper>
            </InputGroup>

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </SubmitButton>

            <BackToLogin>
              <Link to="/login">Back to User Login</Link>
            </BackToLogin>
          </form>
        </FormSection>
      </LoginCard>
      <ToastContainer />
    </LoginContainer>
  );
};

export default AdminLogin; 