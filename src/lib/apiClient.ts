
/**
 * API client for interacting with the backend
 * Provides methods for fetching documents, prompts, and handling queries
 */

import { API_BASE_URL, apiUrl } from "@/config/apiConfig";

// Utility function for API requests with error handling and retries
const fetchWithRetry = async (url: string, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (retries <= 1) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 1.5);
  }
};

/**
 * Fetch all available documents from the API
 * @returns Promise with array of documents
 */
export const fetchDocuments = async () => {
  try {
    const response = await fetchWithRetry(apiUrl('/api/documents'));
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

/**
 * Fetch all available system prompts
 * @returns Promise with array of system prompts
 */
export const fetchSystemPrompts = async () => {
  try {
    const response = await fetchWithRetry(apiUrl('/api/system-prompts'));
    if (!response.ok) {
      throw new Error(`Failed to fetch system prompts: ${response.status}`);
    }
    const data = await response.json();
    return data.prompts || [];
  } catch (error) {
    console.error("Error fetching system prompts:", error);
    throw error;
  }
};

/**
 * Select a document for querying
 * @param documentId Document ID to select
 * @param model Model to use for the document
 * @param options Optional parameters for document selection
 * @returns Promise with session ID
 */
export const selectDocument = async (
  documentId: string, 
  model: string, 
  options: { 
    promptId?: string; 
    temperature?: number;
    retrievalOptions?: {
      chunkCount?: number;
      similarityThreshold?: number;
    }
  } = {}
) => {
  try {
    const response = await fetchWithRetry(apiUrl('/api/select-document'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        model: model,
        prompt_id: options.promptId || 'default',
        temperature: options.temperature !== undefined ? options.temperature : 0.0,
        retrieval_options: options.retrievalOptions ? {
          chunk_count: options.retrievalOptions.chunkCount || 5,
          similarity_threshold: options.retrievalOptions.similarityThreshold || 0.7
        } : undefined
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to select document: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error selecting document:", error);
    throw error;
  }
};

/**
 * Process a query against a selected document
 * @param sessionId Session ID for the query
 * @param query Query text
 * @param options Additional query options
 * @returns Promise with answer and tokens
 */
export const processQuery = async (
  sessionId: string, 
  query: string,
  options: {
    stream?: boolean;
    enhanceFactualAccuracy?: boolean;
    maxNewTokens?: number;
  } = {}
) => {
  try {
    const response = await fetchWithRetry(apiUrl('/api/query'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        query: query,
        stream: options.stream || false,
        enhance_factual_accuracy: options.enhanceFactualAccuracy !== undefined ? 
          options.enhanceFactualAccuracy : true,
        max_new_tokens: options.maxNewTokens || 1024
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to process query: ${response.status}`);
    }
    
    // Get the full, unfiltered response
    const rawData = await response.json();
    
    // Do not apply any client-side filtering - return everything
    return rawData;
  } catch (error) {
    console.error("Error processing query:", error);
    throw error;
  }
};
