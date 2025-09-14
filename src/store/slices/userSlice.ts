import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserService } from '../../api';
import type {
  UserFilterDto,
  UserListDto,
  UserListItemDto,
  UserCreateDto,
  UserAdminUpdateDto,
} from '../../types/dto/user';

interface UserState {
  users: UserListItemDto[];
  loading: boolean;
  error: string | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  filters: Partial<UserFilterDto>;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  filters: {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: Partial<UserFilterDto>, { rejectWithValue }) => {
    try {
      // Try API first
      const response = await UserService.getUsers(params as UserFilterDto);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('fetchUsers complete failure:', error);
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await UserService.deleteUser(userId);
      if (response.success) {
        return userId;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.error('deleteUser API error:', error);
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await UserService.deactivateUser(userId);
      if (response.success) {
        return userId;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.error('deactivateUser API error:', error);
      return rejectWithValue(error.message || 'Failed to deactivate user');
    }
  }
);

export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await UserService.activateUser(userId);
      if (response.success) {
        return userId;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.error('activateUser API error:', error);
      return rejectWithValue(error.message || 'Failed to activate user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: UserCreateDto, { rejectWithValue }) => {
    try {
      const response = await UserService.createUser(userData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.error('createUser API error:', error);
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userData }: { userData: UserAdminUpdateDto }, { rejectWithValue }) => {
    try {
      const response = await UserService.updateUser(userData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      console.error('updateUser API error:', error);
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      };
    },
    setPage: (state, action) => {
      state.filters.pageNumber = action.payload;
    },
    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
      state.filters.pageNumber = 1; // Reset to first page when changing page size
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload as UserListDto;
        state.users = responseData.users;
        state.pagination = {
          pageNumber: responseData.pageNumber,
          pageSize: responseData.pageSize,
          totalCount: responseData.totalCount,
          totalPages: responseData.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - 1);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        // Note: We might need to refetch the list to get the proper UserListItemDto
        // For now, just clear error
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        // Note: We might need to refetch the list to get the proper UserListItemDto
        // For now, just clear error
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      // Activate user
      builder
      .addCase(activateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateUser.fulfilled, (state) => {
        state.loading = false;
        // Optionally update the user in the list if needed
        state.error = null;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      // Deactivate user
      builder
      .addCase(deactivateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateUser.fulfilled, (state) => {
        state.loading = false;
        // Optionally update the user in the list if needed
        state.error = null;
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, resetFilters, setPage, setPageSize } = userSlice.actions;

export default userSlice.reducer;
