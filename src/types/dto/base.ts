// API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
