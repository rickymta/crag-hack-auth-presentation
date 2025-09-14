import React from 'react';
import { Box, Typography } from '@mui/material';

const NotificationsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Notifications
      </Typography>
      <Typography variant="body1">
        Notifications page - Coming soon...
      </Typography>
    </Box>
  );
};

export default NotificationsPage;
