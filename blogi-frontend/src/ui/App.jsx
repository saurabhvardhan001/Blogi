import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Login from './Login';
import Register from './Register';
import Editor from './Editor';
import History from './History';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const logout = () => { localStorage.removeItem('token'); 
    window.dispatchEvent(new Event('auth:change'));
    navigate('/login'); };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{color:'#fff', textDecoration:'none'}}>Blogi</Link>
        </Typography>
        {token ? (
          <>
            <Button color="inherit" component={Link} to="/editor">Editor</Button>
            <Button color="inherit" component={Link} to="/history">History</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

const Private = ({children}) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App(){
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editor" element={<Private><Editor /></Private>} />
        <Route path="/history" element={<Private><History /></Private>} />
        <Route path="/" element={<Navigate to="/editor" />} />
      </Routes>
    </>
  );
}