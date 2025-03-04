/**
 * Document Processing Module
 * 
 * This module provides functionality for processing documents through the Node.js backend.
 * It handles file uploads, model selection, and query processing for the document Q&A system.
 */

// Determine the correct API base URL based on the environment
const getApiBaseUrl = () => {
  // Check if we're running in a deployed environment with a different hostname
  const isDeployed = window.location.hostname !== 'localhost' && 
                     !window.location.hostname.includes('127.0.0.1');
  
  // If deployed, use relative URLs to ensure requests go to the same origin
  // Otherwise, use the explicit localhost URL with the specific port
  return isDeployed ? '' : `http://${window.location.hostname}:5000`;
};

// API endpoints for the backend
const API_BASE_URL = getApiBaseUrl();
const MODELS_ENDPOINT = `${API_BASE_URL}/api/models`;
const UPLOAD_ENDPOINT = `${API_BASE_URL}/api/upload`;
const QUERY_ENDPOINT = `${API_BASE_URL}/api/query`;

/**
 * Interface for the QA Chain return object
 */
interface QAChainResult {
  sessionId: string;
  model: string;
  call: (params: { query: string; callbacks?: any[] }) => Promise<{ result: string }>;
  llm: { model: string };
}

/**
 * Load and process a document file via the backend
 * @param file - The document file to process (PDF, DOCX, XLSX, XLS)
 * @param modelName - The name of the model to use
 * @returns A session ID for future queries
 */
export const initializeQAChain = async (file: File, modelName: string): Promise<QAChainResult> => {
  try {
    console.log(`Initializing QA chain with file: ${file.name}, model: ${modelName}`);
    console.log(`Using API endpoint: ${UPLOAD_ENDPOINT}`);
    
    // Create FormData object with file and model
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', modelName);
    
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3-minute timeout
    
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
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
      let errorMessage = `Upload failed with status ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `Network error: Received HTML instead of JSON. Check that the backend is accessible at ${UPLOAD_ENDPOINT}`;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("QA chain initialized successfully with session ID:", data.session_id);
    
    // Return object with session ID and model
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
    if (error.name === 'AbortError') {
      console.error("Upload timed out after 3 minutes");
      throw new Error("Document upload timed out. The file might be too large or the server is busy.");
    }
    
    console.error("Error initializing QA chain:", error, "API URL:", UPLOAD_ENDPOINT);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error connecting to ${UPLOAD_ENDPOINT}. Ensure the backend is running and accessible.`);
    }
    
    throw new Error(error.message || "Failed to initialize the QA chain.");
  }
};

/**
 * Interface for the QA Chain session data
 */
interface QAChainSession {
  sessionId: string;
  model: string;
}

/**
 * Process a query using the backend
 * @param query - The question to ask
 * @param qaChain - The QA chain object with sessionId
 * @param streamCallback - Optional callback for streaming tokens
 * @returns The answer to the question
 */
export const processQuery = async (
  query: string, 
  qaChain: QAChainSession, 
  streamCallback?: (token: string) => void
): Promise<string> => {
  try {
    console.log(`Processing query with session ID: ${qaChain.sessionId}`);
    console.log(`Using API endpoint: ${QUERY_ENDPOINT}`);
    
    // Add timeout control
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 1-minute timeout
    
    // Send query to backend
    const response = await fetch(QUERY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        session_id: qaChain.sessionId,
        query: query
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Query failed with status ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `Network error: Received HTML instead of JSON. Check that the backend is accessible at ${QUERY_ENDPOINT}`;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Query processed successfully:", data);
    
    // Handle streaming if callback provided
    if (streamCallback && data.tokens) {
      for (const token of data.tokens) {
        streamCallback(token);
      }
    }
    
    return data.answer || "No answer found.";
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("Query processing timed out");
      return "The query processing timed out. Please try a simpler question or try again later.";
    }
    
    console.error("Error processing query:", error, "API URL:", QUERY_ENDPOINT);
    
    if (error.message && error.message.includes('Failed to fetch')) {
      return `Could not connect to the backend at ${QUERY_ENDPOINT}. Please ensure the server is running.`;
    } else if (error.message && error.message.includes('model not found')) {
      return `The model "${qaChain.model}" was not found. Please ensure it is available on the server.`;
    }
    
    return error.message || "An error occurred while processing your query.";
  }
};

/**
 * Get available models from the backend
 * @returns List of available models
 */
export const getOllamaModels = async (): Promise<string[]> => {
  try {
    console.log(`Fetching models from: ${MODELS_ENDPOINT}`);
    
    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    
    const response = await fetch(MODELS_ENDPOINT, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch models: ${response.status}`, errorText);
      
      // Check for HTML response
      if (errorText.includes('<!DOCTYPE html>')) {
        console.error("Received HTML instead of JSON, likely a network issue");
      }
      
      throw new Error(`Failed to fetch models (Status: ${response.status})`);
    }
    
    const data = await response.json();
    console.log("Available models:", data.models);
    return data.models || [];
  } catch (error: any) {
    // Log error with timeout detection
    if (error.name === 'AbortError') {
      console.error("Models API call timed out");
    } else {
      console.error("Error fetching models:", error, "API URL:", MODELS_ENDPOINT);
    }
    
    // Provide default models as fallback
    return ["llama3", "mistral", "gemma", "phi"];
  }
};

// Export API_BASE_URL for use in other components
export { API_BASE_URL };

/**
 * Get the file type display name
 * @param filename - The filename to check
 * @returns The display name for the file type
 */
export const getFileTypeDisplay = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'PDF';
    case 'docx': return 'Word';
    case 'xlsx': 
    case 'xls': return 'Excel';
    default: return extension?.toUpperCase() || 'Document';
  }
};

/**
 * Check if a file is supported
 * @param file - The file to check
 * @returns Whether the file is supported
 */
export const isSupportedFileType = (file: File): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const supportedExtensions = ['pdf', 'docx', 'xlsx', 'xls'];
  return supportedExtensions.includes(extension || '');
};

/**
 * Check if a file size is within limits
 * @param file - The file to check
 * @param maxSizeMB - Maximum file size in MB
 * @returns Whether the file size is within limits
 */
export const isFileSizeValid = (file: File, maxSizeMB: number = 20): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Upload a document to the admin backend
 * @param file - The file to upload
 * @param title - Document title
 * @param description - Document description
 * @param modelName - Model to use
 * @param adminToken - Admin token for authentication
 * @returns The server response
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
    
    // Use AbortController for timeout
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
        'Cache-Control': 'no-cache'
      },
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Document upload failed with status ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `Network error: Received HTML instead of JSON. Check that the backend is accessible at ${API_BASE_URL}/admin/upload`;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    console.log("Document uploaded successfully");
    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("Document upload timed out");
      throw new Error("Document upload timed out. The file might be too large or the server is busy.");
    }
    
    console.error("Error uploading document:", error, "API URL:", `${API_BASE_URL}/admin/upload`);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error connecting to ${API_BASE_URL}/admin/upload. Ensure the server is running.`);
    }
    
    throw new Error(error.message || "Failed to upload and process the document.");
  }
};
