import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../../api';
import type {
  UserDto,
  LoginRequestDto,
  RegisterRequestDto,
} from '../../types/dto/auth';
import type {
  ChangePasswordRequestDto,
  UpdateUserRequestDto,
} from '../../types/dto/user';

export interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  deviceId: string;
}

const initialState: AuthState = {
  user: AuthService.getCurrentUser(),
  isAuthenticated: AuthService.isAuthenticated(),
  isLoading: false,
  error: null,
  deviceId: '',
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (loginData: LoginRequestDto, { rejectWithValue }) => {
    try {
      console.log('loginAsync thunk started with data:', loginData);
      
      const response = await AuthService.login(loginData);
      
      console.log('loginAsync thunk received response:', response);
      
      if (response.success) {
        console.log('loginAsync thunk returning success data:', response.data);
        return response.data;
      } else {
        console.log('loginAsync thunk returning error:', response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.log('loginAsync thunk caught error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterRequestDto, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(registerData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = ''; // We'll get this from cookies via AuthService
      
      if (refreshToken) {
        await AuthService.logout({
          refreshToken,
          deviceId: state.auth.deviceId,
        });
      }
      
      AuthService.clearAuth();
      return true;
    } catch (error: any) {
      // Clear auth data even if logout API fails
      AuthService.clearAuth();
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const getProfileAsync = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.getProfile();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get profile');
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (updateData: UpdateUserRequestDto, { rejectWithValue }) => {
    try {
      const response = await AuthService.updateProfile(updateData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: ChangePasswordRequestDto, { rejectWithValue }) => {
    try {
      const response = await AuthService.changePassword(passwordData);
      if (response.success) {
        return true;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        console.log('loginAsync.pending - setting loading to true');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        console.log('loginAsync.fulfilled - updating state with user data:', action.payload);
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        console.log('loginAsync.rejected - setting error:', action.payload);
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Get Profile
    builder
      .addCase(getProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Change Password
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setDeviceId, resetAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
