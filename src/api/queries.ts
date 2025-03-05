
import { API_BASE_URL } from '@/config/constants';

export async function processQuery(sessionId: string, query: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId, query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error processing query:", error);
    throw new Error(error.message || "Failed to process query");
  }
}
