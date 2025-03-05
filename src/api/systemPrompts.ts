
import { API_BASE_URL } from '@/config/constants';

export interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  temperature: number;
  description: string;
}

export async function fetchSystemPrompts(): Promise<SystemPrompt[]> {
  try {
    console.log(`Fetching system prompts from ${API_BASE_URL}/api/system-prompts`);
    const response = await fetch(`${API_BASE_URL}/api/system-prompts`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    });
    
    if (!response.ok) {
      console.error(`Error response from server: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log("System prompts fetched successfully:", data);
    return data.prompts || [];
  } catch (error: any) {
    console.error("Error fetching system prompts:", error);
    throw new Error(error.message || "Failed to fetch system prompts");
  }
}

export async function createSystemPrompt(
  adminToken: string, 
  promptData: Omit<SystemPrompt, 'id'>
): Promise<SystemPrompt> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/system-prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(promptData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data.prompt;
  } catch (error: any) {
    console.error("Error creating system prompt:", error);
    throw new Error(error.message || "Failed to create system prompt");
  }
}

export async function updateSystemPrompt(
  adminToken: string,
  promptId: string,
  promptData: Omit<SystemPrompt, 'id'>
): Promise<SystemPrompt> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/system-prompts/${promptId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(promptData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data.prompt;
  } catch (error: any) {
    console.error("Error updating system prompt:", error);
    throw new Error(error.message || "Failed to update system prompt");
  }
}

export async function deleteSystemPrompt(
  adminToken: string,
  promptId: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/system-prompts/${promptId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error deleting system prompt:", error);
    throw new Error(error.message || "Failed to delete system prompt");
  }
}
