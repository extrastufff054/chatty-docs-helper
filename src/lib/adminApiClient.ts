
/**
 * Admin API Client 
 * Provides methods for admin operations with error handling and retries
 */

import { apiUrl } from "@/config/apiConfig";
import { useToast } from "@/hooks/use-toast";

/**
 * Validate the admin token with the backend
 * @param token Admin token to validate
 * @returns Promise with validation result
 */
export const validateAdminToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl('/admin/validate-token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error("Error validating admin token:", error);
    return false;
  }
};

/**
 * Fetch the admin token for setup
 * @returns Promise with admin token
 */
export const fetchAdminToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(apiUrl('/admin/token'));
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.admin_token || null;
  } catch (error) {
    console.error("Error fetching admin token:", error);
    return null;
  }
};

/**
 * Fetch all documents (admin view)
 * @param adminToken Admin authentication token
 * @returns Promise with array of documents
 */
export const fetchAdminDocuments = async (adminToken: string) => {
  try {
    const response = await fetch(apiUrl('/admin/documents'), {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    
    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error("Error fetching admin documents:", error);
    throw error;
  }
};

/**
 * Delete a document (admin only)
 * @param adminToken Admin authentication token
 * @param documentId Document ID to delete
 * @returns Promise with deletion result
 */
export const deleteDocument = async (adminToken: string, documentId: string) => {
  try {
    const response = await fetch(apiUrl(`/admin/document/${documentId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

/**
 * Fetch all system prompts (admin view)
 * @param adminToken Admin authentication token
 * @returns Promise with array of system prompts
 */
export const fetchAdminSystemPrompts = async (adminToken: string) => {
  try {
    const response = await fetch(apiUrl('/admin/system-prompts'), {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch system prompts: ${response.status}`);
    }
    
    const data = await response.json();
    return data.prompts || [];
  } catch (error) {
    console.error("Error fetching admin system prompts:", error);
    throw error;
  }
};

/**
 * Update a system prompt
 * @param adminToken Admin authentication token
 * @param promptId System prompt ID to update
 * @param promptData Updated prompt data
 * @returns Promise with update result
 */
export const updateSystemPrompt = async (adminToken: string, promptId: string, promptData: any) => {
  try {
    const response = await fetch(apiUrl(`/admin/system-prompts/${promptId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(promptData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update system prompt: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating system prompt:", error);
    throw error;
  }
};

/**
 * Create a new system prompt
 * @param adminToken Admin authentication token
 * @param promptData New prompt data
 * @returns Promise with creation result
 */
export const createSystemPrompt = async (adminToken: string, promptData: any) => {
  try {
    const response = await fetch(apiUrl('/admin/system-prompts'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(promptData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create system prompt: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating system prompt:", error);
    throw error;
  }
};

/**
 * Delete a system prompt
 * @param adminToken Admin authentication token
 * @param promptId System prompt ID to delete
 * @returns Promise with deletion result
 */
export const deleteSystemPrompt = async (adminToken: string, promptId: string) => {
  try {
    const response = await fetch(apiUrl(`/admin/system-prompts/${promptId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete system prompt: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting system prompt:", error);
    throw error;
  }
};
