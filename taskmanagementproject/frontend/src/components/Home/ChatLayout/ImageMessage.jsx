import {
    Paper , Avatar, Typography
    } from '@mui/material'
    
export const ImageMessage = ({ content }) => (
    <Paper elevation={3} sx={{ mb: 1 }}>
      <img src={content} alt="image" style={{ maxWidth: '100%', height: 'auto' }} />
    </Paper>
  );