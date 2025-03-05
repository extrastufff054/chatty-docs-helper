
import { apiFetch, processApiResponse } from '@/utils/apiUtils';

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
    console.log('Fetching documents from API');
    const response = await apiFetch('/api/documents');
    const data = await processApiResponse<{ documents: Document[] }>(response);
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
    const response = await apiFetch('/api/select-document', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document_id: documentId, model }),
    });

    const data = await processApiResponse<{ session_id: string }>(response);
    console.log("Document selected successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Error selecting document:", error);
    throw new Error(error.message || "Failed to select document");
  }
}
