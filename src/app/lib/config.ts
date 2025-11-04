export type Environment = 'development' | 'production';

const environments = {
  development: {
    apiBaseUrl: 'https://api.tourease.me/api',
    adminApiBaseUrl: 'https://api.tourease.me/api/admin'
  },
  production: {
    apiBaseUrl: 'https://api.tourease.me/api',
    adminApiBaseUrl: 'https://api.tourease.me/api/admin'
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