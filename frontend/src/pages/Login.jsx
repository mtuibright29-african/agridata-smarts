import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import axios from 'axios';

function Login({ setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/login', { phoneNumber, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('phoneNumber', user.phoneNumber);
      setIsAuthenticated?.(true);
      setUserRole?.(user.role);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Taarifa za kuingia hazikufanikiwa.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: '#eef7ee' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4 }}> 
          <Typography variant="h5" gutterBottom>Ingia kwa AgriData</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Nambari ya simu"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Nywila"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ingia
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Huna akaunti? <Link to="/register">Jisajili hapa</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
