export interface LoginRequestDto {
  emailOrPhone: string;
  password: string;
  deviceId: string;
  deviceName?: string;
  rememberMe: boolean;
}

export interface RegisterRequestDto {
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  deviceId: string;
  deviceName?: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
  deviceId: string;
}

export interface LogoutRequestDto {
  refreshToken: string;
  deviceId: string;
}

export interface LogoutAllRequestDto {
  refreshToken: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: UserDto;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface UserDto {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  roles: string[];
  permissions: string[];
}
