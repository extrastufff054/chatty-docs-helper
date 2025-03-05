
import { API_BASE_URL } from '@/config/constants';

export interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  model: string;
  created_at: string;
}

export async function fetchDocuments(): Promise<Document[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/documents`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw new Error(error.message || "Failed to fetch documents");
  }
}

export async function selectDocument(documentId: string, model: string): Promise<{ session_id: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/select_document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document_id: documentId, model }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error selecting document:", error);
    throw new Error(error.message || "Failed to select document");
  }
}
