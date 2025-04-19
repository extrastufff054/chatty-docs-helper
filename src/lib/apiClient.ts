
/**
 * API client for interacting with the backend
 * Provides methods for fetching documents, prompts, and handling queries
 */

import { API_BASE_URL, apiUrl } from "@/config/apiConfig";

// Enhanced retry utility with exponential backoff and improved error handling
const fetchWithRetry = async (
  url: string, 
  options?: RequestInit, 
  retries = 3, 
  delay = 500
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      // Add cache-control directive for better performance
      cache: options?.method === 'GET' ? 'default' : 'no-store'
    });
    
    // Handle 4xx/5xx HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    return response;
  } catch (error) {
    if (retries <= 1) throw error;
    
    // Exponential backoff with jitter for better retry distribution
    const jitter = Math.random() * 200;
    await new Promise(resolve => setTimeout(resolve, delay + jitter));
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
      similarityMetric?: "cosine" | "l2" | "dot_product";
    }
  } = {}
) => {
  try {
    const response = await fetchWithRetry(apiUrl('/api/select-document'), {
      method: 'POST',
      body: JSON.stringify({
        document_id: documentId,
        model: model,
        prompt_id: options.promptId || 'default',
        temperature: options.temperature ?? 0.0,
        retrieval_options: options.retrievalOptions ? {
          chunk_count: options.retrievalOptions.chunkCount || 5,
          similarity_threshold: options.retrievalOptions.similarityThreshold || 0.7,
          similarity_metric: options.retrievalOptions.similarityMetric || "cosine"
        } : {
          similarity_metric: "cosine"
        }
      }),
    });
    
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
  if (!sessionId || !query.trim()) {
    throw new Error("Session ID and query are required");
  }

  try {
    const response = await fetchWithRetry(apiUrl('/api/query'), {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        query: query,
        stream: options.stream ?? false,
        enhance_factual_accuracy: options.enhanceFactualAccuracy ?? true,
        max_new_tokens: options.maxNewTokens || 1024
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error processing query:", error);
    throw error;
  }
};
