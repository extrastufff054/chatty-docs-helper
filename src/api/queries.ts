
import { apiFetch, processApiResponse } from '@/utils/apiUtils';

export async function processQuery(sessionId: string, query: string): Promise<any> {
  try {
    const response = await apiFetch('/api/query', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId, query }),
    });

    return await processApiResponse(response);
  } catch (error: any) {
    console.error("Error processing query:", error);
    throw new Error(error.message || "Failed to process query");
  }
}
