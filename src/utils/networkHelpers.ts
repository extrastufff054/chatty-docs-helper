
/**
 * Network helper utilities for handling API requests, error handling, and retries
 */

import { toast } from "sonner";

/**
 * Fetch with timeout and retry capability
 * @param url The URL to fetch
 * @param options Fetch options
 * @param timeout Timeout in milliseconds (default: 10000ms)
 * @param retries Number of retries (default: 2)
 * @returns The fetch response or throws an error
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  timeout: number = 10000,
  retries: number = 2
): Promise<Response> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Add signal to options
  const fetchOptions = {
    ...options,
    signal: controller.signal
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    
    if (!response.ok && retries > 0) {
      console.warn(`Request to ${url} failed with status ${response.status}. Retrying...`);
      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      return fetchWithRetry(url, options, timeout, retries - 1);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error(`Request to ${url} timed out after ${timeout}ms`);
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    
    if (retries > 0) {
      console.warn(`Request to ${url} failed. Retrying...`, error);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      return fetchWithRetry(url, options, timeout, retries - 1);
    }
    
    throw error;
  }
}

/**
 * Handle API errors in a consistent way
 * @param error The error to handle
 * @param fallbackMessage A fallback message if the error doesn't have one
 */
export function handleApiError(error: unknown, fallbackMessage: string = "An error occurred"): void {
  console.error("API Error:", error);
  
  // Determine the error message to display
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    errorMessage = error.message;
  }
  
  // Show toast notification
  toast.error("API Error", {
    description: errorMessage,
    duration: 5000,
  });
}

/**
 * Check if the current environment is in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV === true;
}

/**
 * Log API request details in development mode
 * @param method The HTTP method
 * @param url The request URL
 * @param body Optional request body
 */
export function logApiRequest(method: string, url: string, body?: any): void {
  if (isDevelopment()) {
    console.group(`API Request: ${method} ${url}`);
    console.log("URL:", url);
    console.log("Method:", method);
    if (body) {
      console.log("Body:", body);
    }
    console.groupEnd();
  }
}
