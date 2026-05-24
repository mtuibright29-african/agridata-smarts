// frontend/src/pages/FarmerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, IconButton, Drawer, Box, List, ListItem, ListItemIcon, 
  ListItemText, Container, Grid, Card, CardContent, Button, Avatar, Badge 
} from '@mui/material';
import { 
  Menu, Dashboard, Storefront, Chat, BarChart, Logout, Agriculture, 
  Notifications, Person, WhatsApp 
} from '@mui/icons-material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

const drawerWidth = 240;

function FarmerDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [farmerData, setFarmerData] = useState({
    name: 'Juma Abdallah',
    farmSize: '2.5',
    cropType: 'Mananasi (Pineapples)',
    healthScore: 85,
    lastAdvisory: 'Kumwagilia maji leo asubuhi'
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Bei ya mananasi imepanda hadi TZS 2,500 kwa kilo', read: false },
    { id: 2, message: 'Hali ya hewa: Mvua inatarajiwa kesho', read: false }
  ]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const farmTrendData = [
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
          <Typography variant="h4" gutterBottom>Karibu, {farmerData.name}!</Typography>
          <Typography variant="subtitle1" gutterBottom>Shamba lako: Chalinze, Kilimo Cha Mananasi</Typography>
          
          <Grid container spacing={3}>
            {/* Farm Health Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Agriculture sx={{ fontSize: 40, color: '#2E7D32' }} />
                  <Typography variant="h6">Afya ya Shamba</Typography>
                  <Typography variant="h3" fontWeight="bold">{farmerData.healthScore}%</Typography>
                  <Typography variant="body2" color="textSecondary">Ina afya nzuri</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Last Advisory Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Chat sx={{ fontSize: 40, color: '#FF9800' }} />
                  <Typography variant="h6">Ushauri wa Mwisho</Typography>
                  <Typography variant="body1">{farmerData.lastAdvisory}</Typography>
                  <Button size="small" onClick={() => navigate('/chatbot')}>Pata Ushauri Zaidi</Button>
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
                  <Typography variant="body2">Bei ya sasa kwa kilo</Typography>
                  <Button size="small" variant="contained" color="primary" onClick={() => navigate('/marketplace')}>Uza Sasa</Button>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Moisture Trend */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Trend ya Umwagiliaji</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={farmTrendData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[60, 90]} />
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
                  <Typography variant="h6">Shughuli za Hivi Karibuni</Typography>
                  <List>
                    <ListItem>✅ Umeripoti mimea yako - 3 days ago</ListItem>
                    <ListItem>✅ Umepokea ushauri wa mbolea - 5 days ago</ListItem>
                    <ListItem>🔄 Ukusanyaji wa mananasi unakaribia - 2 weeks</ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default FarmerDashboard;