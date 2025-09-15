// Debug utility for avatar issues
const DEBUG_AVATAR = false; // Set to true to enable debug logging

export const debugAvatar = (context: string, data: any) => {
  if (DEBUG_AVATAR) {
    console.log(`[AVATAR DEBUG] ${context}:`, data);
  }
};

export const debugProfile = (context: string, data: any) => {
  if (DEBUG_AVATAR) {
    console.log(`[PROFILE DEBUG] ${context}:`, data);
  }
};

export const debugAuth = (context: string, data: any) => {
  if (DEBUG_AVATAR) {
    console.log(`[AUTH DEBUG] ${context}:`, data);
  }
};
