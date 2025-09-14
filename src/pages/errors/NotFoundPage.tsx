import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography variant="h1" component="h1" sx={{ fontSize: '8rem', fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        The page you are looking for doesn't exist.
      </Typography>
      <Button
        component={Link}
        to="/dashboard"
        variant="contained"
        startIcon={<Home />}
        size="large"
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFoundPage;
