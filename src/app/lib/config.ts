export type Environment = 'development' | 'production';

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

const getCurrentEnvironment = (): Environment => {
  return (process.env.NEXT_PUBLIC_ENV as Environment) || 'development';
};

export const config = environments[getCurrentEnvironment()];

export const getApiUrl = (endpoint: string = ''): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};

export const getAdminApiUrl = (endpoint: string = ''): string => {
  return `${config.adminApiBaseUrl}${endpoint}`;
};

export const currentEnvironment = getCurrentEnvironment(); 