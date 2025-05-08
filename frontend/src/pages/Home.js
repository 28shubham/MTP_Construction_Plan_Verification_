import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar"; // Import Navbar component
import Body from "./components/Body"; // Import Body component
import "./Home.css"; // Import Home styles
import { isAuthenticated } from "../services/auth"; // Import auth service

function Home() {
  const navigate = useNavigate();

  // Verify token on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="main-content">
        {/* Add spacing between Navbar and Body */}
        <div style={{ marginTop: "20px" }}>
          <Body />
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}

export default Home;
