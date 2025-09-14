import React from 'react';
import { Box, Typography } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1">
        Settings page - Coming soon...
      </Typography>
    </Box>
  );
};

export default SettingsPage;
