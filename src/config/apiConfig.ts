
/**
 * API configuration for the application
 * Handles different environments: development, production, and containerized deployments
 */

// Determine the correct API base URL based on the environment
export const getApiBaseUrl = (): string => {
  // In production, use relative URLs for same-origin requests
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, check if we're running in a Docker/container environment
  // where frontend and backend share the same hostname but different ports
  const hostname = window.location.hostname;
  
  // Default development setup with explicit port for local development
  return `http://${hostname}:5000`;
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
