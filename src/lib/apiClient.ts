
/**
 * API Client Module
 * 
 * Provides functions for interacting with the backend API
 */

const API_BASE_URL = "http://localhost:5000/api";
const ADMIN_API_BASE_URL = "http://localhost:5000/admin";

/**
 * Interface for System Prompt
 */
export interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  temperature: number;
  description: string;
}

/**
 * Get system prompts from the API
 */
export const fetchSystemPrompts = async (): Promise<SystemPrompt[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/system-prompts`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch system prompts");
    }
    
    const data = await response.json();
    return data.prompts || [];
  } catch (error) {
    console.error("Error fetching system prompts:", error);
    throw new Error("Failed to fetch system prompts");
  }
};

/**
 * Get available documents from the API
 */
export const fetchDocuments = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }
    
    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
};

/**
 * Select a document and initialize the QA chain
 */
export const selectDocument = async (documentId: string, modelName: string, promptId: string = "default", temperature: number = 0): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/select-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document_id: documentId,
        model: modelName,
        prompt_id: promptId,
        temperature: temperature
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to select document");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error selecting document:", error);
    throw new Error("Failed to select document");
  }
};

/**
 * Process a query against a selected document
 */
export const processDocumentQuery = async (sessionId: string, query: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        query: query
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process query");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error processing query:", error);
    throw new Error("Failed to process query");
  }
};

/**
 * Admin API functions
 */

/**
 * Get admin token (for setup)
 */
export const getAdminToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/token`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch admin token");
    }
    
    const data = await response.json();
    return data.admin_token || "";
  } catch (error) {
    console.error("Error fetching admin token:", error);
    return "";
  }
};

/**
 * Validate admin token
 */
export const validateAdminToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

/**
 * Get admin documents
 */
export const getAdminDocuments = async (token: string): Promise<any[]> => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }
    
    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (token: string, documentId: string): Promise<void> => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/document/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete document");
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
};
