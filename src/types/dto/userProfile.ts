export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileUpdateDto {
  fullName: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAvatarDto {
  avatar: File;
}
