export interface RoleFilterDto {
  searchTerm?: string;
  isActive?: boolean;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}

export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string; // ISO string instead of Date object
  updatedAt: string; // ISO string instead of Date object
  permissions: string[];
  userCount: number;
}

export interface RoleCreateDto {
  name: string;
  description?: string;
  isActive: boolean;
  permissionIds: string[];
}

export interface RoleUpdateDto {
  name: string;
  description?: string;
  isActive: boolean;
  permissionIds: string[];
}

export interface RoleAssignmentDto {
  userId: string;
  roleIds: string[];
  expiresAt?: Date;
}

export interface RoleAssignmentResponseDto {
  userId: string;
  userName: string;
  roles: RoleDto[];
  assignedAt: Date;
}

export interface RoleListDto {
  roles: RoleDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
