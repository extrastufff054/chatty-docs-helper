
// API Base URL configuration
// Dynamically determine the API base URL based on environment and deployment context
export const API_BASE_URL = (() => {
  // Check if we're in a deployed environment or running locally
  const isLocalhost = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';

  // Get the current hostname for dynamic configuration
  const hostname = window.location.hostname;
  
  // For local development, prefer the proxy setup through Vite
  if (isLocalhost) {
    // Use relative URL which will work with Vite's proxy
    return '';
  }
  
  // For deployed environments, try to connect directly to the backend
  // We remove the port specification to allow the browser to use the same port
  // This works better with various deployment scenarios
  return `${window.location.protocol}//${hostname}`;
})();

console.log(`API_BASE_URL configured as: ${API_BASE_URL}`);
