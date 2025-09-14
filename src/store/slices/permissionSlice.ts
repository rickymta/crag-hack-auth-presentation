import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PermissionDto } from '../../types/dto/permission';
import { PermissionService } from '../../api';

interface PermissionState {
  permissions: PermissionDto[];
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  permissions: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all permissions
export const fetchAllPermissions = createAsyncThunk(
  'permissions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await PermissionService.getAllPermissions();
      console.log('fetchAllPermissions - API response:', response);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'No permissions data received');
      }
    } catch (error: any) {
      console.error('fetchAllPermissions error:', error);
      return rejectWithValue(error.message || 'Failed to fetch permissions');
    }
  }
);

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all permissions
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Ensure permissions is still an array even on error
        if (!Array.isArray(state.permissions)) {
          state.permissions = [];
        }
      });
  },
});

export const { clearError } = permissionSlice.actions;

export default permissionSlice.reducer;
