 import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
  import axios from 'axios';
  import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API_URL;

const AddMemberModal = ({ open, handleClose}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const today = dayjs().format('DD-MM-YYYY');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await axios.post(
      `${API}/members/add-member`, 
      {
        name: name,
        phone: phone,
        status: 'Paid',
        lastPaidDate: new Date(),
        unpaidFor: 0,
      },
      {
        headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Send token from localStorage
  }, 
      }
    );

    if (res.data.success === 'yes') {
      setName('');
      setPhone('');
      handleClose();
      toast.success("member added sucessfully")
    } else {
      toast.error('Failed to add member.');
    }
  } catch (error) {
         const errormessage =
          error.response.data.error ||
          error.response.data.message ||
          'Something went wrong';

        toast.error(errormessage);
  }
  finally {
    setLoading(false); 
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
    boxShadow: 24,
    borderRadius: 2,
    color: '#fff',
    transition: 'all 0.3s ease-in-out',
        }}
      >
        {/* Close button */}
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

        <Typography variant="h6" mb={2} textAlign="center">
          Add New Member
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            label="Status"
            variant="outlined"
            value="Paid"
            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ readOnly: true,style: { color: '	#ccc' , cursor: 'default',caretColor: 'transparent', } }}
          />
          <TextField
            fullWidth
            label="Last Paid Date"
            variant="outlined"
            value={today}

            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{  readOnly: true,style: { color: '	#ccc' , cursor: 'default',caretColor: 'transparent', } }}
          />
          <TextField
            fullWidth
            label="Unpaid For (Months)"
            variant="outlined"
            value="0"
            sx={{ mb: 3 }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{  readOnly: true,style: { color: '	#ccc' , cursor: 'default',caretColor: 'transparent', } }}
          />

          <Button
            type="submit"
            fullWidth
             disabled={loading}
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
               {loading ?  <CircularProgress size={26}sx={{color: 'white', }}/> : 'Add Member'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddMemberModal;