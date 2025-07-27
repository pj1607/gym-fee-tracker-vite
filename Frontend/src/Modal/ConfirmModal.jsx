import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Box
} from '@mui/material';

const ConfirmModal = ({ open, title, description, onConfirm, onCancel }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
         height: { xs: '60vh'},

          bgcolor: '#1a1a1a',
          color: '#fff',
          borderRadius: 2,
          px: 2,
          py: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.25rem' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#ccc', textAlign: 'center' }}>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: '#f44336',
            color: '#f44336',
            '&:hover': {
              backgroundColor: '#2a2a2a',
              borderColor: '#d32f2f',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #d32f2f, #b71c1c)',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c, #7f0000)',
              transform: 'scale(1.03)',
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
