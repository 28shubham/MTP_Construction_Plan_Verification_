import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { logout } from '../../services/auth';
import { 
  FaHome, 
  FaEnvelope, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBars, 
  FaTimes, 
  FaBuilding, 
  FaHistory, 
  FaFileAlt,
  FaChevronDown
} from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const isLoggedIn = localStorage.getItem('token') !== null;
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(() => navigate('/login'));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand - Positioned leftmost */}
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <FaBuilding className="logo-icon" />
            <span>Plan Verification</span>
          </Link>
        </div>

        {/* Spacer to push everything to the right */}
        <div className="navbar-spacer"></div>

        {/* Navigation Links - Now positioned on the right */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <ul className="main-nav">
            <li>
              <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/VerificationImage" className={`nav-link ${isActive('/VerificationImage')}`} onClick={closeMenu}>
                    <FaFileAlt className="nav-icon" />
                    <span>Verify Plans</span>
              </Link>
            </li>
            <li>
                  <Link to="/verification-history" className={`nav-link ${isActive('/verification-history')}`} onClick={closeMenu}>
                    <FaHistory className="nav-icon" />
                    <span>History</span>
              </Link>
            </li>
              </>
            )}
            <li>
              <Link to="/make-pdf" className={`nav-link ${isActive('/make-pdf')}`} onClick={closeMenu}>
                <FaFileAlt className="nav-icon" />
                <span>MAKE PDF</span>
              </Link>
            </li>
          </ul>

          {/* User Section */}
          <div className="user-section">
            {loggedInUser ? (
              <>
                <div className="user-dropdown">
                  <button className="user-dropdown-btn" onClick={toggleDropdown}>
                  <FaUserCircle className="user-icon" />
                  <span className="welcome-text">{loggedInUser}</span>
                    <FaChevronDown className="dropdown-icon" />
                  </button>
                  <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                    <Link to="/profile" className="dropdown-item">My Profile</Link>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                  <FaSignOutAlt className="btn-icon" />
                  <span>Logout</span>
                </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">
                  <FaSignInAlt className="btn-icon" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="signup-btn">
                  <FaUserPlus className="btn-icon" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button className="menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <FaTimes className="menu-icon" /> : <FaBars className="menu-icon" />}
        </button>
      </div>
      <ToastContainer />
    </nav>
  );
}

export default Navbar;
