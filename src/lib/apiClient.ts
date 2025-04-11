
/**
 * API client for interacting with the backend
 * Provides methods for fetching documents, prompts, and handling queries
 */

import { API_BASE_URL, apiUrl } from "@/config/apiConfig";

// Shared error handling to reduce duplication
const handleApiError = (error: any, context: string) => {
  console.error(`Error ${context}:`, error);
  throw error;
};

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

// Shared response processing 
const processResponse = async (response: Response, errorPrefix: string) => {
  if (!response.ok) {
    throw new Error(`${errorPrefix}: ${response.status}`);
  }
  return await response.json();
};

/**
 * Fetch all available documents from the API
 * @returns Promise with array of documents
 */
export const fetchDocuments = async () => {
  try {
    const response = await fetchWithRetry(apiUrl('/api/documents'));
    const data = await processResponse(response, 'Failed to fetch documents');
    return data.documents || [];
  } catch (error) {
    handleApiError(error, "fetching documents");
  }
};

/**
 * Fetch all available system prompts
 * @returns Promise with array of system prompts
 */
export const fetchSystemPrompts = async () => {
  try {
    const response = await fetchWithRetry(apiUrl('/api/system-prompts'));
    const data = await processResponse(response, 'Failed to fetch system prompts');
    return data.prompts || [];
  } catch (error) {
    handleApiError(error, "fetching system prompts");
  }
};

// Type definitions to improve type safety
type RetrievalOptions = {
  chunkCount?: number;
  similarityThreshold?: number;
  similarityMetric?: "cosine" | "l2" | "dot_product";
};

type SelectDocumentOptions = {
  promptId?: string;
  temperature?: number;
  retrievalOptions?: RetrievalOptions;
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
  options: SelectDocumentOptions = {}
) => {
  try {
    const { promptId = 'default', temperature = 0.0, retrievalOptions } = options;
    
    const payload = {
      document_id: documentId,
      model: model,
      prompt_id: promptId,
      temperature: temperature,
      retrieval_options: retrievalOptions ? {
        chunk_count: retrievalOptions.chunkCount || 5,
        similarity_threshold: retrievalOptions.similarityThreshold || 0.7,
        similarity_metric: retrievalOptions.similarityMetric || "cosine"
      } : { similarity_metric: "cosine" }
    };
    
    const response = await fetchWithRetry(apiUrl('/api/select-document'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    return await processResponse(response, 'Failed to select document');
  } catch (error) {
    handleApiError(error, "selecting document");
  }
};

type QueryOptions = {
  stream?: boolean;
  enhanceFactualAccuracy?: boolean;
  maxNewTokens?: number;
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
  options: QueryOptions = {}
) => {
  try {
    const { stream = false, enhanceFactualAccuracy = true, maxNewTokens = 1024 } = options;
    
    const payload = {
      session_id: sessionId,
      query: query,
      stream: stream,
      enhance_factual_accuracy: enhanceFactualAccuracy,
      max_new_tokens: maxNewTokens
    };
    
    const response = await fetchWithRetry(apiUrl('/api/query'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to process query: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, "processing query");
  }
};
