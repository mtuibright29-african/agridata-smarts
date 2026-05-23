import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography } from '@mui/material';

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
                <Typography variant="body1">Shamba lako lina talanta nzuri; ungeweza kuongeza mbolea ya nitrojeni kwa sehemu ya masharti.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Hali ya Hewa</Typography>
                <Typography variant="body1">Mvua inapangwa ndani ya siku 5. Pendekezo: panga umwagilia kabla ya mapema asubuhi.</Typography>
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
        </Grid>
      </Container>
    </Box>
  );
}

export default Analytics;
