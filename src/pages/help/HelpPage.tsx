import React from 'react';
import { Box, Typography } from '@mui/material';

const HelpPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Help & Support
      </Typography>
      <Typography variant="body1">
        Help page - Coming soon...
      </Typography>
    </Box>
  );
};

export default HelpPage;
