/**
 * Document Processing Module
 * 
 * This module provides functionality for processing documents through a Python backend.
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

// API endpoints for the Python backend
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
 * Load and process a document file via the Python backend
 * @param file - The document file to process (PDF, DOCX, XLSX, XLS)
 * @param modelName - The name of the Ollama model to use
 * @returns A session ID for future queries
 */
export const initializeQAChain = async (file: File, modelName: string): Promise<QAChainResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', modelName);
    
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload and process the document");
    }
    
    const data = await response.json();
    
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
    console.error("Error initializing QA chain:", error);
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
 * Process a query using the Python backend
 * @param query - The question to ask
 * @param qaChain - The QA chain object with sessionId
 * @param streamCallback - A callback function that receives streaming tokens
 * @returns The final answer to the question
 */
export const processQuery = async (
  query: string, 
  qaChain: QAChainSession, 
  streamCallback?: (token: string) => void
): Promise<string> => {
  try {
    // Send the query to the backend
    const response = await fetch(QUERY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: qaChain.sessionId,
        query: query
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process the query");
    }
    
    const data = await response.json();
    
    // If streaming callback is provided and tokens are available, stream them
    if (streamCallback && data.tokens) {
      for (const token of data.tokens) {
        streamCallback(token);
      }
    }
    
    return data.answer || "No answer found.";
  } catch (error: any) {
    console.error("Error processing query:", error);
    
    // Check for specific Ollama errors
    if (error.message && error.message.includes("Failed to fetch")) {
      return "Could not connect to the backend. Please ensure the Python server is running.";
    } else if (error.message && error.message.includes("model not found")) {
      return `The model "${qaChain.model}" was not found. Please ensure it is pulled locally using the Ollama CLI: "ollama pull ${qaChain.model}"`;
    }
    
    return error.message || "An error occurred while processing your query.";
  }
};

/**
 * Get available Ollama models from the Python backend
 * @returns A list of available Ollama models
 */
export const getOllamaModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(MODELS_ENDPOINT);
    
    if (!response.ok) {
      throw new Error("Failed to fetch models from the backend");
    }
    
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    // Return some default models as fallback
    return ["llama3", "mistral", "gemma", "phi"];
  }
};

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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('model', modelName);
    
    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload document");
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("Error uploading document:", error);
    throw new Error(error.message || "Failed to upload and process the document.");
  }
};
