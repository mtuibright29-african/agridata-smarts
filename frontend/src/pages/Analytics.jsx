import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const cropHealthData = [
  { day: 'Jum', score: 75 },
  { day: 'Jtt', score: 80 },
  { day: 'Lun', score: 82 },
  { day: 'Mse', score: 88 },
  { day: 'Alh', score: 85 },
  { day: 'Ijm', score: 87 }
];

const priceTrendData = [
  { day: 'Jum', price: 2100 },
  { day: 'Jtt', price: 2200 },
  { day: 'Lun', price: 2300 },
  { day: 'Mse', price: 2500 },
  { day: 'Alh', price: 2450 },
  { day: 'Ijm', price: 2600 }
];

function Analytics() {
  return (
    <Box sx={{ py: 4, bgcolor: '#f5f7f3', minHeight: '100vh' }}>
      <Container>
        <Typography variant="h4" gutterBottom>Takwimu Zangu</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Mapendekezo ya Mbolea</Typography>
                <Typography variant="body1">Shamba lako lina afya nzuri; ongeza mbolea ya nitrojeni sehemu iliyo na ukuaji mdogo ili kuongeza uzalishaji.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Hali ya Hewa</Typography>
                <Typography variant="body1">Mvua inapangwa ndani ya siku 5. Pendekezo: panga umwagilia asubuhi kabla ya joto kuu.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Bei ya Soko</Typography>
                <Typography variant="body1">Bei ya sasa ya reja reja ya mananasi ni TZS 2,500/kg.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Afya ya Mimea (Wiki 6)</Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={cropHealthData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Trend ya Bei ya Soko</Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={priceTrendData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFB300" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FFB300" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#FF9800" fillOpacity={1} fill="url(#priceGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Analytics;
