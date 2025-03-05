
// API Base URL configuration
// Dynamically determine the API base URL based on environment and deployment context
export const API_BASE_URL = (() => {
  // Check if we're in a deployed environment or running locally
  const isLocalhost = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';

  // For local development, use the hardcoded localhost URL with correct port
  if (isLocalhost) {
    return 'http://localhost:5000';
  }
  
  // Use the same origin (hostname) as the frontend when deployed
  // This works when both frontend and backend are on the same domain
  // but potentially different ports or subpaths
  return `${window.location.protocol}//${window.location.hostname}:5000`;
})();

console.log(`API_BASE_URL configured as: ${API_BASE_URL}`);
