
import { API_BASE_URL } from '@/config/constants';
import { QAChainSession, processQuery } from './queryProcessor';

/**
 * Interface for the QA Chain return object
 */
export interface QAChainResult {
  sessionId: string;
  model: string;
  call: (params: { query: string; callbacks?: any[] }) => Promise<{ result: string }>;
  llm: { model: string };
}

/**
 * Load and process a document file via the Python backend
 * @param file - The document file to process (PDF, DOCX, XLSX, XLS)
 * @param modelName - The name of the Ollama model to use
 * @returns A session ID for future queries
 */
export const initializeQAChain = async (file: File, modelName: string): Promise<QAChainResult> => {
  const UPLOAD_ENDPOINT = `${API_BASE_URL}/api/upload`;
  
  try {
    console.log(`Initializing QA chain with file: ${file.name}, model: ${modelName}`);
    console.log(`Using API endpoint: ${UPLOAD_ENDPOINT}`);
    
    // Create optimized FormData object with only essential data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', modelName);
    
    // Use AbortController to allow timeout cancellation for long-running uploads
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3-minute timeout
    
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      // Explicitly prevent caching of upload requests
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Better error handling with HTTP status and message
      const errorText = await response.text();
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
        // If we got HTML instead of JSON, this is likely a network/routing issue
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `Network error: Received HTML instead of JSON. Check that the backend is accessible at ${UPLOAD_ENDPOINT}`;
        }
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("QA chain initialized successfully with session ID:", data.session_id);
    
    // Return an object with the session ID and model name for future queries
    return {
      sessionId: data.session_id,
      model: modelName,
      call: async ({ query, callbacks }: { query: string; callbacks?: any[] }) => {
        const result = await processQuery(query, { sessionId: data.session_id, model: modelName }, 
          callbacks && callbacks.length > 0 ? callbacks[0].handleLLMNewToken : null);
        return { result };
      },
      llm: { model: modelName }
    };
  } catch (error: any) {
    // Enhanced error logging with more details
    if (error.name === 'AbortError') {
      console.error("Upload timed out after 3 minutes");
      throw new Error("Document upload timed out. The file might be too large or the server is busy.");
    }
    
    console.error("Error initializing QA chain:", error, error.stack, "API URL:", UPLOAD_ENDPOINT);
    
    // Provide more specific error messages for network issues
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error connecting to ${UPLOAD_ENDPOINT}. Ensure the Python backend is running and accessible from your current network.`);
    }
    
    throw new Error(error.message || "Failed to initialize the QA chain.");
  }
};

/**
 * Upload a document to the admin backend
 * @param file - The file to upload
 * @param title - Title for the document
 * @param description - Description for the document
 * @param modelName - Ollama model to use
 * @param adminToken - Admin token for authentication
 * @returns The response from the server
 */
export const uploadDocument = async (
  file: File,
  title: string,
  description: string,
  modelName: string,
  adminToken: string
) => {
  try {
    console.log(`Uploading document: ${file.name}, size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Using API endpoint: ${API_BASE_URL}/admin/upload`);
    
    // Use AbortController for upload timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3-minute timeout
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('model', modelName);
    
    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Better error handling with HTTP status context
      const errorText = await response.text();
      let errorMessage = `Document upload failed with status ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
        // If we got HTML instead of JSON, this is likely a network/routing issue
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `Network error: Received HTML instead of JSON. Check that the backend is accessible at ${API_BASE_URL}/admin/upload`;
        }
      }
      throw new Error(errorMessage);
    }
    
    console.log("Document uploaded successfully");
    return await response.json();
  } catch (error: any) {
    // Enhanced error handling
    if (error.name === 'AbortError') {
      console.error("Document upload timed out");
      throw new Error("Document upload timed out. The file might be too large or the server is busy.");
    }
    
    console.error("Error uploading document:", error, "API URL:", `${API_BASE_URL}/admin/upload`);
    
    // Provide more specific error for network issues
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error connecting to ${API_BASE_URL}/admin/upload. Ensure the Python backend is running and accessible from your current network.`);
    }
    
    throw new Error(error.message || "Failed to upload and process the document.");
  }
};
