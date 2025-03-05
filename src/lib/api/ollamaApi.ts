
import { API_BASE_URL } from '@/config/constants';

/**
 * Get available Ollama models from the Python backend
 * @returns A list of available Ollama models
 */
export const getOllamaModels = async (): Promise<string[]> => {
  try {
    const MODELS_ENDPOINT = `${API_BASE_URL}/api/models`;
    console.log(`Fetching Ollama models from: ${MODELS_ENDPOINT}`);
    
    // Add timeout for API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    
    const response = await fetch(MODELS_ENDPOINT, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch models: ${response.status}`, errorText);
      
      // Check if we got HTML instead of JSON
      if (errorText.includes('<!DOCTYPE html>')) {
        console.error("Received HTML instead of JSON, likely a network or routing issue");
      }
      
      throw new Error(`Failed to fetch models from the backend (Status: ${response.status})`);
    }
    
    const data = await response.json();
    console.log("Available models:", data.models);
    return data.models || [];
  } catch (error: any) {
    // Enhanced error logging with timeout detection
    if (error.name === 'AbortError') {
      console.error("Models API call timed out");
    } else {
      console.error("Error fetching Ollama models:", error, "API URL:", `${API_BASE_URL}/api/models`);
    }
    
    // Provide more specific error for network issues
    if (error.message && error.message.includes('Failed to fetch')) {
      console.error(`Network error connecting to ${API_BASE_URL}/api/models`);
    }
    
    // Return some default models as fallback
    return ["llama3", "mistral", "gemma", "phi"];
  }
};
