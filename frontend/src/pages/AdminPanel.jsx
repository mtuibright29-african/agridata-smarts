import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Button, Alert } from '@mui/material';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const loadData = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Imeshindikana kupakua data ya admin.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId, role) => {
    setError('');
    setSuccess('');
    try {
      await axios.patch(
        `/api/admin/user/${userId}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Jukumu la mtumiaji limebadilishwa.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Imeshindikana kubadilisha jukumu.');
    }
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#eef7ee' }}>
      <Container>
        <Typography variant="h4" gutterBottom>Paneli ya Msimamizi</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Watumiaji Wote</Typography>
                <Typography variant="h3">{stats?.totalUsers ?? '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Wakulima</Typography>
                <Typography variant="h3">{stats?.farmers ?? '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Wanunuzi</Typography>
                <Typography variant="h3">{stats?.buyers ?? '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h5" gutterBottom>Orodha ya Watumiaji</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Jina</TableCell>
                <TableCell>Simu</TableCell>
                <TableCell>Jukumu</TableCell>
                <TableCell>Vitendo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user._id, event.target.value)}
                      size="small"
                    >
                      <MenuItem value="farmer">Farmer</MenuItem>
                      <MenuItem value="buyer">Buyer</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="extension_officer">Extension Officer</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button sx={{ mt: 2 }} variant="contained" onClick={loadData}>Reload</Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AdminPanel;
