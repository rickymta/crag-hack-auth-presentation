import React from 'react';
import { useTokenRefresh } from '../../hooks/useTokenRefresh';

interface TokenRefreshProviderProps {
  children: React.ReactNode;
  /**
   * Check token expiry every X milliseconds
   * Default: 5 minutes
   */
  checkInterval?: number;
  /**
   * Refresh token X milliseconds before expiry
   * Default: 10 minutes
   */
  refreshBeforeExpiry?: number;
}

/**
 * Provider component that automatically handles token refresh
 * Should be placed high in the component tree, ideally wrapping the entire app
 */
export const TokenRefreshProvider: React.FC<TokenRefreshProviderProps> = ({
  children,
  checkInterval = 5 * 60 * 1000, // 5 minutes
  refreshBeforeExpiry = 10 * 60 * 1000, // 10 minutes
}) => {
  // Initialize token refresh hook
  useTokenRefresh({
    checkInterval,
    refreshBeforeExpiry,
  });

  // This component doesn't render anything visible
  // It just manages token refresh in the background
  return <>{children}</>;
};
