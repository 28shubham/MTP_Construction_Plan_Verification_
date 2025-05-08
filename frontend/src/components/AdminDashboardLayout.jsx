import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaUsers, 
  FaClipboardCheck, 
  FaUsersCog, 
  FaCalendarAlt,
  FaTachometerAlt,
  FaUserPlus,
  FaClipboardList,
  FaCog,
  FaBars,
  FaHammer,
  FaCity
} from 'react-icons/fa';
import { logoutAdmin, getAdminInfo } from '../services/adminService';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
`;

const Sidebar = styled.div`
  width: ${props => props.isOpen ? '250px' : '0'};
  background: #1a2a6c;
  color: white;
  transition: width 0.3s ease;
  overflow: hidden;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
`;

const SidebarContent = styled.div`
  padding: 2rem 1rem;
  width: 250px;
`;

const SidebarHeader = styled.div`
  padding: 0 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }

  &:hover, &.active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MainWrapper = styled.div`
  flex: 1;
  margin-left: ${props => props.sidebarOpen ? '250px' : '0'};
  transition: margin-left 0.3s ease;
  min-height: 100vh;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const AdminDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const adminInfo = getAdminInfo();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  // Set active tab based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('dashboard')) setActiveTab('dashboard');
    else if (path.includes('register-admin')) setActiveTab('register');
    else if (path.includes('verifications')) setActiveTab('verifications');
    else if (path.includes('lists')) setActiveTab('lists');
    else if (path.includes('settings')) setActiveTab('settings');
    else if (path.includes('construction-rules')) setActiveTab('rules');
    else if (path.includes('building-plans')) setActiveTab('building-plans');
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarContent>
          <SidebarHeader>
            <h2>Admin Panel</h2>
          </SidebarHeader>
          <nav>
            <NavItem 
              to="/admin/dashboard" 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaTachometerAlt />
              Dashboard
            </NavItem>
            <NavItem 
              to="/admin/register-admin" 
              className={activeTab === 'register' ? 'active' : ''}
              onClick={() => setActiveTab('register')}
            >
              <FaUserPlus />
              Register Admin
            </NavItem>
            <NavItem 
              to="/admin/verifications" 
              className={activeTab === 'verifications' ? 'active' : ''}
              onClick={() => setActiveTab('verifications')}
            >
              <FaClipboardList />
              Verifications
            </NavItem>
            <NavItem 
              to="/admin/lists" 
              className={activeTab === 'lists' ? 'active' : ''}
              onClick={() => setActiveTab('lists')}
            >
              <FaUsersCog />
              Admin List
            </NavItem>
            <NavItem 
              to="/admin/settings" 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <FaCog />
              Settings
            </NavItem>
            <NavItem 
              to="/admin/construction-rules" 
              className={activeTab === 'rules' ? 'active' : ''}
              onClick={() => setActiveTab('rules')}
            >
              <FaHammer />
              Construction Rules
            </NavItem>
            <NavItem 
              to="/admin/building-plans" 
              className={activeTab === 'building-plans' ? 'active' : ''}
              onClick={() => setActiveTab('building-plans')}
            >
              <FaCity />
              Building Plans
            </NavItem>
          </nav>
        </SidebarContent>
      </Sidebar>

      <MainWrapper sidebarOpen={isSidebarOpen}>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MenuButton onClick={toggleSidebar}>
              <FaBars />
            </MenuButton>
            <HeaderTitle>Admin Dashboard</HeaderTitle>
          </div>
          <UserInfo>
            <span>{adminInfo?.name || 'Admin'}</span>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserInfo>
        </Header>

        <MainContent>
          {children}
        </MainContent>
      </MainWrapper>
    </DashboardContainer>
  );
};

export default AdminDashboardLayout; 