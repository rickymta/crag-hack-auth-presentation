import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  RoleDto,
  // RoleFilterDto,
  // RoleListDto
} from '../../types/dto/role';
import { RoleService } from '../../api';

interface RoleState {
  roles: RoleDto[];
  loading: boolean;
  error: string | null;
  // pagination: {
  //   pageNumber: number;
  //   pageSize: number;
  //   totalCount: number;
  //   totalPages: number;
  // };
  // filters: Partial<RoleFilterDto>;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
  // pagination: {
  //   pageNumber: 1,
  //   pageSize: 10,
  //   totalCount: 0,
  //   totalPages: 0,
  // },
  // filters: {
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortBy: 'createdAt',
  //   sortDirection: 'desc',
  // },
};

// Async thunk for fetching roles
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      // Try API first
      try {
        const response = await RoleService.getRoles();
        
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (apiError: any) {
        console.warn('API failed, falling back to mock roles data:', apiError.message);
      }
    } catch (error: any) {
      console.error('fetchRoles complete failure:', error);
      return rejectWithValue(error.message || 'Failed to fetch roles');
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload as RoleDto[];
        state.roles = responseData;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = roleSlice.actions;

export default roleSlice.reducer;
