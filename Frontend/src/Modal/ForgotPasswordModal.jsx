import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';

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
  color: 'white',
};

const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      clearInterval(intervalId);
    }
  }, [timer]);

  const startOtpTimer = () => {
    setTimer(120); 
  };

  const handleNext = async () => {
    try {
      if (step === 1) {
        if (!email) return toast.info('Please enter your email');

      if (!isEmail(email)) {
  return toast.error('Please enter a valid email address');
}
        setLoading(true);
        await axios.post(`${API}/auth/send-otp`, { email });
        toast.success('OTP sent to your email');
        setStep(2);
        startOtpTimer();
      } else if (step === 2) {
        if (!otp) return toast.info('Please enter OTP');
        setLoading(true);
        await axios.post(`${API}/auth/check-otp`, { email, otp });
        toast.success('OTP verified');
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.response?.data?.error||'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!newPassword) return toast.info('Please enter a new password');
      const trimmedEmail = email.trim();
      const trimmedNewPassword = newPassword.trim();
      const trimmedConfirNewPassword = confirmNewPassword.trim();

      if (trimmedNewPassword !== trimmedConfirNewPassword) {
        toast.error('Passwords do not match.');
        return;
      }

      setLoading(true);
      await axios.post(`${API}/auth/reset-password`, {
        email: trimmedEmail,
        newPassword: trimmedNewPassword,
        confirmNewPassword: trimmedConfirNewPassword,
      });

      toast.success('Password reset successful!');
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/auth/send-otp`, { email });
      toast.success('OTP resent successfully');
      startOtpTimer();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowPassword(false);
    setShowConfirm(false);
    setTimer(0);
    clearInterval(intervalId);
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
              type="email"
              autoComplete="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#aaa' } }}
              sx={textFieldStyle}
            />
            <Button onClick={handleNext} fullWidth variant="contained" disabled={loading} sx={buttonStyle}>
              {loading ? <CircularProgress size={26} sx={{ color: 'white' }} /> : 'Send OTP'}
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
            <Button onClick={handleNext} fullWidth variant="contained" disabled={loading} sx={buttonStyle}>
              {loading ? <CircularProgress size={26} sx={{ color: 'white' }} /> : 'Submit OTP'}
            </Button>
            <Button
              onClick={handleResendOtp}
              fullWidth
              disabled={timer > 0 || loading}
              sx={{ mt: 1, color: '#f44336' }}
            >
              {timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP'}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={textFieldStyle}
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              variant="outlined"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              sx={textFieldStyle}
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button onClick={handleSubmit} fullWidth variant="contained" disabled={loading} sx={buttonStyle}>
              {loading ? <CircularProgress size={26} sx={{ color: 'white' }} /> : 'Reset Password'}
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
