
/**
 * API configuration for the application
 * Handles different environments: development, production, and containerized deployments
 */

// Determine the correct API base URL based on the environment
export const getApiBaseUrl = (): string => {
  // In production or when served through nginx, use relative URLs for API requests
  // This ensures requests go to the same host that serves the app
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, use the development server address
  return 'http://localhost:5000';
};

// The base URL for API requests
export const API_BASE_URL = getApiBaseUrl();

/**
 * Utility function to create a fully qualified API URL
 * @param endpoint The API endpoint path (should start with /)
 * @returns The complete API URL
 */
export const apiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
