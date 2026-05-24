// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import pages (we'll create these)
import LandingPage from './pages/LandingPage';
import FarmerDashboard from './pages/FarmerDashboard';
import Marketplace from './pages/Marketplace';
import Chatbot from './pages/Chatbot';
import AdminPanel from './pages/AdminPanel';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

// Swahili theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green for agriculture
      light: '#60AD5E',
      dark: '#005005',
    },
    secondary: {
      main: '#FF9800', // Orange for pineapple
    },
    background: {
      default: '#F5F5DC', // Light earthy tone
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
          <Route path="/chatbot" element={<Chatbot />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            isAuthenticated ? <FarmerDashboard /> : <Navigate to="/login" />
          } />
          <Route path="/marketplace" element={
            isAuthenticated ? <Marketplace /> : <Navigate to="/login" />
          } />
          <Route path="/analytics" element={
            isAuthenticated ? <Analytics /> : <Navigate to="/login" />
          } />
          <Route path="/admin" element={
            isAuthenticated && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;