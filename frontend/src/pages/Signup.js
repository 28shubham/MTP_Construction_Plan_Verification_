import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import styled from "styled-components";
import {
  FaGoogle,
  FaFacebook,
  FaLock,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";

// ========== Styled Components ==========
const SignupContainer = styled.div`
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

const SignupCard = styled.div`
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

const LoginLink = styled.div`
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

// ========== Main Component ==========
function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError("All fields are required");
    }

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        handleError(result.message || "Signup failed");
      }
    } catch (err) {
      handleError("An error occurred during signup");
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <GraphicSection>
          <div>
            <h2>Create Account!</h2>
            <p>Join our community to get started.</p>
          </div>

          <SecurityInfo>
            <div>
              <FaLock />
              <span>Secure Registration</span>
            </div>
            <div>
              <FaUser />
              <span>Instant Account Setup</span>
            </div>
          </SecurityInfo>
        </GraphicSection>

        <FormSection>
          <FormTitle>Get Started</FormTitle>
          <FormSubtitle>Create your free account</FormSubtitle>

          <form onSubmit={handleSignup}>
            <InputGroup>
              <InputLabel>Name</InputLabel>
              <InputField
                type="text"
                name="name"
                placeholder="Enter your name"
                value={signupInfo.name}
                onChange={handleChange}
                autoFocus
              />
              <IconWrapper>
                <FaUser />
              </IconWrapper>
            </InputGroup>

            <InputGroup>
              <InputLabel>Email</InputLabel>
              <InputField
                type="email"
                name="email"
                placeholder="Enter your email"
                value={signupInfo.email}
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
                value={signupInfo.password}
                onChange={handleChange}
              />
              <IconWrapper>
                <FaLock />
              </IconWrapper>
            </InputGroup>

            <SubmitButton type="submit">Create Account</SubmitButton>

            <LoginLink>
              <span>Already have an account? </span>
              <Link to="/login">Login here</Link>
            </LoginLink>

            <SocialLoginDivider>
              <span>Or sign up with</span>
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
      </SignupCard>
      <ToastContainer />
    </SignupContainer>
  );
}

export default Signup;
