import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type {
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  // RoleListDto,
  // RoleFilterDto,
} from '../types/dto/role';
import type { ApiResponse } from '../types/dto/base';

export class RoleService {
  /**
   * Get paginated list of roles (Admin only)
   */
  static async getRoles(): Promise<ApiResponse<RoleDto[]>> {
    const url = `${API_ENDPOINTS.ROLE.LIST}`;
    return apiClient.get<RoleDto[]>(url);
  }

  /**
   * Get role by ID (Admin only)
   */
  static async getRoleById(id: string): Promise<ApiResponse<RoleDto>> {
    return apiClient.get<RoleDto>(API_ENDPOINTS.ROLE.GET_BY_ID(id));
  }

  /**
   * Create new role (Admin only)
   */
  static async createRole(data: RoleCreateDto): Promise<ApiResponse<RoleDto>> {
    return apiClient.post<RoleDto>(API_ENDPOINTS.ROLE.CREATE, data);
  }

  /**
   * Update role (Admin only)
   */
  static async updateRole(id: string, data: RoleUpdateDto): Promise<ApiResponse<RoleDto>> {
    return apiClient.put<RoleDto>(API_ENDPOINTS.ROLE.UPDATE(id), data);
  }

  /**
   * Delete role (Admin only)
   */
  static async deleteRole(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.ROLE.DELETE(id));
  }

  /**
   * Get all roles (for dropdown/select components)
   */
  static async getAllRoles(): Promise<ApiResponse<RoleDto[]>> {
    const url = `${API_ENDPOINTS.ROLE.ALL}`;
    return apiClient.get<RoleDto[]>(url);
  }

  /**
   * Bulk delete roles (Admin only)
   */
  static async bulkDeleteRoles(roleIds: string[]): Promise<ApiResponse<void>> {
    const promises = roleIds.map(id => this.deleteRole(id));
    await Promise.all(promises);
    return { success: true, data: undefined, message: 'Roles deleted successfully' };
  }

  /**
   * Assign permissions to role (Admin only)
   */
  static async assignPermissions(roleId: string, permissionIds: string[]): Promise<ApiResponse<RoleDto>> {
    // This will need to be implemented when we have the proper endpoint
    // For now, return placeholder
    console.log('Assigning permissions to role:', { roleId, permissionIds });
    return this.getRoleById(roleId);
  }

  /**
   * Remove permissions from role (Admin only)
   */
  static async removePermissions(roleId: string, permissionIds: string[]): Promise<ApiResponse<RoleDto>> {
    // This will need to be implemented when we have the proper endpoint
    // For now, return placeholder
    console.log('Removing permissions from role:', { roleId, permissionIds });
    return this.getRoleById(roleId);
  }
}
