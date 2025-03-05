
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
    console.log(`Fetching documents from ${API_BASE_URL}/api/documents`);
    const response = await fetch(`${API_BASE_URL}/api/documents`, {
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
    console.log("Documents fetched successfully:", data);
    return data.documents || [];
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw new Error(error.message || "Failed to fetch documents");
  }
}

export async function selectDocument(documentId: string, model: string): Promise<{ session_id: string }> {
  try {
    console.log(`Selecting document ${documentId} with model ${model}`);
    const response = await fetch(`${API_BASE_URL}/api/select-document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      body: JSON.stringify({ document_id: documentId, model }),
    });

    if (!response.ok) {
      console.error(`Error response from server: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log("Document selected successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Error selecting document:", error);
    throw new Error(error.message || "Failed to select document");
  }
}
