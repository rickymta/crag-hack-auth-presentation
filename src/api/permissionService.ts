import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type {
  PermissionDto,
  PermissionCreateDto,
  PermissionUpdateDto,
  PermissionListDto,
  PermissionFilterDto,
} from '../types/dto/permission';
import type { ApiResponse } from '../types/dto/base';

export class PermissionService {
  /**
   * Get paginated list of permissions (Admin only)
   */
  static async getPermissions(params?: PermissionFilterDto): Promise<ApiResponse<PermissionListDto>> {
    const searchParams = new URLSearchParams();
    
    if (params?.resource) searchParams.set('resource', params.resource);
    if (params?.action) searchParams.set('action', params.action);
    if (params?.searchTerm) searchParams.set('searchTerm', params.searchTerm);
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    if (params?.pageNumber) searchParams.set('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortDirection) searchParams.set('sortDirection', params.sortDirection);

    const url = `${API_ENDPOINTS.PERMISSION.LIST}${searchParams.toString() ? `?${searchParams}` : ''}`;
    return apiClient.get<PermissionListDto>(url);
  }

  /**
   * Get permission by ID (Admin only)
   */
  static async getPermissionById(id: string): Promise<ApiResponse<PermissionDto>> {
    return apiClient.get<PermissionDto>(API_ENDPOINTS.PERMISSION.GET_BY_ID(id));
  }

  /**
   * Create new permission (Admin only)
   */
  static async createPermission(data: PermissionCreateDto): Promise<ApiResponse<PermissionDto>> {
    return apiClient.post<PermissionDto>(API_ENDPOINTS.PERMISSION.CREATE, data);
  }

  /**
   * Update permission (Admin only)
   */
  static async updatePermission(id: string, data: PermissionUpdateDto): Promise<ApiResponse<PermissionDto>> {
    return apiClient.put<PermissionDto>(API_ENDPOINTS.PERMISSION.UPDATE(id), data);
  }

  /**
   * Delete permission (Admin only)
   */
  static async deletePermission(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.PERMISSION.DELETE(id));
  }

  /**
   * Check user permission
   */
  static async checkPermission(
    resource: string,
    action: string,
    userId?: string
  ): Promise<ApiResponse<{ hasPermission: boolean }>> {
    const url = `${API_ENDPOINTS.PERMISSION.CHECK}?resource=${resource}&action=${action}${userId ? `&userId=${userId}` : ''}`;
    return apiClient.get<{ hasPermission: boolean }>(url);
  }

  /**
   * Get all permissions (for dropdown/select components)
   */
  static async getAllPermissions(): Promise<ApiResponse<PermissionDto[]>> {
    const response = await this.getPermissions({ 
      pageNumber: 1, 
      pageSize: 1000, 
      sortBy: 'name', 
      sortDirection: 'asc', 
      isActive: true 
    });
    if (response.success) {
      return {
        success: true,
        data: response.data.permissions,
        message: 'Permissions retrieved successfully',
      };
    }
    return response as any;
  }

  /**
   * Get permissions by resource
   */
  static async getPermissionsByResource(resource: string): Promise<ApiResponse<PermissionDto[]>> {
    const response = await this.getPermissions({ 
      resource, 
      pageNumber: 1, 
      pageSize: 1000, 
      sortBy: 'name', 
      sortDirection: 'asc',
      isActive: true 
    });
    if (response.success) {
      return {
        success: true,
        data: response.data.permissions,
        message: 'Permissions retrieved successfully',
      };
    }
    return response as any;
  }

  /**
   * Get permissions by action
   */
  static async getPermissionsByAction(action: string): Promise<ApiResponse<PermissionDto[]>> {
    const response = await this.getPermissions({ 
      action, 
      pageNumber: 1, 
      pageSize: 1000, 
      sortBy: 'name', 
      sortDirection: 'asc',
      isActive: true 
    });
    if (response.success) {
      return {
        success: true,
        data: response.data.permissions,
        message: 'Permissions retrieved successfully',
      };
    }
    return response as any;
  }

  /**
   * Bulk delete permissions (Admin only)
   */
  static async bulkDeletePermissions(permissionIds: string[]): Promise<ApiResponse<void>> {
    const promises = permissionIds.map(id => this.deletePermission(id));
    await Promise.all(promises);
    return { success: true, data: undefined, message: 'Permissions deleted successfully' };
  }

  /**
   * Get unique resources
   */
  static async getUniqueResources(): Promise<ApiResponse<string[]>> {
    const response = await this.getAllPermissions();
    if (response.success) {
      const resources = [...new Set(response.data.map(p => p.resource))];
      return {
        success: true,
        data: resources,
        message: 'Resources retrieved successfully',
      };
    }
    return response as any;
  }

  /**
   * Get unique actions
   */
  static async getUniqueActions(): Promise<ApiResponse<string[]>> {
    const response = await this.getAllPermissions();
    if (response.success) {
      const actions = [...new Set(response.data.map(p => p.action))];
      return {
        success: true,
        data: actions,
        message: 'Actions retrieved successfully',
      };
    }
    return response as any;
  }
}
