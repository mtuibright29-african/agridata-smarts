// frontend/src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent, IconButton } from '@mui/material';
import { WhatsApp, Instagram, YouTube, Agriculture, DataUsage, Chat, Storefront } from '@mui/icons-material';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🍍 AgriData Smarts
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>Ingia</Button>
          <Button variant="contained" color="secondary" onClick={() => navigate('/register')} sx={{ ml: 1 }}>
            Jiunge
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: '#2E7D32', color: 'white', py: 8, textAlign: 'center' }}>
        <Box>
          <Container>
            <Typography variant="h2" gutterBottom fontWeight="bold">
              Data Driven. Smarter Farming. Better Future.
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Kilimo Cha Kisasa kwa Wakulima wa Tanzania
            </Typography>
            <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/register')}>
              Anza Sasa - Bure!
            </Button>
          </Container>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold">
          Tunakusaidia Kwa Njia Hizi
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
              <Agriculture sx={{ fontSize: 60, color: '#2E7D32' }} />
              <Typography variant="h5" gutterBottom>Ushauri wa Kilimo</Typography>
              <Typography>Pata ushauri wa kitaalam wa kilimo cha mananasi na mazao mengine</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
              <DataUsage sx={{ fontSize: 60, color: '#2E7D32' }} />
              <Typography variant="h5" gutterBottom>AI Analytics</Typography>
              <Typography>AI inachambua shamba lako na kukupa mapendekezo</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
              <Chat sx={{ fontSize: 60, color: '#2E7D32' }} />
              <Typography variant="h5" gutterBottom>Chatbot Kwa Kiswahili</Typography>
              <Typography>Wasiliana nasi kwa WhatsApp kwa lugha ya Kiswahili</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
              <Storefront sx={{ fontSize: 60, color: '#2E7D32' }} />
              <Typography variant="h5" gutterBottom>Soko La Dijitali</Typography>
              <Typography>Uza mananasi yako moja kwa moja kwa wanunuzi</Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Data Collection & Trust Section */}
      <Container sx={{ py: 6, bgcolor: '#fff9f0', mt: 4 }}> 
        <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold">
          Jinsi Tunavyokusanya Data
        </Typography>
        <Typography textAlign="center" sx={{ mb: 2 }}>
          Tunakusanya data kwa njia nyingi: sensa za udongo, vichunguzi vya hewa, picha za drone, ripoti za wakulima na soko la bei kwa wakati halisi. Data zako zinatumika kutoa ushauri, kuongeza thamani ya mazao, na kusaidia upatikanaji wa mikopo kwa wakulima.
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Sensa & IoT</Typography>
              <Typography variant="body2">Sensa za udongo na vituo vya hali ya hewa vinatoa data za wakati halisi.</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Picha & Satellite</Typography>
              <Typography variant="body2">Drone na satellite hutoa ramani za afya ya mimea na ufuatiliaji wa mashamba.</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Ripoti za Wakulima</Typography>
              <Typography variant="body2">Tunahimiza wakulima kutuma ripoti kupitia app, WhatsApp, au extension officers.</Typography>
            </Card>
          </Grid>
        </Grid>
        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }}>
          Tunahakikisha uwazi na faragha: data yako ni yako — tunaweza kuitumia tu kwa huduma ulizokubali. Sera kamili ya faragha inapatikana kwa kujiandikisha.
        </Typography>
      </Container>

      {/* Social Media Links */}
      <Box sx={{ bgcolor: '#1B5E20', color: 'white', py: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Tuungane Kwenye Mitandao ya Kijamii</Typography>
        <Box>
          <IconButton href="https://whatsapp.com/channel/0029Vb8Dm2265yDAEnzUjm2p" target="_blank" sx={{ color: '#25D366' }}>
            <WhatsApp fontSize="large" />
          </IconButton>
          <IconButton href="https://www.instagram.com/agridata_smart_wakulima" target="_blank" sx={{ color: '#E4405F' }}>
            <Instagram fontSize="large" />
          </IconButton>
          <IconButton component="span" sx={{ color: '#FF0000' }}>
            <YouTube fontSize="large" />
          </IconButton>
          
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Wasiliana nasi: WhatsApp +255 093 653 378 | Email: agridatasmart@gmail.com
        </Typography>
        <Typography variant="caption">
          © 2026 AgriData Smarts - Kuleta Kilimo Cha Kisasa Tanzania
        </Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;