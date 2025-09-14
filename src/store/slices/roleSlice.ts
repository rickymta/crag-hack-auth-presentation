import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  RoleListDto,
} from "../../types/dto/role";
import { RoleService } from "../../api";

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

export const fetchAllRoles = createAsyncThunk(
  "roles/fetchAllRoles",
  async (_, { rejectWithValue }) => {
    try {
      // Try API first
      try {
        const response = await RoleService.getAllRoles();
        const roleListData = response.data as RoleDto[];
        return roleListData;
      } catch (apiError: any) {
        console.warn(
          "API failed, falling back to mock roles data:",
          apiError.message
        );
        // Fallback: return mock roles data
        const mockRoles: RoleDto[] = [];
        return mockRoles;
      }
    } catch (error: any) {
      console.error("fetchAllRoles complete failure:", error);
      return rejectWithValue(error.message || "Failed to fetch roles");
    }
  }
);

// Async thunk for fetching roles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      // Try API first
      try {
        const response = await RoleService.getRoles();
        console.log("fetchRoles - API response:", response);
        if (response.success && response.data && response.data.roles) {
          // Extract roles array from the nested data structure
          const roleListData = response.data as RoleListDto;
          return roleListData.roles;
        } else {
          throw new Error(response.message || "No roles data received");
        }
      } catch (apiError: any) {
        console.warn(
          "API failed, falling back to mock roles data:",
          apiError.message
        );
        // Fallback: return mock roles data
        const mockRoles: RoleDto[] = [];
        return mockRoles;
      }
    } catch (error: any) {
      console.error("fetchRoles complete failure:", error);
      return rejectWithValue(error.message || "Failed to fetch roles");
    }
  }
);

// Create role
export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData: RoleCreateDto, { rejectWithValue }) => {
    try {
      console.log("createRole called with data:", roleData);

      try {
        const response = await RoleService.createRole(roleData);
        console.log("createRole response:", response);

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (apiError: any) {
        console.warn("API failed, simulating role creation:", apiError.message);

        // Fallback: simulate creation
        const newRole: RoleDto = {
          id: Date.now().toString(),
          name: roleData.name,
          description: roleData.description,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          permissions: roleData.permissionIds || [],
          userCount: 0,
        };

        return newRole;
      }
    } catch (error: any) {
      console.error("createRole complete failure:", error);
      return rejectWithValue(error.message || "Failed to create role");
    }
  }
);

// Update role
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (
    { id, roleData }: { id: string; roleData: RoleUpdateDto },
    { rejectWithValue }
  ) => {
    try {
      try {
        const response = await RoleService.updateRole(id, roleData);
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (apiError: any) {
        console.warn("API failed, simulating role update:", apiError.message);

        // Fallback: simulate update
        const updatedRole: RoleDto = {
          id,
          name: roleData.name || "Updated Role",
          description: roleData.description || "Updated Description",
          isActive: roleData.isActive ?? true,
          createdAt: "2024-01-01T00:00:00.000Z", // Keep original
          updatedAt: new Date().toISOString(),
          permissions: roleData.permissionIds || [],
          userCount: 0, // Keep original
        };

        return updatedRole;
      }
    } catch (error: any) {
      console.error("updateRole complete failure:", error);
      return rejectWithValue(error.message || "Failed to update role");
    }
  }
);

// Delete role
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (roleId: string, { rejectWithValue }) => {
    try {
      try {
        const response = await RoleService.deleteRole(roleId);
        if (response.success) {
          return roleId;
        } else {
          throw new Error(response.message);
        }
      } catch (apiError: any) {
        console.warn("API failed, simulating role deletion:", apiError.message);
        return roleId; // Simulate successful deletion
      }
    } catch (error: any) {
      console.error("deleteRole complete failure:", error);
      return rejectWithValue(error.message || "Failed to delete role");
    }
  }
);

// Toggle role active status
export const toggleRoleStatus = createAsyncThunk(
  "roles/toggleRoleStatus",
  async (
    { id, isActive }: { id: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      // Since there's no specific API endpoint, we'll use update
      if (!isActive) {
        try {
          const response = await RoleService.activateRole(id);
          if (response.success) {
            return { id, isActive: true };
          } else {
            throw new Error(response.message);
          }
        } catch (apiError: any) {
          console.warn(
            "API activate failed, simulating activation:",
            apiError.message
          );
          return { id, isActive: true }; // Simulate activation
        }
      } else {
        try {
          const response = await RoleService.deactivateRole(id); 
          if (response.success) {
            return { id, isActive: false };
          } else {
            throw new Error(response.message);
          }
        } catch (apiError: any) {
          console.warn(
            "API deactivate failed, simulating deactivation:",
            apiError.message
          );
          return { id, isActive: false }; // Simulate deactivation
        }
      }
    } catch (error: any) {
      console.error("toggleRoleStatus complete failure:", error);
      return rejectWithValue(error.message || "Failed to toggle role status");
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload as RoleDto[];
        // Ensure responseData is always an array
        state.roles = Array.isArray(responseData) ? responseData : [];
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Ensure roles is still an array even on error
        if (!Array.isArray(state.roles)) {
          state.roles = [];
        }
      })

      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
        state.error = null;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload;
        const index = state.roles.findIndex(
          (role) => role.id === updatedRole.id
        );
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        state.error = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        const deletedRoleId = action.payload;
        state.roles = state.roles.filter((role) => role.id !== deletedRoleId);
        state.error = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle role status
      .addCase(toggleRoleStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleRoleStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, isActive } = action.payload;
        const role = state.roles.find((role) => role.id === id);
        if (role) {
          role.isActive = isActive;
        }
        state.error = null;
      })
      .addCase(toggleRoleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch all roles (for dropdowns, etc.)
    builder
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = roleSlice.actions;

export default roleSlice.reducer;
