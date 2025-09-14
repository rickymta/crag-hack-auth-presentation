import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Lock as LockIcon,
  CameraAlt as CameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store";
import type { RootState } from "../../store";
import {
  fetchUserProfile,
  uploadAvatar,
} from "../../store/slices/userProfileSlice";
import ProfileEditDialog from "./ProfileEditDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { TokenStatusCard } from "../auth/TokenStatusCard";
import { AvatarChangeDialog } from "./AvatarChangeDialog";
import { SafeAvatar } from "../common/SafeAvatar";

const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, uploadingAvatar } = useAppSelector(
    (state: RootState) => state.userProfile
  );
  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [avatarChangeOpen, setAvatarChangeOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  const handleAvatarChangeClick = () => {
    setAvatarChangeOpen(true);
  };

  const handleAvatarClose = () => {
    setAvatarChangeOpen(false);
  };

  const handleAvatarUpload = (croppedFile: File) => {
    dispatch(uploadAvatar(croppedFile));
    setAvatarChangeOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          <Typography variant="h6">Not authenticated</Typography>
          <Typography variant="body2">Please log in to view your profile.</Typography>
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          <Typography variant="h6">Error loading profile</Typography>
          <Typography variant="body2">{error}</Typography>
          <Button 
            variant="outlined" 
            onClick={() => dispatch(fetchUserProfile())}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          <Typography variant="h6">No profile data</Typography>
          <Typography variant="body2">No profile data available. This might be due to:</Typography>
          <ul>
            <li>API server not running</li>
            <li>Network connectivity issues</li>
            <li>Authentication token expired</li>
            <li>Profile not found</li>
          </ul>
          <Button 
            variant="contained" 
            onClick={() => dispatch(fetchUserProfile())}
            sx={{ mt: 2 }}
          >
            Retry Loading Profile
          </Button>
        </Alert>
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
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-start" },
                gap: 3,
              }}
            >
              {/* Avatar Section */}
              <Box
                sx={{ textAlign: "center", width: { xs: "100%", md: "250px" } }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={2}
                >
                  <SafeAvatar
                    src={profile?.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      border: "4px solid",
                      borderColor: "primary.main",
                    }}
                    fallbackIcon={<PersonIcon sx={{ fontSize: 60 }} />}
                  />

                  {/* Đổi Avatar Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      uploadingAvatar ? (
                        <CircularProgress size={16} />
                      ) : (
                        <CameraIcon />
                      )
                    }
                    onClick={handleAvatarChangeClick}
                    disabled={uploadingAvatar}
                    sx={{ mb: 1 }}
                  >
                    {uploadingAvatar ? "Đang xử lý..." : "Đổi avatar"}
                  </Button>
                </Box>

                <Typography variant="h5" gutterBottom>
                  {profile.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profile.email}
                </Typography>

                {profile.gender && (
                  <Chip
                    label={
                      profile.gender.charAt(0).toUpperCase() +
                      profile.gender.slice(1)
                    }
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}
              </Box>

              {/* Profile Information */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <EmailIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
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
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            {profile.phoneNumber || "Not provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <LocationIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Address
                          </Typography>
                          <Typography variant="body1">
                            {profile.address || "Not provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <CalendarIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Date of Birth
                          </Typography>
                          <Typography variant="body1">
                            {profile.dateOfBirth
                              ? new Date(
                                  profile.dateOfBirth
                                ).toLocaleDateString()
                              : "Not provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {profile.bio && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Biography
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body1">{profile.bio}</Typography>
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

      {/* Avatar Change Dialog */}
      <AvatarChangeDialog
        open={avatarChangeOpen}
        onClose={handleAvatarClose}
        currentAvatar={profile?.avatar}
        onCropComplete={handleAvatarUpload}
        isUploading={uploadingAvatar}
      />
    </Box>
  );
};

export default UserProfilePage;
