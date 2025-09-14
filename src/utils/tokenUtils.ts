import { AuthService } from '../api';

/**
 * Utility functions for token management
 */
export class TokenUtils {
  /**
   * Check if current access token is expired or will expire soon
   * @param bufferMinutes - Consider token expired if it expires within this many minutes
   * @returns true if token is expired or will expire soon
   */
  static isTokenExpired(bufferMinutes: number = 5): boolean {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return true;

    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const bufferTime = bufferMinutes * 60;
      
      return tokenPayload.exp <= (currentTime + bufferTime);
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  /**
   * Get time remaining until token expires
   * @returns seconds until expiry, or 0 if expired/invalid
   */
  static getTimeUntilExpiry(): number {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return 0;

    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeRemaining = tokenPayload.exp - currentTime;
      
      return Math.max(0, timeRemaining);
    } catch (error) {
      console.error('Error parsing token:', error);
      return 0;
    }
  }

  /**
   * Get formatted time until token expires
   * @returns formatted string like "5m 30s" or "expired"
   */
  static getFormattedTimeUntilExpiry(): string {
    const seconds = this.getTimeUntilExpiry();
    
    if (seconds <= 0) return 'expired';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  /**
   * Check if refresh token is available
   */
  static hasRefreshToken(): boolean {
    return !!AuthService.getRefreshToken();
  }

  /**
   * Check if user has valid authentication (access token and refresh token)
   */
  static hasValidAuth(): boolean {
    return AuthService.isAuthenticated() && this.hasRefreshToken();
  }

  /**
   * Extract user info from access token
   */
  static getUserFromToken(): any {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return null;

    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      return {
        userId: tokenPayload.sub,
        email: tokenPayload.email,
        roles: tokenPayload.roles || [],
        permissions: tokenPayload.permissions || [],
        exp: tokenPayload.exp,
        iat: tokenPayload.iat,
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
}
