import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ open, handleClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert severity="success" onClose={handleClose}>
        Data sent successfully!
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
