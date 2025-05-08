import React, { useState } from 'react';
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 2rem;
    color: #1a2a6c;
  }
`;

const StatInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  background: ${props => props.active ? '#1a2a6c' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#1a2a6c' : '#f3f4f6'};
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminInfo = getAdminInfo();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

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
              to="/building-plans" 
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
          <StatsGrid>
            <StatCard className="stat-card">
              <FaUsers />
              <StatInfo>
                <h3>Total Users</h3>
                <p>157</p>
              </StatInfo>
            </StatCard>

            <StatCard className="stat-card">
              <FaClipboardCheck />
              <StatInfo>
                <h3>Pending Verifications</h3>
                <p>37</p>
              </StatInfo>
            </StatCard>

            <StatCard className="stat-card">
              <FaUsersCog />
              <StatInfo>
                <h3>Active Admins</h3>
                <p>5</p>
              </StatInfo>
            </StatCard>

            <StatCard className="stat-card">
              <FaCalendarAlt />
              <StatInfo>
                <h3>Today's Appointments</h3>
                <p>12</p>
              </StatInfo>
            </StatCard>
          </StatsGrid>

          <TabsContainer>
            <TabButtons>
              <TabButton active>Latest Activity</TabButton>
              <TabButton>Tasks</TabButton>
              <TabButton>Application Review</TabButton>
            </TabButtons>

            <div style={{ padding: '1rem 0' }}>
              <p style={{ color: '#6b7280' }}>No recent activities to display.</p>
            </div>
          </TabsContainer>
        </MainContent>
      </MainWrapper>
    </DashboardContainer>
  );
};

export default AdminDashboard; 