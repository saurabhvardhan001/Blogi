import React, { useState } from 'react';
import api from '../services/api';
import { Container, TextField, Button, Paper, Typography, Stack, Link as MLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const { data } = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      // notify app components that auth changed
      window.dispatchEvent(new Event('auth:change'));
      navigate('/editor');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Invalid credentials';
      setError(msg);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Stack spacing={2}>
          <TextField label="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" onClick={submit}>Login</Button>
          <Typography variant="body2">
            New here? <MLink component={Link} to="/register">Create an account</MLink>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}