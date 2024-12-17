import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../../utils';
import './Navbar.css'; // If you want to include styles

function Navbar() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const navigate = useNavigate();

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Verification-WebApp</h2>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {/* <li><Link to="/verification">Verification</Link></li> */}
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {/* If the user is logged in, show the logout button */}
        {loggedInUser ? (
          <>
            <li><span>Welcome, {loggedInUser}</span></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
      <ToastContainer />
    </nav>
  );
}

export default Navbar;
