import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';

// Set axios base URL with proper fallback to backend port 10000
const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:10000`;
axios.defaults.baseURL = API_URL;

// Add authorization token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
