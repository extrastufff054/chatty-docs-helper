
/**
 * API client for interacting with the backend
 * Provides methods for fetching documents, prompts, and handling queries
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

export const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch all available documents from the API
 * @returns Promise with array of documents
 */
export const fetchDocuments = async () => {
  try {
    console.log('Fetching documents from:', `${API_BASE_URL}/api/documents`);
    const response = await fetch(`${API_BASE_URL}/api/documents`);
    
    if (!response.ok) {
      console.error('Error response:', await response.text());
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Documents fetched successfully:', data);
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
    console.log('Fetching system prompts from:', `${API_BASE_URL}/api/system-prompts`);
    const response = await fetch(`${API_BASE_URL}/api/system-prompts`);
    
    if (!response.ok) {
      console.error('Error response:', await response.text());
      throw new Error(`Failed to fetch system prompts: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('System prompts fetched successfully:', data);
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
 * @returns Promise with session ID
 */
export const selectDocument = async (documentId: string, model: string) => {
  try {
    console.log('Selecting document:', documentId, 'with model:', model);
    console.log('API URL:', `${API_BASE_URL}/api/select-document`);
    
    const response = await fetch(`${API_BASE_URL}/api/select-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        model: model,
        prompt_id: 'default',  // Always use default prompt
        temperature: 0.0       // Fixed temperature
      }),
    });
    
    if (!response.ok) {
      console.error('Error response:', await response.text());
      throw new Error(`Failed to select document: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Document selected successfully:', data);
    return data;
  } catch (error) {
    console.error("Error selecting document:", error);
    throw error;
  }
};

/**
 * Process a query against a selected document
 * @param sessionId Session ID for the query
 * @param query Query text
 * @returns Promise with answer and tokens
 */
export const processQuery = async (sessionId: string, query: string) => {
  try {
    console.log('Processing query with session ID:', sessionId);
    console.log('API URL:', `${API_BASE_URL}/api/query`);
    
    const response = await fetch(`${API_BASE_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        query: query
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Failed to process query: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Failed to process query: ${response.status}`);
      }
    }
    
    // Get the full, unfiltered response
    const data = await response.json();
    console.log('Query processed successfully:', data);
    
    return data;
  } catch (error) {
    console.error("Error processing query:", error);
    throw error;
  }
};
