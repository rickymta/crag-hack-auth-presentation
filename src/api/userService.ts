import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type {
  UserDto,
} from '../types/dto/auth';
import type {
  UserFilterDto,
  UserListDto,
  UserCreateDto,
  UserAdminUpdateDto,
} from '../types/dto/user';
import type { ApiResponse } from '../types/dto/base';

export class UserService {
  /**
   * Get paginated list of users (Admin only)
   */
  static async getUsers(params?: UserFilterDto): Promise<ApiResponse<UserListDto>> {
    const searchParams = new URLSearchParams();
    
    if (params?.pageNumber) searchParams.set('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    if (params?.searchTerm) searchParams.set('searchTerm', params.searchTerm);
    if (params?.role) searchParams.set('role', params.role);
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    if (params?.isEmailVerified !== undefined) searchParams.set('isEmailVerified', params.isEmailVerified.toString());
    if (params?.isPhoneVerified !== undefined) searchParams.set('isPhoneVerified', params.isPhoneVerified.toString());
    if (params?.createdFrom) searchParams.set('createdFrom', params.createdFrom.toISOString());
    if (params?.createdTo) searchParams.set('createdTo', params.createdTo.toISOString());
    if (params?.lastLoginFrom) searchParams.set('lastLoginFrom', params.lastLoginFrom.toISOString());
    if (params?.lastLoginTo) searchParams.set('lastLoginTo', params.lastLoginTo.toISOString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortDirection) searchParams.set('sortDirection', params.sortDirection);

    const url = `${API_ENDPOINTS.USER_ADMIN.LIST}${searchParams.toString() ? `?${searchParams}` : ''}`;
    return apiClient.get<UserListDto>(url);
  }

  /**
   * Get user by ID (Admin only)
   */
  static async getUserById(id: string): Promise<ApiResponse<UserDto>> {
    return apiClient.get<UserDto>(API_ENDPOINTS.USER_ADMIN.GET_BY_ID(id));
  }

  /**
   * Create new user (Admin only)
   */
  static async createUser(data: UserCreateDto): Promise<ApiResponse<UserDto>> {
    return apiClient.post<UserDto>(API_ENDPOINTS.USER_ADMIN.CREATE, data);
  }

  /**
   * Update user (Admin only)
   */
  static async updateUser(data: UserAdminUpdateDto): Promise<ApiResponse<UserDto>> {
    return apiClient.put<UserDto>(API_ENDPOINTS.USER_ADMIN.UPDATE(), data);
  }

  /**
   * Delete user (Admin only)
   */
  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.USER_ADMIN.DELETE(id));
  }

  /**
   * Activate user (Admin only)
   */
  static async activateUser(id: string): Promise<ApiResponse<UserDto>> {
    return apiClient.post<UserDto>(API_ENDPOINTS.USER_ADMIN.ACTIVATE(id));
  }

  /**
   * Deactivate user (Admin only)
   */
  static async deactivateUser(id: string): Promise<ApiResponse<UserDto>> {
    return apiClient.post<UserDto>(API_ENDPOINTS.USER_ADMIN.DEACTIVATE(id));
  }

  /**
   * Bulk activate users (Admin only)
   */
  static async bulkActivateUsers(userIds: string[]): Promise<ApiResponse<void>> {
    const promises = userIds.map(id => this.activateUser(id));
    await Promise.all(promises);
    return { success: true, data: undefined, message: 'Users activated successfully' };
  }

  /**
   * Bulk deactivate users (Admin only)
   */
  static async bulkDeactivateUsers(userIds: string[]): Promise<ApiResponse<void>> {
    const promises = userIds.map(id => this.deactivateUser(id));
    await Promise.all(promises);
    return { success: true, data: undefined, message: 'Users deactivated successfully' };
  }

  /**
   * Bulk delete users (Admin only)
   */
  static async bulkDeleteUsers(userIds: string[]): Promise<ApiResponse<void>> {
    const promises = userIds.map(id => this.deleteUser(id));
    await Promise.all(promises);
    return { success: true, data: undefined, message: 'Users deleted successfully' };
  }
}
