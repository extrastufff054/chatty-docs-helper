
/**
 * API configuration for the application
 * Handles different environments: development, production, and network access
 */

// Determine the correct API base URL based on the environment
export const getApiBaseUrl = (): string => {
  // In production or when served through nginx, use relative URLs for API requests
  if (import.meta.env.PROD) {
    return '';
  }
  
  // For development, get the actual hostname from the browser
  // This ensures proper network access from other devices
  const hostname = window.location.hostname;
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
