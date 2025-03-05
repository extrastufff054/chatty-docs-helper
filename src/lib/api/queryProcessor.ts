
import { API_BASE_URL } from '@/config/constants';

/**
 * Interface for the QA Chain session data
 */
export interface QAChainSession {
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
  const QUERY_ENDPOINT = `${API_BASE_URL}/api/query`;
  
  try {
    console.log(`Processing query with session ID: ${qaChain.sessionId}`);
    console.log(`Using API endpoint: ${QUERY_ENDPOINT}`);
    
    // Add timeout control for query processing
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 1-minute timeout
    
    // Send the query to the backend
    const response = await fetch(QUERY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({
        session_id: qaChain.sessionId,
        query: query
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Improved error handling with status code context
      const errorText = await response.text();
      let errorMessage = `Query failed with status ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
        // If we got HTML instead of JSON, this is likely a network/routing issue
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `Network error: Received HTML instead of JSON. Check that the backend is accessible at ${QUERY_ENDPOINT}`;
        }
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Query processed successfully");
    
    // If streaming callback is provided and tokens are available, stream them
    if (streamCallback && data.tokens) {
      for (const token of data.tokens) {
        streamCallback(token);
      }
    }
    
    return data.answer || "No answer found.";
  } catch (error: any) {
    // Better error handling with AbortController support
    if (error.name === 'AbortError') {
      console.error("Query processing timed out");
      return "The query processing timed out. Please try a simpler question or try again later.";
    }
    
    console.error("Error processing query:", error, "API URL:", QUERY_ENDPOINT);
    
    // Provide more specific error messages for common issues
    if (error.message && error.message.includes('Failed to fetch')) {
      return `Could not connect to the backend at ${QUERY_ENDPOINT}. Please ensure the Python server is running and accessible from your current network.`;
    } else if (error.message && error.message.includes('model not found')) {
      return `The model "${qaChain.model}" was not found. Please ensure it is pulled locally using the Ollama CLI: "ollama pull ${qaChain.model}"`;
    } else if (error.message && error.message.includes('<!DOCTYPE html>')) {
      return `Network error: Received HTML instead of JSON. Check that the backend is accessible at ${QUERY_ENDPOINT}`;
    }
    
    return error.message || "An error occurred while processing your query.";
  }
};
