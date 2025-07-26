
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
   keyframes,
  useTheme,CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {toast} from 'react-toastify';
import axios from "axios";
import { useAuth } from '../../context/AuthContext.jsx';
const API = import.meta.env.VITE_API_URL;

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;


const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
  

  const theme = useTheme();
    const navigate = useNavigate();
      const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
     e.preventDefault();

try {
  const trimmedEmail = formData.email.trim();
const trimmedUsername = formData.username.trim();

 setLoading(true);
    const response = await axios.post(
       `${API}/auth/signup`,
       {
  email: trimmedEmail,
  username: trimmedUsername,
  password: formData.password,
},
      { headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Send token from localStorage
  } }
    );

    const { token, username } = response.data.data;
      login(token, username);
      toast.success(`Welcome, ${username}!`);
      navigate('/user', { replace: true });

  } catch (error) {
   
    const errormessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Something went wrong';

    toast.error(errormessage);
  }
  finally {
    setLoading(false); 
  }
  };

  return (
     
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
      <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
        Register
      </Typography>

      <form onSubmit={handleSignup}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          sx={{
            input: { color: 'white', backgroundColor: '#2c2c2c' },
            label: { color: '#aaa' },
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
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          sx={{
            input: { color: 'white', backgroundColor: '#2c2c2c' },
            label: { color: '#aaa' },
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
          sx={{
            input: { color: 'white', backgroundColor: '#2c2c2c' },
            label: { color: '#aaa' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#444' },
            },
          }}
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
        />

       <Button                 type="submit"
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
                                   {loading ?  <CircularProgress size={26}sx={{color: 'white', }}/> : 'REGISTER'}
                                </Button>
                                {/* <Box
  mt={2}
  display="flex"
  alignItems="center"
  justifyContent="center"
>
  <Box
    sx={{
      height: '1px',
      backgroundColor: '#444',
      flex: 1,
      mx: 2,
    }}
  />
  <Typography variant="body2" color="#aaa">or</Typography>
  <Box
    sx={{
      height: '1px',
      backgroundColor: '#444',
      flex: 1,
      mx: 2,
    }}
  />
</Box> */}

{/* Google Sign In Button */}
{/* <a href={`${API}/auth/google`} style={{ textDecoration: 'none' }}>
  <Box
    mt={3}
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
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
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#f1f1f1',
      }
    }}
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      style={{ width: 20, marginRight: 12 }}
    />
    Register with Google
  </Box>
</a> */}

      </form>
    </Paper>
  );
};

export default Signup;
