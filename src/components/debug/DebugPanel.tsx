import React from 'react';
import { useAppSelector } from '../../store';
import { Box, Typography, Paper } from '@mui/material';

export const DebugPanel: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const userProfile = useAppSelector((state) => state.userProfile);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        top: 80, 
        right: 16, 
        p: 2, 
        minWidth: 300,
        maxWidth: 400,
        zIndex: 9999,
        opacity: 0.9,
        fontSize: '12px'
      }}
    >
      <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
        Debug Panel
      </Typography>
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" fontWeight="bold">Auth State:</Typography>
        <Typography variant="caption" component="div">
          - isAuthenticated: {auth.isAuthenticated ? 'true' : 'false'}
        </Typography>
        <Typography variant="caption" component="div">
          - user.id: {auth.user?.id || 'null'}
        </Typography>
        <Typography variant="caption" component="div">
          - user.avatar: {auth.user?.avatar || 'null'}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="body2" fontWeight="bold">Profile State:</Typography>
        <Typography variant="caption" component="div">
          - profile.id: {userProfile.profile?.id || 'null'}
        </Typography>
        <Typography variant="caption" component="div">
          - profile.avatar: {userProfile.profile?.avatar || 'null'}
        </Typography>
        <Typography variant="caption" component="div">
          - loading: {userProfile.loading ? 'true' : 'false'}
        </Typography>
      </Box>
    </Paper>
  );
};
