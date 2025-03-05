
import { apiFetch, processApiResponse } from '@/utils/apiUtils';

export interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  temperature: number;
  description: string;
}

export async function fetchSystemPrompts(): Promise<SystemPrompt[]> {
  try {
    console.log('Fetching system prompts from API');
    const response = await apiFetch('/api/system-prompts');
    const data = await processApiResponse<{ prompts: SystemPrompt[] }>(response);
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
    const response = await apiFetch('/admin/system-prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(promptData)
    });
    
    const data = await processApiResponse<{ prompt: SystemPrompt }>(response);
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
    const response = await apiFetch(`/admin/system-prompts/${promptId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(promptData)
    });
    
    const data = await processApiResponse<{ prompt: SystemPrompt }>(response);
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
    const response = await apiFetch(`/admin/system-prompts/${promptId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    await processApiResponse(response);
  } catch (error: any) {
    console.error("Error deleting system prompt:", error);
    throw new Error(error.message || "Failed to delete system prompt");
  }
}
