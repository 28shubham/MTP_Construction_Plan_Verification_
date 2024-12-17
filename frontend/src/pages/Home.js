import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from "../utils";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar"; // Import Navbar component
import Body from "./components/Body"; // Import Navbar component
import VerificationForm from "./VerificationForm";
function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [products, setProducts] = useState([]); // Initialize with an empty array
  const navigate = useNavigate();
  // Function to verify token with backend
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  };

  // Fetch the logged-in user from local storage
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  // Handle logout and redirect to login page
  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const url = "http://localhost:8080/products";
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const response = await fetch(url, headers);
      const result = await response.json();

      // Ensure that result is an array before setting products
      if (Array.isArray(result)) {
        setProducts(result);
      } else {
        setProducts([]); // Fallback to an empty array if not an array
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Add the Navbar at the top of your Home page */}
      <Navbar />
      <Body />
      {/* <span>
        <Link to="/VerificationForm ">Go to Verification by User Input</Link>
      </span> */}

      {/* Home page content
      <h1>{loggedInUser}</h1> */}
      {/* <button onClick={handleLogout}>Log Out</button> */}
      <div>
        {products.length > 0 ? (
          products.map((item, index) => (
            <ul key={index}>
              <span>
                {item.name}: {item.price}
              </span>
            </ul>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
