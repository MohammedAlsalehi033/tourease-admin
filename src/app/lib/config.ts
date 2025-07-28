// Environment configuration for API endpoints
export type Environment = 'development' | 'production';

// Environment configuration
const environments = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    adminApiBaseUrl: 'http://localhost:3000/api/admin'
  },
  production: {
    apiBaseUrl: 'http://13.201.19.41:3003/api',
    adminApiBaseUrl: 'http://13.201.19.41:3003/api/admin'
  }
};

// Get current environment from environment variable or default to development
const getCurrentEnvironment = (): Environment => {
  return (process.env.NEXT_PUBLIC_ENV as Environment) || 'production';
};

// Export the current environment configuration
export const config = environments[getCurrentEnvironment()];

// Helper function to get API URL for different endpoints
export const getApiUrl = (endpoint: string = ''): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};

// Helper function to get admin API URL for different endpoints
export const getAdminApiUrl = (endpoint: string = ''): string => {
  return `${config.adminApiBaseUrl}${endpoint}`;
};

// Export current environment for debugging
export const currentEnvironment = getCurrentEnvironment(); 