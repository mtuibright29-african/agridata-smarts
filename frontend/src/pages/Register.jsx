import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Link as MuiLink, CircularProgress } from '@mui/material';
import axios from 'axios';

function Register({ setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [consentOpen, setConsentOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    // Frontend validation
    if (!name.trim()) {
      setError('Jina kamili ni lazima');
      return;
    }
    
    if (!phoneNumber.trim()) {
      setError('Nambari ya simu ni lazima');
      return;
    }
    
    if (!password.trim()) {
      setError('Nywila ni lazima');
      return;
    }
    
    if (password.length < 4) {
      setError('Nywila lazima iwe na angalau herufi 4');
      return;
    }
    
    if (!accepted) {
      setError('Tafadhali kukubali sera ya faragha kabla ya kujiandikisha.');
      return;
    }
    
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 
      const response = await axios.post(`${API_URL}/api/auth/register`, { 
        name: name.trim(), 
        phoneNumber: phoneNumber.trim(), 
        password: password.trim()
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('phoneNumber', user.phoneNumber);
      setIsAuthenticated?.(true);
      setUserRole?.(user.role);
      setSuccess('Kusajili kumefanikiwa! Dirisha linafungwa...');
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Imeshindikana kusajili. Jaribu tena.';
      setError(errorMsg);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: '#eef7ee' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Jiunge na AgriData</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Jina kamili"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              disabled={loading}
              placeholder="Jina lako kamili"
            />
            <TextField
              label="Nambari ya simu"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              fullWidth
              disabled={loading}
              placeholder="0987657655"
            />
            <TextField
              label="Nywila"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              disabled={loading}
              placeholder="Angalau herufi 4"
            />
            
            <FormControlLabel
              control={<Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)} disabled={loading} />}
              label={<span>Ninakubali <MuiLink component="button" onClick={() => setConsentOpen(true)} disabled={loading}>sera ya faragha</MuiLink></span>} 
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={loading}
              sx={{ position: 'relative' }}
            >
              {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : ''}
              {loading ? 'Inasajili...' : 'Jisajili'}
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Tayari una akaunti? <Link to="/login">Ingia hapa</Link>
          </Typography>
        </Paper>
      </Container>
      
      <Dialog open={consentOpen} onClose={() => setConsentOpen(false)} fullWidth>
        <DialogTitle>Sera ya Faragha - AgriData Smarts</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Tunakusanya data za shamba (sensa, picha, ripoti za wakulima) ili kutoa ushauri na kusaidia upatikanaji wa huduma kama mikopo na masoko. Data yako ni yako; tutaitumia kwa huduma ulizoz[...]
          </Typography>
          <Typography variant="caption">Kwa maswali zaidi tuma barua pepe: agridatasmart@gmail.com</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConsentOpen(false)}>Funga</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Register;
