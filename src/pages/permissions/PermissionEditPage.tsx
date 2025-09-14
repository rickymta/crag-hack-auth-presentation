import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const PermissionEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Permission
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Edit permission with ID: {id}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Permission edit form will be implemented here.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/permissions')}>
            Back to Permissions
          </Button>
          <Button variant="contained">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PermissionEditPage;
