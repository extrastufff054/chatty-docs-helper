
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// API endpoints for the Python backend
const API_BASE_URL = "http://localhost:5000/api";
const MODELS_ENDPOINT = `${API_BASE_URL}/models`;
const UPLOAD_ENDPOINT = `${API_BASE_URL}/upload`;
const QUERY_ENDPOINT = `${API_BASE_URL}/query`;

// Custom prompt template for synthesized, coherent output
const customPromptTemplate = PromptTemplate.fromTemplate(`You are a helpful assistant that carefully analyzes the entire document to generate a coherent, comprehensive answer.
Given the following document excerpts and a question, synthesize a well-rounded answer that provides full context and continuity.
Do not simply return isolated fragments; instead, integrate the information into a unified, context-rich response.

Document Excerpts:
{context}

Question: {question}
Answer:`);

/**
 * Load and process a PDF file via the Python backend
 * @param file - The PDF file to process
 * @param modelName - The name of the Ollama model to use
 * @returns A session ID for future queries
 */
export const initializeQAChain = async (file: File, modelName: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', modelName);
    
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload and process the document");
    }
    
    const data = await response.json();
    
    // Return an object with the session ID and model name for future queries
    return {
      sessionId: data.session_id,
      model: modelName,
      call: async ({ query, callbacks }: { query: string; callbacks?: any[] }) => {
        const result = await processQuery(query, { sessionId: data.session_id, model: modelName }, 
          callbacks && callbacks.length > 0 ? callbacks[0].handleLLMNewToken : null);
        return { result };
      },
      llm: { model: modelName }
    };
  } catch (error: any) {
    console.error("Error initializing QA chain:", error);
    throw new Error(error.message || "Failed to initialize the QA chain.");
  }
};

/**
 * Process a query using the Python backend
 * @param query - The question to ask
 * @param qaChain - The QA chain object with sessionId
 * @param streamCallback - A callback function that receives streaming tokens
 * @returns The final answer to the question
 */
export const processQuery = async (
  query: string, 
  qaChain: any, 
  streamCallback?: (token: string) => void
) => {
  try {
    // Send the query to the backend
    const response = await fetch(QUERY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: qaChain.sessionId,
        query: query
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process the query");
    }
    
    const data = await response.json();
    
    // If streaming callback is provided and tokens are available, stream them
    if (streamCallback && data.tokens) {
      for (const token of data.tokens) {
        streamCallback(token);
      }
    }
    
    return data.answer || "No answer found.";
  } catch (error: any) {
    console.error("Error processing query:", error);
    
    // Check for specific Ollama errors
    if (error.message && error.message.includes("Failed to fetch")) {
      return "Could not connect to the backend. Please ensure the Python server is running.";
    } else if (error.message && error.message.includes("model not found")) {
      return `The model "${qaChain.model}" was not found. Please ensure it is pulled locally using the Ollama CLI: "ollama pull ${qaChain.model}"`;
    }
    
    return error.message || "An error occurred while processing your query.";
  }
};

/**
 * Get available Ollama models from the Python backend
 * @returns A list of available Ollama models
 */
export const getOllamaModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(MODELS_ENDPOINT);
    
    if (!response.ok) {
      throw new Error("Failed to fetch models from the backend");
    }
    
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    // Return some default models as fallback
    return ["llama3", "mistral", "gemma", "phi"];
  }
};

/**
 * Upload multiple files to the backend
 * @param files - Array of files to upload
 * @param title - Title for the batch upload
 * @param description - Description for the batch
 * @param modelName - Ollama model to use
 * @param adminToken - Admin token for authentication
 * @returns The response from the server
 */
export const uploadMultipleFiles = async (
  files: File[],
  title: string,
  description: string,
  modelName: string,
  adminToken: string
) => {
  try {
    const formData = new FormData();
    
    // Append multiple files
    files.forEach(file => {
      formData.append('files[]', file);
    });
    
    formData.append('title', title);
    formData.append('description', description);
    formData.append('model', modelName);
    
    const response = await fetch(`http://localhost:5000/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload documents");
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("Error uploading multiple files:", error);
    throw new Error(error.message || "Failed to upload and process the documents.");
  }
};
