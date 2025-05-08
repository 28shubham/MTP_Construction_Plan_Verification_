import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import styled from "styled-components";
import { FaGoogle, FaFacebook, FaLock, FaEnvelope } from "react-icons/fa";
import { login as authLogin } from "../services/auth";

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

  &:hover {
    background: linear-gradient(135deg, #1a2a6c 20%, #b21f1f);
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const SignupLink = styled.div`
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

const SocialLoginDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: #6b7280;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }

  span {
    padding: 0 1rem;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #1a2a6c;
    color: #1a2a6c;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const AdminLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;

  a {
    color: #6b7280;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #1a2a6c;
      text-decoration: underline;
    }
  }
`;

// ========== Main Component ==========
function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("All fields are required");
    }

    const result = await authLogin(loginInfo);
    if (result) {
      navigate("/home");
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <GraphicSection>
          <div>
            <h2>Welcome Back!</h2>
            <p>Sign in to continue your journey</p>
          </div>

          <SecurityInfo>
            <div>
              <FaEnvelope />
              <span>support@gmail.com</span>
            </div>
            <div>
              <FaLock />
              <span>Secure Login</span>
            </div>
          </SecurityInfo>
        </GraphicSection>

        <FormSection>
          <FormTitle>Sign In</FormTitle>
          <FormSubtitle>Welcome back to our community</FormSubtitle>

          <form onSubmit={handleLogin}>
            <InputGroup>
              <InputLabel>Email</InputLabel>
              <InputField
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginInfo.email}
                onChange={handleChange}
              />
              <IconWrapper>
                <FaEnvelope />
              </IconWrapper>
            </InputGroup>

            <InputGroup>
              <InputLabel>Password</InputLabel>
              <InputField
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
              />
              <IconWrapper>
                <FaLock />
              </IconWrapper>
            </InputGroup>

            <SubmitButton type="submit">Sign In</SubmitButton>

            <SignupLink>
              <span>Don't have an account? </span>
              <Link to="/signup">Create Account</Link>
            </SignupLink>

            <AdminLink>
              <Link to="/admin/login">Admin Login →</Link>
            </AdminLink>

            <SocialLoginDivider>
              <span>Or continue with</span>
            </SocialLoginDivider>

            <SocialButtons>
              <SocialButton type="button">
                <FaGoogle /> Google
              </SocialButton>
              <SocialButton type="button">
                <FaFacebook /> Facebook
              </SocialButton>
            </SocialButtons>
          </form>
        </FormSection>
      </LoginCard>
      <ToastContainer />
    </LoginContainer>
  );
}

export default Login;