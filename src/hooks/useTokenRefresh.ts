import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { refreshTokenAsync, resetAuth } from '../store/slices/authSlice';
import { AuthService } from '../api';

interface UseTokenRefreshOptions {
  /**
   * Interval in milliseconds to check token expiration
   * Default: 5 minutes (300000ms)
   */
  checkInterval?: number;
  
  /**
   * Time in milliseconds before token expiry to refresh
   * Default: 10 minutes (600000ms)
   */
  refreshBeforeExpiry?: number;
}

/**
 * Hook to automatically refresh authentication tokens
 * Checks token expiration and refreshes when needed
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    checkInterval = 5 * 60 * 1000, // 5 minutes
    refreshBeforeExpiry = 10 * 60 * 1000, // 10 minutes
  } = options;

  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  /**
   * Check if token needs refresh based on expiry time
   */
  const shouldRefreshToken = useCallback((): boolean => {
    // Get the actual access token string from localStorage/cookies
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return false;

    try {
      // Decode JWT to get expiry time (basic implementation)
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (tokenPayload.exp - currentTime) * 1000;

      return timeUntilExpiry <= refreshBeforeExpiry;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if we can't parse
    }
  }, [refreshBeforeExpiry]);

  /**
   * Attempt to refresh the token
   */
  const performTokenRefresh = useCallback(async () => {
    if (isLoading) return;

    try {
      await dispatch(refreshTokenAsync()).unwrap();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      dispatch(resetAuth());
      AuthService.clearAuth();
      // Optionally redirect to login
      window.location.href = '/auth/login';
    }
  }, [dispatch, isLoading]);

  /**
   * Check token and refresh if needed
   */
  const checkAndRefreshToken = useCallback(async () => {
    if (!isAuthenticated) return;

    const refreshToken = AuthService.getRefreshToken();
    if (!refreshToken) {
      // No refresh token available, logout user
      dispatch(resetAuth());
      AuthService.clearAuth();
      return;
    }

    if (shouldRefreshToken()) {
      await performTokenRefresh();
    }
  }, [isAuthenticated, shouldRefreshToken, performTokenRefresh, dispatch]);

  /**
   * Set up automatic token refresh checking
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check immediately
    checkAndRefreshToken();

    // Set up interval checking
    const intervalId = setInterval(checkAndRefreshToken, checkInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, checkAndRefreshToken, checkInterval]);

  /**
   * Handle page visibility change to refresh on focus
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        checkAndRefreshToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, checkAndRefreshToken]);

  return {
    refreshToken: performTokenRefresh,
    checkAndRefreshToken,
    isRefreshing: isLoading,
  };
};
