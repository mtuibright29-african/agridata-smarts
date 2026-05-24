import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Link as MuiLink } from '@mui/material';
import axios from 'axios';

function Register({ setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [consentOpen, setConsentOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (!accepted) return setError('Tafadhali kukubali sera ya faragha kabla ya kujiandikisha.');
      const response = await axios.post('/api/auth/register', { name, phoneNumber, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('phoneNumber', user.phoneNumber);
      setIsAuthenticated?.(true);
      setUserRole?.(user.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Imeshindikana kusajili. Jaribu tena.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: '#eef7ee' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Jiunge na AgriData</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Jina kamili"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
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
              Jisajili
            </Button>
            <Button variant="text" onClick={() => setConsentOpen(true)} sx={{ mt: 1 }}>
              Soma sera ya faragha
            </Button>
            <FormControlLabel
              control={<Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />}
              label={<span>Ninakubali <MuiLink component="button" onClick={() => setConsentOpen(true)}>sera ya faragha</MuiLink></span>} />
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
            Tunakusanya data za shamba (sensa, picha, ripoti za wakulima) ili kutoa ushauri na kusaidia upatikanaji wa huduma kama mikopo na masoko. Data yako ni yako; tutaitumia kwa huduma ulizoziomba na kwa makusanyo yaliyokubaliwa. Tutahifadhi usiri na kutoa chaguo la kufuta data yako kwa mawasiliano.
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
