export interface PermissionDto {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  roleCount: number;
}

export interface PermissionCreateDto {
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export interface PermissionUpdateDto {
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export interface BulkPermissionDto {
  permissionIds: string[];
  operation: string;
}

export interface PermissionAssignmentDto {
  roleId: string;
  permissionIds: string[];
}

export interface PermissionAssignmentResponseDto {
  roleId: string;
  roleName: string;
  permissions: PermissionDto[];
  assignedAt: Date;
}

export interface PermissionListDto {
  permissions: PermissionDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PermissionFilterDto {
  searchTerm?: string;
  resource?: string;
  action?: string;
  isActive?: boolean;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}
