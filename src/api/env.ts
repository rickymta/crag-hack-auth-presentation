export const getEnvVariable = (key: string, defaultValue: string): string => {
  // Client-side
  if (typeof window !== 'undefined') {
    const viteKey = `VITE_${key}`;
    if (typeof import.meta.env !== 'undefined' && import.meta.env[viteKey]) {
      return import.meta.env[viteKey] as string;
    }
    return defaultValue;
  }
  
  // Server-side
  if (typeof process !== 'undefined' && process.env[key]) {
    return process.env[key] as string;
  }
  
  return defaultValue;
};
