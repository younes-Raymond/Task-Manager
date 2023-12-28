import React, { useState } from 'react';
import { Button, Typography, Container } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SupportForm from './SupportForm';

const LandingPage = () => {
  const [showSupportForm, setShowSupportForm] = useState(false);

  const handleSupportClick = () => {
    setShowSupportForm(true);
  };

  return (
    <Container
      sx={{
        textAlign: 'center',
        marginTop: 4,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: 'primary.main',
          marginBottom: 2,
        }}
      >
        Welcome to Gaza Children Support
      </Typography>
      <img
        src="https://www.itsliquid.com/wp-content/uploads/2020/03/I-Swear-F.jpg"
        alt="Gaza Children"
        sx={{
          width: '100%',
          height: 'auto',
          borderRadius: 2,
          marginBottom: 2,
        }}
      />
      <Typography
        variant="body1"
        sx={{
          marginBottom: 2,
        }}
      >
        Text and other information about the support initiative.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<VolunteerActivismIcon />}
        sx={{
          backgroundColor: 'primary.main',
          color: 'common.white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={handleSupportClick}
      >
        Support
      </Button>

      {showSupportForm && <SupportForm />}
    </Container>
  );
};

export default LandingPage;
