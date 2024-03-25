import {
    Paper , Typography
    } from '@mui/material'

export const FileMessage = ({ content }) => (
    <Paper elevation={3} sx={{ p: 2, mb: 1 }}>
      <Typography variant="body1">File: {content}</Typography>
    </Paper>
  );