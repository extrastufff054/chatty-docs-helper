
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
    const response = await fetch(`${API_BASE_URL}/api/system_prompts`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching system prompts:", error);
    throw new Error(error.message || "Failed to fetch system prompts");
  }
}
