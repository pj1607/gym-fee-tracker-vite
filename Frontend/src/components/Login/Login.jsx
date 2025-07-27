import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInAppBrowser = /FBAN|FBAV|Instagram|LinkedIn|Twitter|Messenger/i.test(ua);
    setInAppBrowser(isInAppBrowser);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, formData, {
        withCredentials: true,
      });

      login(); // Update context
      toast.success('Login successful!');
      navigate('/user');
    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 3,
        borderRadius: 2,
        backgroundColor: 'white',
        boxShadow: 3,
      }}
      component={Paper}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Login to Gym Fee Tracker
      </Typography>

      {inAppBrowser && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: '#2c2c2c',
            borderRadius: 2,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            ⚠️ Google Login is not supported in in-app browsers (Instagram, Facebook, LinkedIn, Twitter).
          </Typography>
          <Typography variant="body2">
            You can use email & password below or open in Chrome/Safari for Google login.
          </Typography>
        </Box>
      )}

      {/* Email & Password Login Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>or</Divider>

      {/* Google Login Button (hidden in in-app browsers) */}
      {!inAppBrowser && (
        <a href={`${API}/auth/google`} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              backgroundColor: '#4285F4',
              color: 'white',
              p: 1.2,
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#357ae8',
              },
            }}
          >
            Sign in with Google
          </Box>
        </a>
      )}
    </Box>
  );
};

export default Login;
