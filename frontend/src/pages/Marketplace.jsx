import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newListing, setNewListing] = useState({ cropType: '', quantityKg: '', pricePerKg: '', description: '' });
  const [success, setSuccess] = useState('');

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/market/listings');
      setListings(response.data);
    } catch (err) {
      setError('Imeshindikana kupakua soko.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleCreateListing = async (event) => {
    event.preventDefault();
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/market/sell',
        {
          cropType: newListing.cropType,
          quantityKg: Number(newListing.quantityKg),
          pricePerKg: Number(newListing.pricePerKg),
          description: newListing.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess('Orodha imeundwa kwa mafanikio.');
      setNewListing({ cropType: '', quantityKg: '', pricePerKg: '', description: '' });
      loadListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Haikuwezekana kuunda orodha.');
    }
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#f4f9f2' }}>
      <Container>
        <Typography variant="h4" gutterBottom>Marketplace ya AgriData</Typography>
        <Typography variant="subtitle1" gutterBottom>Angalia bidhaa za wakulima wa Tanzania au uanze kuuza sasa.</Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {listings.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{item.cropType}</Typography>
                    <Typography sx={{ mb: 1 }}>{item.farmerName} - {item.location}</Typography>
                    <Typography>Wingi: {item.quantityKg} kg</Typography>
                    <Typography>Bei: TZS {item.pricePerKg} / kg</Typography>
                    <Typography>{item.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box component="form" onSubmit={handleCreateListing} sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h5" gutterBottom>Unda Orodha Ya Uuzaji</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Aina ya mazao"
                value={newListing.cropType}
                onChange={(e) => setNewListing({ ...newListing, cropType: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Kiasi (kg)"
                type="number"
                value={newListing.quantityKg}
                onChange={(e) => setNewListing({ ...newListing, quantityKg: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Bei kwa kilo"
                type="number"
                value={newListing.pricePerKg}
                onChange={(e) => setNewListing({ ...newListing, pricePerKg: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Maelezo"
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">Tuma Orodha</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Marketplace;
