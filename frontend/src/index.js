// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct for React 18
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById('root')); // React 18 root API

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Optional: Measure performance in your app
reportWebVitals(console.log); // Log performance metrics or handle them as needed
