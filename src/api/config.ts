import { getEnvVariable } from './env';

export const API_CONFIG = {
  BASE_URL: getEnvVariable('API_BASE_URL', 'https://localhost:7270/api'),
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    VALIDATE_TOKEN: '/auth/validate-token',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
  },
  
  // User Profile
  USER_PROFILE: {
    GET: '/user/profile',
    UPDATE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },
  
  // User Management (Admin)
  USER_ADMIN: {
    LIST: '/user',
    GET_BY_ID: (id: string) => `/user/${id}`,
    CREATE: '/user',
    UPDATE: () => `/user/update`,
    DELETE: (id: string) => `/user/${id}`,
    ACTIVATE: (id: string) => `/user/${id}/activate`,
    DEACTIVATE: (id: string) => `/user/${id}/deactivate`,
  },
  
  // Role Management
  ROLE: {
    ALL: '/role/all',
    LIST: '/role',
    GET_BY_ID: (id: string) => `/role/${id}`,
    CREATE: '/role',
    UPDATE: (id: string) => `/role/${id}`,
    DELETE: (id: string) => `/role/${id}`,
    ACTIVATE: (id: string) => `/role/${id}/activate`,
    DEACTIVATE: (id: string) => `/role/${id}/deactivate`,
  },
  
  // Permission Management
  PERMISSION: {
    LIST: '/permission',
    GET_BY_ID: (id: string) => `/permission/${id}`,
    CREATE: '/permission',
    UPDATE: (id: string) => `/permission/${id}`,
    DELETE: (id: string) => `/permission/${id}`,
    CHECK: (userId: string) => `/permission/check/${userId}`,
  },
} as const;
