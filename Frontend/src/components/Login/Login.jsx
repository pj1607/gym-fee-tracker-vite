// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  keyframes,
  useTheme,
  CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ForgotPasswordModal from '../../Modal/ForgotPasswordModal.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';

const API = import.meta.env.VITE_API_URL;

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Gloading, GsetLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    GsetLoading(false);

    const urlParams = new URLSearchParams(window.location.search);
    const hasGoogleParams = urlParams.get('code') || urlParams.get('error');
    if (!hasGoogleParams) {
      GsetLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const trimmedEmail = formData.email.trim();
      const trimmedPassword = formData.password.trim();

      setLoading(true);
      const response = await axios.post(
        `${API}/auth/login`,
        { email: trimmedEmail, password: trimmedPassword },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const { token, username } = response.data.data;
      login(token, username);
      toast.success(`Welcome back, ${username}!`);
      navigate('/user', { replace: true });

    } catch (error) {
      const errormessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Something went wrong';
      toast.error(errormessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    GsetLoading(true);
    try {
      await axios.get(`${API}/auth/ping`, { timeout: 300 });
      window.location.href = `${API}/auth/google`;
    } catch (err) {
      setTimeout(() => {
        window.location.href = `${API}/auth/google`;
      }, 500);
    }
  };

  return (
    <Box>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          backgroundColor: '#1e1e1e',
          borderRadius: 3,
          color: 'white',
          animation: `${fadeIn} 0.4s ease-out`,
        }}
      >
        <Typography variant="h5" mb={3} align="center" fontWeight="bold">
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#aaa' } }}
            sx={{
              input: { backgroundColor: '#2c2c2c' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '& input': {
                  color: 'white',
                  backgroundColor: '#2c2c2c',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #2c2c2c inset',
                  WebkitTextFillColor: 'white',
                  caretColor: 'white',
                },
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              style: { color: 'white' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'white' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { color: '#aaa' } }}
            sx={{
              input: { backgroundColor: '#2c2c2c' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              background: 'linear-gradient(45deg, #d32f2f, #b71c1c)',
              color: '#fff',
              fontWeight: 'bold',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(45deg, #b71c1c, #7f0000)',
                transform: 'scale(1.03)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={26} sx={{ color: 'white' }} />
            ) : (
              'LOGIN'
            )}
          </Button>

          {/* OR Divider */}
          <Box mt={2} display="flex" alignItems="center" justifyContent="center">
            <Box sx={{ height: '1px', backgroundColor: '#444', flex: 1, mx: 2 }} />
            <Typography variant="body2" color="#aaa">or</Typography>
            <Box sx={{ height: '1px', backgroundColor: '#444', flex: 1, mx: 2 }} />
          </Box>

          {/* Google Button */}
          <Button
            onClick={handleGoogleLogin}
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: '#fff',
              color: '#333',
              borderRadius: '6px',
              px: 3,
              py: 1.2,
              width: '100%',
              maxWidth: '320px',
              mx: 'auto',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              border: '1px solid #ccc',
              fontWeight: '500',
              fontSize: '14px',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              '&:hover': {
                backgroundColor: '#f1f1f1',
              },
            }}
            disabled={Gloading}
          >
            {Gloading ? (
              <CircularProgress size={22} sx={{ color: '#333' }} />
            ) : (
              <>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: 20 }}
                />
                Continue with Google
              </>
            )}
          </Button>
        </form>

        <Button
          onClick={() => setModalOpen(true)}
          sx={{
            mt: 2,
            textTransform: 'none',
            color: '#1976d2',
            fontSize: '14px',
            display: 'block',
            mx: 'auto',
          }}
        >
          Forgot Password?
        </Button>

        <ForgotPasswordModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Paper>
    </Box>
  );
};

export default Login;
