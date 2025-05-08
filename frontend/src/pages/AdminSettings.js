import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaCog, 
  FaUserCog, 
  FaBell, 
  FaLock, 
  FaPalette, 
  FaGlobe, 
  FaSave, 
  FaUndo, 
  FaInfoCircle,
  FaMoon,
  FaSun,
  FaHammer,
  FaRobot,
  FaKey
} from 'react-icons/fa';
import AdminDashboardLayout from '../components/AdminDashboardLayout';
import { getAdminInfo, updateAdminProfile, saveSettings, getAdminSettings } from '../services/adminService';
import { handleSuccess, handleError } from '../utils';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1a2a6c;
  
  svg {
    color: #1a2a6c;
  }
`;

const SettingsWrapper = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: fit-content;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#1a2a6c' : '#4b5563'};
  background: ${props => props.active ? 'rgba(26, 42, 108, 0.08)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  margin-bottom: 0.5rem;
  
  svg {
    font-size: 1.1rem;
  }
  
  &:hover {
    background: ${props => props.active ? 'rgba(26, 42, 108, 0.12)' : 'rgba(0, 0, 0, 0.03)'};
    color: #1a2a6c;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #1a2a6c;
  font-weight: 600;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 0.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  font-size: 0.95rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a2a6c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  
  background: ${props => props.primary ? '#1a2a6c' : 'white'};
  color: ${props => props.primary ? 'white' : '#1a2a6c'};
  border: 1px solid ${props => props.primary ? 'transparent' : '#e5e7eb'};
  
  &:hover {
    background: ${props => props.primary ? '#111e4a' : '#f9fafb'};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: .4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #1a2a6c;
  }
  
  input:checked + span:before {
    transform: translateX(30px);
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
`;

const SwitchLabel = styled.div`
  font-weight: 500;
`;

const ColorOption = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid ${props => props.selected ? '#1a2a6c' : 'transparent'};
  box-shadow: ${props => props.selected ? '0 0 0 2px white, 0 0 0 4px #1a2a6c' : 'none'};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ColorOptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const InfoBox = styled.div`
  background-color: rgba(26, 42, 108, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #1a2a6c;
  margin: 1rem 0;
  
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  svg {
    color: #1a2a6c;
    margin-top: 0.2rem;
  }
  
  p {
    margin: 0;
    color: #4b5563;
    font-size: 0.9rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  border-radius: 10px;
  background: ${props => props.selected ? 'rgba(26, 42, 108, 0.08)' : '#f9fafb'};
  border: 2px solid ${props => props.selected ? '#1a2a6c' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    font-size: 2rem;
    color: #1a2a6c;
    margin-bottom: 0.75rem;
  }
  
  h3 {
    font-size: 0.95rem;
    margin: 0;
    color: #1f2937;
  }
`;

const ThemeModeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ThemeOption = styled.div`
  flex: 1;
  padding: 1.5rem;
  border-radius: 10px;
  background: ${props => props.mode === 'dark' ? '#1f2937' : '#f9fafb'};
  border: 2px solid ${props => props.selected ? '#1a2a6c' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  color: ${props => props.mode === 'dark' ? '#f9fafb' : '#1f2937'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    font-size: 2rem;
    color: ${props => props.mode === 'dark' ? '#f9fafb' : '#1a2a6c'};
    margin-bottom: 0.75rem;
  }
  
  h3 {
    font-size: 1rem;
    margin: 0;
    color: ${props => props.mode === 'dark' ? '#f9fafb' : '#1f2937'};
  }
`;

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    bio: ''
  });
  
  // Settings state with defaults
  const defaultSettings = {
    notifications: {
      email: true,
      push: true,
      sms: false,
      inApp: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#1a2a6c',
      fontSize: 'medium'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    system: {
      language: 'en',
      timeFormat: '24h',
      dateFormat: 'DD/MM/YYYY'
    },
    ai: {
      geminiApiKey: '',
      enableAiAnalysis: true,
      analysisSensitivity: 'medium'
    }
  };
  
  const [settings, setSettings] = useState(defaultSettings);
  
  // Get admin info and settings on mount
  useEffect(() => {
    // Get admin info
    const adminInfo = getAdminInfo();
    if (adminInfo) {
      setAdmin({
        name: adminInfo.name || '',
        email: adminInfo.email || '',
        phone: adminInfo.phone || '',
        city: adminInfo.city || '',
        bio: adminInfo.bio || ''
      });
    }
    
    // Get saved settings or use defaults
    const savedSettings = getAdminSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };
  
  const handleToggleChange = (section, setting) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: !prev[section][setting]
      }
    }));
  };
  
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Save admin profile
      await updateAdminProfile(admin);
      
      // Save settings
      await saveSettings(settings);
      
      handleSuccess('Settings saved successfully!');
    } catch (error) {
      handleError('Failed to save settings. Please try again.');
      console.error('Settings save error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const resetSettings = () => {
    // Confirm reset
    if (window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      // Reset to default settings
      setSettings(defaultSettings);
      
      // Save default settings to server and localStorage
      saveSettings(defaultSettings).catch(err => {
        console.error('Error saving default settings', err);
      });
      
      handleSuccess('Settings have been reset to default.');
    }
  };
  
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <>
            <SectionTitle>Profile Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label>Full Name</Label>
                <Input 
                  type="text"
                  name="name"
                  value={admin.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Email Address</Label>
                <Input 
                  type="email"
                  name="email"
                  value={admin.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input 
                  type="tel"
                  name="phone"
                  value={admin.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>City</Label>
                <Input 
                  type="text"
                  name="city"
                  value={admin.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label>Bio</Label>
              <TextArea 
                name="bio"
                value={admin.bio}
                onChange={handleInputChange}
                placeholder="Describe yourself"
              />
            </FormGroup>
            
            <InfoBox>
              <FaInfoCircle />
              <p>Your profile information is visible to other administrators in the system.</p>
            </InfoBox>
          </>
        );
        
      case 'notifications':
        return (
          <>
            <SectionTitle>Notification Preferences</SectionTitle>
            
            <SwitchContainer>
              <SwitchLabel>Email Notifications</SwitchLabel>
              <Switch>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.email}
                  onChange={() => handleToggleChange('notifications', 'email')}
                />
                <span />
              </Switch>
            </SwitchContainer>
            
            <SwitchContainer>
              <SwitchLabel>Push Notifications</SwitchLabel>
              <Switch>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.push}
                  onChange={() => handleToggleChange('notifications', 'push')}
                />
                <span />
              </Switch>
            </SwitchContainer>
            
            <SwitchContainer>
              <SwitchLabel>SMS Notifications</SwitchLabel>
              <Switch>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.sms}
                  onChange={() => handleToggleChange('notifications', 'sms')}
                />
                <span />
              </Switch>
            </SwitchContainer>
            
            <SwitchContainer>
              <SwitchLabel>In-App Notifications</SwitchLabel>
              <Switch>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.inApp}
                  onChange={() => handleToggleChange('notifications', 'inApp')}
                />
                <span />
              </Switch>
            </SwitchContainer>
            
            <Section>
              <SectionTitle>Notification Types</SectionTitle>
              
              <CardGrid>
                <Card selected={true}>
                  <FaUserCog />
                  <h3>Admin Activity</h3>
                </Card>
                
                <Card selected={true}>
                  <FaLock />
                  <h3>Security Alerts</h3>
                </Card>
                
                <Card selected={false}>
                  <FaGlobe />
                  <h3>News Updates</h3>
                </Card>
                
                <Card selected={true}>
                  <FaHammer />
                  <h3>Rule Changes</h3>
                </Card>
              </CardGrid>
            </Section>
          </>
        );
        
      case 'appearance':
        return (
          <>
            <SectionTitle>Theme Settings</SectionTitle>
            
            <Label>Theme Mode</Label>
            <ThemeModeSelector>
              <ThemeOption 
                mode="light" 
                selected={settings.appearance.theme === 'light'}
                onClick={() => handleSettingChange('appearance', 'theme', 'light')}
              >
                <FaSun />
                <h3>Light Mode</h3>
              </ThemeOption>
              
              <ThemeOption 
                mode="dark" 
                selected={settings.appearance.theme === 'dark'}
                onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
              >
                <FaMoon />
                <h3>Dark Mode</h3>
              </ThemeOption>
            </ThemeModeSelector>
            
            <FormGroup style={{ marginTop: '2rem' }}>
              <Label>Primary Color</Label>
              <ColorOptionsContainer>
                <ColorOption 
                  color="#1a2a6c" 
                  selected={settings.appearance.primaryColor === '#1a2a6c'} 
                  onClick={() => handleSettingChange('appearance', 'primaryColor', '#1a2a6c')}
                />
                <ColorOption 
                  color="#2a6c1a" 
                  selected={settings.appearance.primaryColor === '#2a6c1a'} 
                  onClick={() => handleSettingChange('appearance', 'primaryColor', '#2a6c1a')}
                />
                <ColorOption 
                  color="#6c1a2a" 
                  selected={settings.appearance.primaryColor === '#6c1a2a'} 
                  onClick={() => handleSettingChange('appearance', 'primaryColor', '#6c1a2a')}
                />
                <ColorOption 
                  color="#1a6c6c" 
                  selected={settings.appearance.primaryColor === '#1a6c6c'} 
                  onClick={() => handleSettingChange('appearance', 'primaryColor', '#1a6c6c')}
                />
                <ColorOption 
                  color="#6c6c1a" 
                  selected={settings.appearance.primaryColor === '#6c6c1a'} 
                  onClick={() => handleSettingChange('appearance', 'primaryColor', '#6c6c1a')}
                />
              </ColorOptionsContainer>
            </FormGroup>
            
            <FormGroup>
              <Label>Font Size</Label>
              <Select 
                value={settings.appearance.fontSize}
                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Select>
            </FormGroup>
          </>
        );
        
      case 'security':
        return (
          <>
            <SectionTitle>Security Settings</SectionTitle>
            
            <SwitchContainer>
              <SwitchLabel>Two-Factor Authentication</SwitchLabel>
              <Switch>
                <input 
                  type="checkbox" 
                  checked={settings.security.twoFactorAuth}
                  onChange={() => handleToggleChange('security', 'twoFactorAuth')}
                />
                <span />
              </Switch>
            </SwitchContainer>
            
            {settings.security.twoFactorAuth && (
              <InfoBox>
                <FaInfoCircle />
                <p>Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.</p>
              </InfoBox>
            )}
            
            <FormGroup>
              <Label>Session Timeout (minutes)</Label>
              <Input 
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                min="5"
                max="120"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Password Expiry (days)</Label>
              <Input 
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', e.target.value)}
                min="30"
                max="365"
              />
            </FormGroup>
            
            <ButtonGroup style={{ justifyContent: 'flex-start' }}>
              <Button primary>Change Password</Button>
            </ButtonGroup>
          </>
        );
        
      case 'system':
        return (
          <>
            <SectionTitle>System Preferences</SectionTitle>
            
            <FormGroup>
              <Label>Language</Label>
              <Select 
                value={settings.system.language}
                onChange={(e) => handleSettingChange('system', 'language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Time Format</Label>
              <Select 
                value={settings.system.timeFormat}
                onChange={(e) => handleSettingChange('system', 'timeFormat', e.target.value)}
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Date Format</Label>
              <Select 
                value={settings.system.dateFormat}
                onChange={(e) => handleSettingChange('system', 'dateFormat', e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </Select>
            </FormGroup>
            
            <InfoBox>
              <FaInfoCircle />
              <p>These settings affect how dates and times are displayed throughout the admin dashboard.</p>
            </InfoBox>
          </>
        );
        
      case 'ai':
        return (
          <>
            <SectionTitle>AI Integration Settings</SectionTitle>
            
            <FormGroup>
              <Label>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <FaKey style={{ marginRight: '8px' }} /> Gemini API Key
                </span>
              </Label>
              <Input 
                type="password"
                value={settings.ai.geminiApiKey}
                onChange={(e) => handleSettingChange('ai', 'geminiApiKey', e.target.value)}
                placeholder="Enter your Google AI Gemini API key"
              />
              <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '4px' }}>
                Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
              </div>
            </FormGroup>
            
            <SwitchContainer>
              <SwitchLabel>Enable AI Analysis for Verifications</SwitchLabel>
              <Switch>
                <input 
                  type="checkbox" 
                  checked={settings.ai.enableAiAnalysis}
                  onChange={() => handleToggleChange('ai', 'enableAiAnalysis')}
                />
                <span />
              </Switch>
            </SwitchContainer>
            
            <FormGroup>
              <Label>Analysis Sensitivity</Label>
              <Select 
                value={settings.ai.analysisSensitivity}
                onChange={(e) => handleSettingChange('ai', 'analysisSensitivity', e.target.value)}
              >
                <option value="low">Low - General recommendations</option>
                <option value="medium">Medium - Balanced analysis</option>
                <option value="high">High - Detailed scrutiny</option>
              </Select>
            </FormGroup>
            
            <InfoBox>
              <FaInfoCircle />
              <p>These settings configure how the Google Gemini AI model analyzes construction verification documents and provides recommendations.</p>
            </InfoBox>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <AdminDashboardLayout>
      <Container>
        <Title>
          <FaCog />
          Settings
        </Title>
        
        <SettingsWrapper>
          <Sidebar>
            <SidebarItem 
              active={activeTab === 'account'} 
              onClick={() => setActiveTab('account')}
            >
              <FaUserCog />
              Account Settings
            </SidebarItem>
            
            <SidebarItem 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell />
              Notifications
            </SidebarItem>
            
            <SidebarItem 
              active={activeTab === 'appearance'} 
              onClick={() => setActiveTab('appearance')}
            >
              <FaPalette />
              Appearance
            </SidebarItem>
            
            <SidebarItem 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')}
            >
              <FaLock />
              Security
            </SidebarItem>
            
            <SidebarItem 
              active={activeTab === 'system'} 
              onClick={() => setActiveTab('system')}
            >
              <FaGlobe />
              System
            </SidebarItem>
            
            <SidebarItem 
              active={activeTab === 'ai'} 
              onClick={() => setActiveTab('ai')}
            >
              <FaRobot />
              AI Integration
            </SidebarItem>
          </Sidebar>
          
          <ContentArea>
            {renderContent()}
            
            <ButtonGroup>
              <Button onClick={resetSettings}>
                <FaUndo />
                Reset to Default
              </Button>
              <Button primary onClick={handleSaveChanges} disabled={loading}>
                <FaSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </ContentArea>
        </SettingsWrapper>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminDashboardLayout>
  );
};

export default AdminSettings; 