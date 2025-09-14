import { apiClient } from './client';
import type { 
  UserProfileDto, 
  UserProfileUpdateDto, 
  ChangePasswordDto 
} from '../types/dto/userProfile';

export class UserProfileService {
  // Get current user profile
  static async getProfile(): Promise<UserProfileDto> {
    const response = await apiClient.get<UserProfileDto>('/user/profile');
    return response.data;
  }

  // Update user profile
  static async updateProfile(data: UserProfileUpdateDto): Promise<UserProfileDto> {
    const response = await apiClient.put<UserProfileDto>('/user/profile', data);
    return response.data;
  }

  // Change password
  static async changePassword(data: ChangePasswordDto): Promise<void> {
    await apiClient.post('/user/change-password', data);
  }

  // Upload avatar
  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatarFile', file);
    
    const response = await apiClient.post<{ avatarUrl: string }>(
      '/user/avatar', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Delete avatar
  static async deleteAvatar(): Promise<void> {
    await apiClient.delete('/user/avatar');
  }
}
