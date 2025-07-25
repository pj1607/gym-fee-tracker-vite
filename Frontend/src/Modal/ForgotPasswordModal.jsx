import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,CircularProgress,LinearProgress 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import {toast} from 'react-toastify'
const API = import.meta.env.VITE_API_URL;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '80%', sm: '450px', md: '600px' },
  p: { xs: 2, sm: 3, md: 4 },
  bgcolor: '#1e1e1e',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  color: 'white',
};

const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    try {
      if (step === 1) {
        if (!email) return toast.info('Please enter your email');
        
        setLoading(true);
        await axios.post( `${API}/auth/send-otp`, { email });
        toast.success('OTP sent to your email');
        setStep(2);

      } else if (step === 2) {
        if (!otp) return toast.info('Please enter Otp');

        setLoading(true);
        await axios.post( `${API}/auth/check-otp`, { email, otp });
         toast.success('OTP verified');
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || 'Something went wrong'); 
    }
    finally {
    setLoading(false); 
  }
  };

  const handleSubmit = async () => {
    try {
      if (!newPassword) return toast.info('Please enter a new password');
       
      setLoading(true);
      await axios.post( `${API}/auth/reset-password`, {
        email,
        newPassword,
      });

      toast.success('Password reset successful!');
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to reset password');
    }
    finally {
    setLoading(false); 
  }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
        
      <Box sx={modalStyle}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#fff',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.2)',
              color: '#f44336',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Forgot Password
        </Typography>

        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Button onClick={handleNext} fullWidth variant="contained"  disabled={loading} sx={buttonStyle}>
              {loading ? <CircularProgress size={24} color="white" /> : 'Send OTP'}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={textFieldStyle}
              InputLabelProps={{ style: { color: '#aaa' } }}
            />
           <Button onClick={handleNext} fullWidth variant="contained"  disabled={loading} sx={buttonStyle}>
              {loading ? <CircularProgress size={24} color="white" /> : 'Submit OTP'}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={textFieldStyle}
              InputLabelProps={{ style: { color: '#aaa' } ,'& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                 '& input': {
        color: 'white',
        backgroundColor: '#2c2c2c',
      },  },}}
            />
           <Button onClick={handleSubmit} fullWidth variant="contained"  disabled={loading} sx={buttonStyle}>
              {loading ? <CircularProgress size={24} color="white" /> : 'Reset Password'}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

const textFieldStyle = {
  input: { color: 'white', backgroundColor: '#2c2c2c' },
  label: { color: '#aaa' },
  mt: 1,
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#444' },
  },
};

const buttonStyle = {
  mt: 2,
  background: 'linear-gradient(45deg, #d32f2f, #b71c1c)',
  color: '#fff',
  fontWeight: 'bold',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #b71c1c, #7f0000)',
    transform: 'scale(1.03)',
  },
};

export default ForgotPasswordModal;
