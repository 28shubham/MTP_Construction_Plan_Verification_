import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaUserShield, 
  FaClipboardCheck, 
  FaUsers, 
  FaFileAlt,
  FaChartLine,
  FaCog,
  FaHistory,
  FaUserPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaComments,
  FaTools
} from 'react-icons/fa';
import { getAdminInfo } from '../services/adminService';
import AdminDashboardLayout from '../components/AdminDashboardLayout';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f8fafc;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
  border-radius: 20px;
  padding: 4rem;
  margin-bottom: 4rem;
  color: white;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(26, 42, 108, 0.15);
`;

const HeroContent = styled.div`
  h1 {
    font-size: 3rem;
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    font-weight: 700;
  }

  p {
    font-size: 1.2rem;
    margin: 0;
    opacity: 0.9;
    line-height: 1.8;
  }
`;

const AdminFeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const AdminFeatureCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  svg {
    font-size: 2.5rem;
    color: #1a2a6c;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #1a2a6c;
    margin: 0 0 1rem 0;
  }

  p {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }
`;

const QuickActionsSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 4rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  color: #1a2a6c;
  padding: 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #1a2a6c;
    color: white;
    transform: translateY(-3px);
  }

  svg {
    font-size: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #1a2a6c;
  margin: 0 0 2rem 0;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #1a2a6c, #2a4858);
    border-radius: 2px;
  }
`;

const AdminDashboard = () => {
  const adminInfo = getAdminInfo();

  return (
    <AdminDashboardLayout>
    <DashboardContainer>
        <HeroSection>
          <HeroContent>
            <h1>Construction Plan Verification Admin Portal</h1>
            <p>
              Comprehensive administrative control center for managing construction plan verifications, user accounts, and system operations.
            </p>
          </HeroContent>
        </HeroSection>

        <AdminFeaturesGrid>
          <AdminFeatureCard>
            <FaClipboardCheck />
            <h3>Plan Verification Management</h3>
            <p>
              - Review submitted construction plans
              - Verify compliance with regulations
              - Approve or reject submissions
              - Track verification status
              - Set verification parameters
            </p>
          </AdminFeatureCard>

          <AdminFeatureCard>
            <FaUsers />
            <h3>User Administration</h3>
            <p>
              - Manage user accounts and profiles
              - Control access permissions
              - Handle user verification requests
              - Monitor user activities
              - Manage architect registrations
            </p>
          </AdminFeatureCard>

          <AdminFeatureCard>
            <FaChartLine />
            <h3>System Analytics</h3>
            <p>
              - Track verification statistics
              - Monitor system performance
              - Generate usage reports
              - Analyze verification trends
              - Review processing times
            </p>
          </AdminFeatureCard>

          <AdminFeatureCard>
            <FaTools />
            <h3>Technical Operations</h3>
            <p>
              - Configure system settings
              - Manage verification rules
              - Update building codes
              - Set compliance parameters
              - Maintain verification standards
            </p>
          </AdminFeatureCard>

          <AdminFeatureCard>
            <FaComments />
            <h3>Communication Center</h3>
            <p>
              - Send notifications
              - Respond to queries
              - Manage feedback
              - Issue announcements
              - Handle support requests
            </p>
          </AdminFeatureCard>

          <AdminFeatureCard>
            <FaHistory />
            <h3>Audit & History</h3>
            <p>
              - View verification history
              - Track admin actions
              - Monitor system changes
              - Review user activities
              - Generate audit reports
            </p>
          </AdminFeatureCard>
        </AdminFeaturesGrid>

        <QuickActionsSection>
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionButtons>
            <ActionButton to="/admin/verifications">
              <FaFileAlt />
              Review Plans
            </ActionButton>
            <ActionButton to="/admin/users">
              <FaUsers />
              Manage Users
            </ActionButton>
            <ActionButton to="/admin/verification-rules">
              <FaTools />
              Verification Rules
            </ActionButton>
            <ActionButton to="/admin/history">
              <FaHistory />
              View History
            </ActionButton>
            <ActionButton to="/admin/register">
              <FaUserPlus />
              Add Admin
            </ActionButton>
            <ActionButton to="/admin/notifications">
              <FaComments />
              Notifications
            </ActionButton>
          </ActionButtons>
        </QuickActionsSection>

        <QuickActionsSection>
          <SectionTitle>Verification Actions</SectionTitle>
          <ActionButtons>
            <ActionButton to="/admin/pending-verifications">
              <FaClipboardCheck />
              Pending Verifications
            </ActionButton>
            <ActionButton to="/admin/approved-plans">
              <FaCheckCircle />
              Approved Plans
            </ActionButton>
            <ActionButton to="/admin/rejected-plans">
              <FaTimesCircle />
              Rejected Plans
            </ActionButton>
            <ActionButton to="/admin/verification-settings">
              <FaCog />
              Verification Settings
            </ActionButton>
          </ActionButtons>
        </QuickActionsSection>
    </DashboardContainer>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard; 