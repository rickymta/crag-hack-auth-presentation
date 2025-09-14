import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type {
  LoginRequestDto,
  RegisterRequestDto,
  AuthResponseDto,
  RefreshTokenRequestDto,
  LogoutRequestDto,
  UserDto,
} from '../types/dto/auth';
import type { 
  ChangePasswordRequestDto,
  UpdateUserRequestDto 
} from '../types/dto/user';
import type { ApiResponse } from '../types/dto/base';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequestDto): Promise<ApiResponse<AuthResponseDto>> {
    const response = await apiClient.post<AuthResponseDto>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    // Store tokens and user data
    if (response.success && response.data) {
      apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      apiClient.setUserData(response.data.user);
      apiClient.setDeviceId(data.deviceId);
    }
    
    return response;
  }

  /**
   * Login user with email or phone
   */
  static async login(data: LoginRequestDto): Promise<ApiResponse<AuthResponseDto>> {
    const response = await apiClient.post<AuthResponseDto>(API_ENDPOINTS.AUTH.LOGIN, data);
    console.log(response)
    
    // Store tokens and user data
    if (response.success && response.data) {
      apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      apiClient.setUserData(response.data.user);
      apiClient.setDeviceId(data.deviceId);
    }
    
    return response;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(data: RefreshTokenRequestDto): Promise<ApiResponse<AuthResponseDto>> {
    const response = await apiClient.post<AuthResponseDto>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
    
    // Update tokens
    if (response.success && response.data) {
      apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  }

  /**
   * Validate token
   */
  static async validateToken(token: string): Promise<ApiResponse<{ valid: boolean; user?: UserDto }>> {
    return apiClient.get(`${API_ENDPOINTS.AUTH.VALIDATE_TOKEN}?token=${token}`);
  }

  /**
   * Logout from current device
   */
  static async logout(data: LogoutRequestDto): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT, data);
    
    // Clear tokens and user data on successful logout
    if (response.success) {
      apiClient.clearTokens();
    }
    
    return response;
  }

  /**
   * Logout from all devices
   */
  static async logoutAll(refreshToken: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT_ALL, { refreshToken });
    
    // Clear tokens and user data on successful logout
    if (response.success) {
      apiClient.clearTokens();
    }
    
    return response;
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<ApiResponse<UserDto>> {
    return apiClient.get<UserDto>(API_ENDPOINTS.USER_PROFILE.GET);
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateUserRequestDto): Promise<ApiResponse<UserDto>> {
    const response = await apiClient.put<UserDto>(API_ENDPOINTS.USER_PROFILE.UPDATE, data);
    
    // Update stored user data
    if (response.success && response.data) {
      apiClient.setUserData(response.data);
    }
    
    return response;
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequestDto): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.USER_PROFILE.CHANGE_PASSWORD, data);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Get stored user data
   */
  static getCurrentUser(): UserDto | null {
    return apiClient.getUserData();
  }

  /**
   * Clear all auth data
   */
  static clearAuth(): void {
    apiClient.clearTokens();
  }
}
