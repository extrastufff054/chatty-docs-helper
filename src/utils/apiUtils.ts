
import { API_BASE_URL } from '@/config/constants';

/**
 * Enhanced fetch function with better error handling and automatic retries
 * 
 * @param endpoint The API endpoint to fetch from (without the base URL)
 * @param options Fetch options
 * @param retries Number of retries if the fetch fails
 * @returns The fetch response
 */
export async function apiFetch(
  endpoint: string, 
  options: RequestInit = {}, 
  retries = 3
): Promise<Response> {
  // Add default headers for better caching behavior
  const defaultHeaders = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  // Combine default headers with any user-provided headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  };

  // Construct the full URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`Fetching from: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    
    // If we have retries left, try again after a delay
    if (retries > 0) {
      console.log(`Retrying fetch for ${url}, ${retries} retries left`);
      // Wait for a short time before retrying (using exponential backoff)
      const delay = 1000 * Math.pow(2, 3 - retries);
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiFetch(endpoint, options, retries - 1);
    }
    
    // If no retries left, throw the error
    throw error;
  }
}

/**
 * Process a fetch response and extract JSON data with error handling
 * 
 * @param response The fetch response to process
 * @returns The JSON data from the response
 */
export async function processApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    } catch (e) {
      // If we can't parse the error response as JSON, use the status text
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
  }
  
  return await response.json();
}
