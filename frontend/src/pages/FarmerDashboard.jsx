// frontend/src/pages/FarmerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, IconButton, Drawer, Box, List, ListItem, ListItemIcon, 
  ListItemText, Container, Grid, Card, CardContent, Button, Avatar, Badge,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { 
  Menu, Dashboard, Storefront, Chat, BarChart, Logout, Agriculture, 
  Notifications, Person, WhatsApp, Add
} from '@mui/icons-material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

const drawerWidth = 240;

function FarmerDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  
  const [farmerData, setFarmerData] = useState({
    name: 'Mkulima',
    farmSize: 'N/A',
    cropType: 'Mananasi',
    healthScore: 85,
    lastAdvisory: 'Pakia picha ya mmea wako au weka rekodi ya sensor kupata ushauri'
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Bei ya sasa ya mananasi ni TZS 2,500 kwa kilo', read: false },
    { id: 2, message: 'Hali ya hewa: Upepo mwanana leo, hakuna uwezekano wa mvua kubwa', read: false }
  ]);

  // Modal state for logging new data
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [submittingLog, setSubmittingLog] = useState(false);
  const [logForm, setLogForm] = useState({
    cropType: 'Mananasi',
    soilMoisture: '',
    soilPH: '',
    temperature: '',
    rainfall: '',
    yieldKg: '',
    diseaseDetected: ''
  });
  const [logError, setLogError] = useState('');
  const [logSuccess, setLogSuccess] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const [profileRes, dataRes] = await Promise.all([
        axios.get('/api/farmers/profile', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/farmers/data', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProfile(profileRes.data);
      setRecords(dataRes.data);
      
      const name = profileRes.data.name || 'Mkulima';
      const farmSize = profileRes.data.farmSize || '2.5';
      const cropType = profileRes.data.crops?.[0]?.cropType || 'Mananasi (Pineapples)';
      
      let healthScore = 85;
      let lastAdvisory = 'Kumwagilia maji leo asubuhi. Piga picha ya mmea kupata ushauri wa AI.';
      
      if (dataRes.data.length > 0) {
        const latest = dataRes.data[0];
        if (latest.aiAnalysis?.healthScore) {
          healthScore = latest.aiAnalysis.healthScore;
        } else if (latest.soilMoisture) {
          // Fallback scoring logic
          const score = Math.max(40, 100 - Math.abs(latest.soilMoisture - 50));
          healthScore = score;
        }
        
        if (latest.aiAnalysis?.recommendations?.length > 0) {
          lastAdvisory = latest.aiAnalysis.recommendations[0];
        } else if (latest.diseaseDetected) {
          lastAdvisory = latest.diseaseDetected;
        }
      }
      
      setFarmerData({
        name,
        farmSize: farmSize.toString(),
        cropType,
        healthScore,
        lastAdvisory
      });
      
    } catch (err) {
      console.error(err);
      setError('Imeshindikana kupakua data ya shamba.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setLogError('');
    setLogSuccess('');
    setSubmittingLog(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/farmers/data', {
        cropType: logForm.cropType,
        soilMoisture: logForm.soilMoisture ? Number(logForm.soilMoisture) : undefined,
        soilPH: logForm.soilPH ? Number(logForm.soilPH) : undefined,
        temperature: logForm.temperature ? Number(logForm.temperature) : undefined,
        rainfall: logForm.rainfall ? Number(logForm.rainfall) : undefined,
        yieldKg: logForm.yieldKg ? Number(logForm.yieldKg) : undefined,
        diseaseDetected: logForm.diseaseDetected || 'Hakuna ugonjwa uliogunduliwa'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLogSuccess('Rekodi imehifadhiwa kwa mafanikio!');
      setLogForm({
        cropType: 'Mananasi',
        soilMoisture: '',
        soilPH: '',
        temperature: '',
        rainfall: '',
        yieldKg: '',
        diseaseDetected: ''
      });
      setTimeout(() => {
        setLogDialogOpen(false);
        setLogSuccess('');
        fetchDashboardData();
      }, 1500);
    } catch (err) {
      setLogError(err.response?.data?.message || 'Imeshindikana kuhifadhi rekodi. Hakikisha umejaza maelezo sahihi.');
    } finally {
      setSubmittingLog(false);
    }
  };

  const farmTrendData = records.length > 0 
    ? [...records].reverse().slice(-10).map((record, index) => {
        const d = new Date(record.createdAt);
        return {
          name: record.createdAt ? `${d.getDate()}/${d.getMonth()+1}` : `Siku ${index + 1}`,
          moisture: record.soilMoisture || 0
        };
      })
    : [
        { name: 'Wiki 1', moisture: 68 },
        { name: 'Wiki 2', moisture: 72 },
        { name: 'Wiki 3', moisture: 78 },
        { name: 'Wiki 4', moisture: 82 },
        { name: 'Wiki 5', moisture: 80 },
        { name: 'Wiki 6', moisture: 84 }
      ];

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Soko (Marketplace)', icon: <Storefront />, path: '/marketplace' },
    { text: 'Chatbot (Msaada)', icon: <Chat />, path: '/chatbot' },
    { text: 'Takwimu Zangu', icon: <BarChart />, path: '/analytics' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>🍍 AgriData</Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={logout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Toka" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AgriData Smarts - Chalinze
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/chatbot')}>
            <WhatsApp />
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Person />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {drawer}
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>Karibu, {farmerData.name}!</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Shamba lako: {profile?.location?.region || 'Chalinze'}, Ukubwa: {farmerData.farmSize} ekari, Zao: {farmerData.cropType}
              </Typography>
            </Box>
            <Button variant="contained" color="secondary" startIcon={<Add />} onClick={() => setLogDialogOpen(true)}>
              Weka Rekodi Mpya
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Farm Health Card */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Agriculture sx={{ fontSize: 40, color: '#2E7D32' }} />
                    <Typography variant="h6">Afya ya Shamba</Typography>
                    <Typography variant="h3" fontWeight="bold">{farmerData.healthScore}%</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {farmerData.healthScore > 80 ? 'Ina afya nzuri' : farmerData.healthScore > 60 ? 'Hali ya wastani' : 'Shamba linahitaji umakini'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Last Advisory Card */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Chat sx={{ fontSize: 40, color: '#FF9800' }} />
                    <Typography variant="h6">Ushauri wa Mwisho</Typography>
                    <Typography variant="body1" sx={{ minHeight: '3em', mt: 1 }}>{farmerData.lastAdvisory}</Typography>
                    <Button size="small" onClick={() => navigate('/chatbot')} sx={{ mt: 1 }}>Pata Ushauri Zaidi</Button>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Market Alert Card */}
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: '#FFF3E0' }}>
                  <CardContent>
                    <Storefront sx={{ fontSize: 40, color: '#2E7D32' }} />
                    <Typography variant="h6">Soko Lako</Typography>
                    <Typography variant="h4" fontWeight="bold">TZS 2,500</Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>Bei ya sasa kwa kilo</Typography>
                    <Button size="small" variant="contained" color="primary" onClick={() => navigate('/marketplace')}>Uza Sasa</Button>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Moisture Trend */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Trend ya Umwagiliaji (Unyevu wa Udongo)</Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={farmTrendData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="moisture" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Recent Activity */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Shughuli za Hivi Karibuni</Typography>
                    <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                      {records.slice(0, 4).map((record, idx) => (
                        <ListItem key={record._id || idx} divider={idx < records.length - 1}>
                          <ListItemText 
                            primary={`Rekodi: ${record.cropType} - Unyevu ${record.soilMoisture}%, pH ${record.soilPH || 'N/A'}`} 
                            secondary={`${new Date(record.createdAt).toLocaleDateString()} saa ${new Date(record.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Afya: ${record.aiAnalysis?.healthScore || '85'}%`}
                          />
                        </ListItem>
                      ))}
                      {records.length === 0 && (
                        <ListItem>
                          <ListItemText primary="Hakuna rekodi zilizopatikana." secondary="Bofya 'Weka Rekodi Mpya' juu ili kuingiza data ya sensorer za udongo." />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Dialog for logging new data */}
      <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Weka Rekodi Mpya ya Shamba</DialogTitle>
        <Box component="form" onSubmit={handleLogSubmit}>
          <DialogContent sx={{ display: 'grid', gap: 2.5 }}>
            {logError && <Alert severity="error">{logError}</Alert>}
            {logSuccess && <Alert severity="success">{logSuccess}</Alert>}
            
            <TextField
              select
              label="Aina ya zao"
              value={logForm.cropType}
              onChange={(e) => setLogForm({ ...logForm, cropType: e.target.value })}
              fullWidth
              required
            >
              <MenuItem value="Mananasi">Mananasi (Pineapples)</MenuItem>
              <MenuItem value="Machungwa">Machungwa (Oranges)</MenuItem>
              <MenuItem value="Miembe">Miembe (Mangoes)</MenuItem>
              <MenuItem value="Ndizi">Ndizi (Bananas)</MenuItem>
            </TextField>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Unyevu wa Udongo (%)"
                  type="number"
                  value={logForm.soilMoisture}
                  onChange={(e) => setLogForm({ ...logForm, soilMoisture: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="pH ya Udongo"
                  type="number"
                  inputProps={{ step: "0.1", min: "0", max: "14" }}
                  value={logForm.soilPH}
                  onChange={(e) => setLogForm({ ...logForm, soilPH: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Joto la Udongo (°C)"
                  type="number"
                  value={logForm.temperature}
                  onChange={(e) => setLogForm({ ...logForm, temperature: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Kiwango cha Mvua (mm)"
                  type="number"
                  value={logForm.rainfall}
                  onChange={(e) => setLogForm({ ...logForm, rainfall: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mavuno Tarajiwa / Halisi (kg)"
                  type="number"
                  value={logForm.yieldKg}
                  onChange={(e) => setLogForm({ ...logForm, yieldKg: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ugonjwa au Mabadiliko"
                  placeholder="Hakuna ugonjwa uliogunduliwa"
                  value={logForm.diseaseDetected}
                  onChange={(e) => setLogForm({ ...logForm, diseaseDetected: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setLogDialogOpen(false)} disabled={submittingLog}>Futa</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submittingLog}>
              {submittingLog ? <CircularProgress size={24} /> : 'Hifadhi'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default FarmerDashboard;