// src/App.test.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import for React 18
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div); // Create a root for React 18
  root.render(<App />); // Render using the new API
});