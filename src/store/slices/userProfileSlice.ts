import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserProfileService } from '../../api';
import type { 
  UserProfileDto, 
  UserProfileUpdateDto, 
  ChangePasswordDto 
} from '../../types/dto/userProfile';

export interface UserProfileState {
  profile: UserProfileDto | null;
  loading: boolean;
  error: string | null;
  uploadingAvatar: boolean;
  changingPassword: boolean;
}

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
  uploadingAvatar: false,
  changingPassword: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await UserProfileService.getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userProfile/updateProfile',
  async (data: UserProfileUpdateDto, { rejectWithValue }) => {
    try {
      const profile = await UserProfileService.updateProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'userProfile/uploadAvatar',
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const result = await UserProfileService.uploadAvatar(file);
      // Refresh profile to get updated avatar
      dispatch(fetchUserProfile());
      return result.avatarUrl;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const deleteAvatar = createAsyncThunk(
  'userProfile/deleteAvatar',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await UserProfileService.deleteAvatar();
      // Refresh profile to get updated avatar
      dispatch(fetchUserProfile());
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete avatar');
    }
  }
);

export const changePassword = createAsyncThunk(
  'userProfile/changePassword',
  async (data: ChangePasswordDto, { rejectWithValue }) => {
    try {
      await UserProfileService.changePassword(data);
      return 'Password changed successfully';
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.uploadingAvatar = false;
      state.changingPassword = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.uploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state) => {
        state.uploadingAvatar = false;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploadingAvatar = false;
        state.error = action.payload as string;
      })
      
      // Delete avatar
      .addCase(deleteAvatar.pending, (state) => {
        state.uploadingAvatar = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.uploadingAvatar = false;
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.uploadingAvatar = false;
        state.error = action.payload as string;
      })
      
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.changingPassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changingPassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changingPassword = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
