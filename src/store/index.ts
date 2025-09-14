import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// Import slices
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import roleReducer from './slices/roleSlice';

// Export specific actions to avoid naming conflicts
export { 
  loginAsync, 
  registerAsync, 
  logoutAsync, 
  getProfileAsync, 
  updateProfileAsync, 
  changePasswordAsync 
} from './slices/authSlice';

export { 
  toggleTheme, 
  setThemeMode, 
  toggleSidebar, 
  setSidebarOpen, 
  initializeTheme 
} from './slices/themeSlice';

export {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearError,
  setFilters
} from './slices/userSlice';

export {
  fetchRoles,
  clearError as clearRoleError
} from './slices/roleSlice';

// Configure store
const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    theme: themeReducer,
    roles: roleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

// Auth selectors
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// User selectors
export const selectUsersList = (state: RootState) => state.users.users;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUsersPagination = (state: RootState) => state.users.pagination;
export const selectUsersFilters = (state: RootState) => state.users.filters;

// Theme selectors
export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectSidebarOpen = (state: RootState) => state.theme.sidebarOpen;

// Role selectors
export const selectRolesList = (state: RootState) => state.roles.roles;
export const selectRolesLoading = (state: RootState) => state.roles.loading;
export const selectRolesError = (state: RootState) => state.roles.error;
