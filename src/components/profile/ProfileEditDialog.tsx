import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack,
  MenuItem,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { UserProfileDto, UserProfileUpdateDto } from '../../types/dto/userProfile';
import { useAppDispatch } from '../../store';
import { updateUserProfile } from '../../store/slices/userProfileSlice';

interface ProfileEditDialogProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfileDto;
}

type ProfileFormData = {
  fullName: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
};

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  open,
  onClose,
  profile,
}) => {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
      address: profile.address || '',
      dateOfBirth: profile.dateOfBirth || '',
      bio: profile.bio || '',
      gender: profile.gender || undefined,
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      const updateData: UserProfileUpdateDto = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        bio: data.bio || undefined,
        gender: data.gender || undefined,
      };

      await dispatch(updateUserProfile(updateData)).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  React.useEffect(() => {
    if (open) {
      reset({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth || '',
        bio: profile.bio || '',
        gender: profile.gender || undefined,
      });
    }
  }, [open, profile, reset]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            {/* Full Name Field */}
            <Controller
              name="fullName"
              control={control}
              rules={{
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Full name must be at least 2 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Full name must not exceed 100 characters'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  required
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Contact Fields */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    disabled={isSubmitting}
                    placeholder="+1 (555) 123-4567"
                  />
                )}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gender"
                    select
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="">
                      <em>Not specified</em>
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                )}
              />
            </Box>

            {/* Date and Address */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    disabled={isSubmitting}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Box>

            {/* Address Field */}
              <Controller
                name="address"
                control={control}
                rules={{
                  maxLength: {
                    value: 200,
                    message: 'Address must not exceed 200 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    disabled={isSubmitting}
                    placeholder="Enter your full address"
                  />
                )}
              />            {/* Bio Field */}
            <Controller
              name="bio"
              control={control}
              rules={{
                maxLength: {
                  value: 500,
                  message: 'Bio must not exceed 500 characters'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Biography"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.bio}
                  helperText={errors.bio?.message}
                  disabled={isSubmitting}
                  placeholder="Tell us about yourself..."
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={isSubmitting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileEditDialog;
