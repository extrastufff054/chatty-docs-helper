
/**
 * Document Processing Module
 * 
 * This module provides functionality for processing documents through a Python backend.
 * It handles file uploads, model selection, and query processing for the document Q&A system.
 */

// Determine the correct API base URL based on the environment
const getApiBaseUrl = () => {
  return import.meta.env.PROD ? '' : `http://${window.location.hostname}:5000`;
};

// API endpoints for the Python backend
const API_BASE_URL = getApiBaseUrl();
const API_ENDPOINTS = {
  MODELS: `${API_BASE_URL}/api/models`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  QUERY: `${API_BASE_URL}/api/query`,
  SELECT_DOCUMENT: `${API_BASE_URL}/api/select-document`,
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  SYSTEM_PROMPTS: `${API_BASE_URL}/api/system-prompts`,
  ADMIN_UPLOAD: `${API_BASE_URL}/admin/upload`
};

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
 * Enumeration of available similarity metrics
 */
export enum SimilarityMetric {
  COSINE = "cosine",
  L2 = "l2", 
  DOT_PRODUCT = "dot_product"
}

/**
 * Interface for document retrieval options
 */
interface RetrievalOptions {
  chunkCount?: number;
  similarityThreshold?: number;
  similarityMetric?: SimilarityMetric;
}

/**
 * Handles API fetch with timeout control and error handling
 * @param url API endpoint URL
 * @param options Fetch options
 * @param timeoutMs Timeout in milliseconds
 * @returns Promise with response
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
      }
      
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Load and process a document file via the Python backend
 * @param file The document file to process (PDF, DOCX, XLSX, XLS)
 * @param modelName The name of the Ollama model to use
 * @param retrievalOptions Options for document retrieval
 * @returns A session ID for future queries
 */
export const initializeQAChain = async (
  file: File, 
  modelName: string,
  retrievalOptions: RetrievalOptions = {
    similarityMetric: SimilarityMetric.COSINE // Default to cosine similarity
  }
): Promise<QAChainResult> => {
  try {
    // Create optimized FormData object with only essential data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', modelName);
    
    // Add retrieval options if provided
    if (retrievalOptions) {
      formData.append('retrieval_options', JSON.stringify({
        chunk_count: retrievalOptions.chunkCount || 7,
        similarity_threshold: retrievalOptions.similarityThreshold || 0.7,
        similarity_metric: retrievalOptions.similarityMetric || SimilarityMetric.COSINE
      }));
    }
    
    const response = await fetchWithTimeout(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      body: formData
    }, 180000); // 3-minute timeout
    
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
    console.error("Error initializing QA chain:", error, error.stack);
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
 * @param query The question to ask
 * @param qaChain The QA chain object with sessionId
 * @param streamCallback A callback function that receives streaming tokens
 * @returns The final answer to the question
 */
export const processQuery = async (
  query: string, 
  qaChain: QAChainSession, 
  streamCallback?: (token: string) => void
): Promise<string> => {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.QUERY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: qaChain.sessionId,
        query: query
      })
    }, 60000); // 1-minute timeout
    
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
    } else if (error.message && error.message.includes("timed out")) {
      return "The query processing timed out. Please try a simpler question or try again later.";
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
    const response = await fetchWithTimeout(API_ENDPOINTS.MODELS, {}, 10000); // 10-second timeout
    const data = await response.json();
    return data.models || [];
  } catch (error: any) {
    console.error("Error fetching Ollama models:", error);
    // Return some default models as fallback
    return ["llama3", "mistral", "gemma", "phi"];
  }
};

// Export API_BASE_URL for use in other components
export { API_BASE_URL };

/**
 * Get the file type display name
 * @param filename The filename to check
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
 * @param file The file to upload
 * @param title Title for the document
 * @param description Description for the document
 * @param modelName Ollama model to use
 * @param adminToken Admin token for authentication
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
    
    const response = await fetchWithTimeout(API_ENDPOINTS.ADMIN_UPLOAD, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData
    }, 180000); // 3-minute timeout
    
    return await response.json();
  } catch (error: any) {
    console.error("Error uploading document:", error);
    throw new Error(error.message || "Failed to upload and process the document.");
  }
};
