export interface UserCreateDto {
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  roleIds: string[];
}

export interface UserAdminUpdateDto {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  roleIds: string[];
}

export interface UserListItemDto {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO string instead of Date object
  lastLoginAt?: string; // ISO string instead of Date object
  roles: string[];
}

export interface UserListDto {
  users: UserListItemDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface UserFilterDto {
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdFrom?: Date;
  createdTo?: Date;
  lastLoginFrom?: Date;
  lastLoginTo?: Date;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}

export interface BulkUserDto {
  userIds: string[];
  operation: string;
}

export interface UserStatsDto {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  emailVerifiedUsers: number;
  phoneVerifiedUsers: number;
  newUsersLast30Days: number;
  activeUsersToday: number;
}

export interface UpdateUserRequestDto {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface UpdateUserResponseDto {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  updatedAt: Date;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
