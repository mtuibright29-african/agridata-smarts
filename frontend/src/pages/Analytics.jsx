import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/farmers/data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(response.data);
      } catch (err) {
        console.error(err);
        setError('Imeshindikana kupakua takwimu za shamba.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const chartData = [...records].reverse().map((record, index) => {
    const d = new Date(record.createdAt);
    const dateStr = record.createdAt ? `${d.getDate()}/${d.getMonth() + 1}` : `Siku ${index + 1}`;
    
    // Calculate fallback health score if AI analysis was not completed
    let healthScore = record.aiAnalysis?.healthScore;
    if (healthScore === undefined || healthScore === null) {
      healthScore = Math.max(40, 100 - Math.abs((record.soilMoisture || 50) - 50));
    }

    return {
      day: dateStr,
      score: healthScore,
      moisture: record.soilMoisture || 0,
      ph: record.soilPH || 0
    };
  });

  const latestRecord = records[0] || {};
  let fertilizerAdvisory = "Pakia picha au rekodi ya sensor kupata ushauri.";
  if (latestRecord.soilPH) {
    if (latestRecord.soilPH < 5.0) {
      fertilizerAdvisory = "Udongo una asidi nyingi mno. Weka chokaa (lime) ili kuongeza pH na kuruhusu mananasi kufyonza virutubisho.";
    } else if (latestRecord.soilPH > 6.5) {
      fertilizerAdvisory = "pH iko juu kidogo kwa mananasi. Tumia mbolea inayoongeza asidi kama ammonium sulfate.";
    } else {
      fertilizerAdvisory = "pH ya udongo wako iko vizuri sana (5.0 - 6.5). Endelea kutumia mbolea ya NPK kulingana na ratiba.";
    }
  }

  let moistureAdvisory = "Hakuna vipimo vya unyevu.";
  if (latestRecord.soilMoisture) {
    if (latestRecord.soilMoisture < 40) {
      moistureAdvisory = "Unyevu wa udongo uko chini mno (chini ya 40%). Mwagilia maji shamba lako leo asubuhi.";
    } else if (latestRecord.soilMoisture > 80) {
      moistureAdvisory = "Unyevu uko juu sana (zaidi ya 80%). Sitisha umwagiliaji kuzuia uozo wa mizizi.";
    } else {
      moistureAdvisory = "Unyevu wa shamba lako uko katika kiwango bora kabisa. Mwagilia kulingana na hali ya hewa.";
    }
  }

  return (
    <Box sx={{ py: 4, bgcolor: '#f5f7f3', minHeight: '100vh' }}>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Takwimu Zangu za Kilimo</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Ushauri wa Mbolea</Typography>
                    <Typography variant="body1">{fertilizerAdvisory}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Ushauri wa Maji</Typography>
                    <Typography variant="body1">{moistureAdvisory}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', bgcolor: '#FFF3E0' }}>
                  <CardContent>
                    <Typography variant="h6" color="secondary" gutterBottom>Hali ya Soko</Typography>
                    <Typography variant="body1">Bei ya jumla ya mananasi imetulia kwa TZS 1,500 - 2,000/kg. Ni wakati mzuri wa kupanga mavuno.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {records.length === 0 ? (
              <Alert severity="info">Hauna rekodi zozote za shamba bado. Nenda kwenye Dashboard na ubofye "Weka Rekodi Mpya" ili kuona chati zako hapa!</Alert>
            ) : (
              <Grid container spacing={3}>
                {/* Crop Health Chart */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Afya ya Mimea (%)</Typography>
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="score" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Soil Moisture Chart */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Unyevu wa Udongo (%)</Typography>
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="moisture" stroke="#1976d2" fillOpacity={1} fill="url(#moistureGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Soil pH Chart */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>pH ya Udongo (0 - 14)</Typography>
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis domain={[3, 9]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="ph" stroke="#FF9800" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default Analytics;
