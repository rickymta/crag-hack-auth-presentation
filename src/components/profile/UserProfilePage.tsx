import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Lock as LockIcon,
  CameraAlt as CameraIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { 
  useAppDispatch, 
  useAppSelector
} from '../../store';
import type { RootState } from '../../store';
import {
  fetchUserProfile,
  uploadAvatar,
  deleteAvatar,
} from '../../store/slices/userProfileSlice';
import ProfileEditDialog from './ProfileEditDialog';
import ChangePasswordDialog from './ChangePasswordDialog';
import { TokenStatusCard } from '../auth/TokenStatusCard';

const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state: RootState) => state.userProfile);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadAvatar(file));
    }
  };

  const handleDeleteAvatar = () => {
    dispatch(deleteAvatar());
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="warning">No profile data available</Alert>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={1200} mx="auto">
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Stack spacing={3}>
        {/* Token Status Section */}
        <TokenStatusCard />
        
        {/* Avatar and Basic Info Card */}
        <Card>
          <CardContent>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 3 
              }}
            >
              {/* Avatar Section */}
              <Box sx={{ textAlign: 'center' }}>
                <Box position="relative" display="inline-block" mb={2}>
                  <Avatar
                    src={profile.avatar}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      border: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  
                  <Tooltip title="Change Avatar">
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' },
                        width: 40,
                        height: 40,
                      }}
                    >
                      <CameraIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </IconButton>
                  </Tooltip>
                  
                  {profile.avatar && (
                    <Tooltip title="Delete Avatar">
                      <IconButton
                        onClick={handleDeleteAvatar}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                          width: 32,
                          height: 32,
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Typography variant="h5" gutterBottom>
                  {profile.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profile.email}
                </Typography>
                
                {profile.gender && (
                  <Chip
                    label={profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}

                <Box mt={3}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditDialogOpen(true)}
                    sx={{ mr: 2 }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    Change Password
                  </Button>
                </Box>
              </Box>

              {/* Profile Information */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <EmailIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {profile.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <PhoneIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            {profile.phoneNumber || 'Not provided'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <LocationIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Address
                          </Typography>
                          <Typography variant="body1">
                            {profile.address || 'Not provided'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <CalendarIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date of Birth
                          </Typography>
                          <Typography variant="body1">
                            {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {profile.bio && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Biography
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {profile.bio}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Box>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => setEditDialogOpen(true)}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<LockIcon />}
                        onClick={() => setPasswordDialogOpen(true)}
                      >
                        Change Password
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Dialogs */}
      <ProfileEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        profile={profile}
      />
      
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />
    </Box>
  );
};

export default UserProfilePage;
