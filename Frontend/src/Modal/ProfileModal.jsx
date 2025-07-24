import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordModal from './ForgotPasswordModal.jsx';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';

const ProfileModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { username, setUsername } = useAuth(); 
  const [modalOpen, setModalOpen] = useState(false);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (open) {
      const fetchProfile = async () => {
        try {
          const { data } = await axios.get('http://localhost:4000/auth/profile', {
            withCredentials: true,
          });
          setUserName(data.username || '');
          setEmail(data.email || '');
        } catch (err) {
          console.error('Failed to fetch profile', err);
        }
      };
      fetchProfile();
    }
  }, [open]);

  useEffect(() => {
    if (isNameEditable && usernameRef.current) usernameRef.current.focus();
  }, [isNameEditable]);

  useEffect(() => {
    if (isEmailEditable && emailRef.current) emailRef.current.focus();
  }, [isEmailEditable]);

  const handleSave = async () => {
    try {
      await axios.put(
        'http://localhost:4000/auth/profile/update',
        { username: userName, email },
        { withCredentials: true }
      );
      setUsername(userName); 
      localStorage.setItem('username', userName);
      toast.info('Changes saved!');
      setIsNameEditable(false);
      setIsEmailEditable(false);
      handleClose();
    } 
    catch (error) {
           const errormessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Something went wrong';
            
          toast.error(errormessage);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '80%', sm: '450px', md: '600px' },
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: '#1a1a1a',
          color: '#fff',
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#fff',
            '&:hover': {
              color: '#f44336',
              transform: 'scale(1.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" mb={3}>
          Profile Settings
        </Typography>

        {/* Name Field */}
        <TextField
          fullWidth
          label="Name"
          value={userName}
          inputRef={usernameRef}
          onChange={(e) => setUserName(e.target.value)}
          InputProps={{
            readOnly: !isNameEditable,
            style: { color: '#fff', cursor: isNameEditable ? 'text' : 'default' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setIsNameEditable(true)} sx={{ color: '#f44336' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          sx={{ mb: 2 }}
        />

        {/* Email Field */}
        <TextField
          fullWidth
          label="Email"
          value={email}
          inputRef={emailRef}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            readOnly: !isEmailEditable,
            style: { color: '#fff', cursor: isEmailEditable ? 'text' : 'default' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setIsEmailEditable(true)} sx={{ color: '#f44336' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          sx={{ mb: 3 }}
        />

        {/* Save Button */}
        <Button
          fullWidth
          onClick={handleSave}
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #d32f2f, #b71c1c)',
            color: '#fff',
            fontWeight: 'bold',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c, #7f0000)',
              transform: 'scale(1.03)',
            },
            mb: 1,
          }}
        >
          Save Changes
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setModalOpen(true)}
          sx={{
            borderColor: '#f44336',
            color: '#f44336',
            '&:hover': { backgroundColor: '#2a2a2a' },
          }}
        >
          Forgot Password?
        </Button>

        <ForgotPasswordModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Box>
    </Modal>
  );
};

export default ProfileModal;
