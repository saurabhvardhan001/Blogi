import React, { useState } from 'react';
import api from '../services/api';
import { Container, TextField, Button, Paper, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const { data } = await api.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', data.token);
      // notify app components that auth changed (so History can re-fetch)
      window.dispatchEvent(new Event('auth:change'));
      navigate('/editor');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Sign-up failed';
      setError(msg);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Create account</Typography>
        <Stack spacing={2}>
          <TextField label="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" onClick={submit}>Register</Button>
        </Stack>
      </Paper>
    </Container>
  );
}