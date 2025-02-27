
import { RecursiveCharacterTextSplitter } from "@langchain/core/text_splitter";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Custom prompt template for synthesized, coherent output
const customPromptTemplate = PromptTemplate.fromTemplate(`You are a helpful assistant that carefully analyzes the entire document to generate a coherent, comprehensive answer.
Given the following document excerpts and a question, synthesize a well-rounded answer that provides full context and continuity.
Do not simply return isolated fragments; instead, integrate the information into a unified, context-rich response.

Document Excerpts:
{context}

Question: {question}
Answer:`);

/**
 * Load and process a PDF file
 * @param file - The PDF file to process
 * @returns An array of document objects with text content
 */
const loadPdfFile = async (file: File): Promise<any[]> => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Use dynamic import for pdf-parse to ensure it's only loaded in the browser when needed
    const pdfParse = await import('pdf-parse');
    const data = await pdfParse.default(new Uint8Array(arrayBuffer));
    
    // Create a document object with the text content
    return [{ pageContent: data.text, metadata: { source: file.name } }];
  } catch (error) {
    console.error("Error loading PDF:", error);
    throw new Error("Failed to load the PDF document. Please ensure the file is valid.");
  }
};

/**
 * Initialize the QA chain with the uploaded PDF file and selected model
 * @param file - The PDF file to process
 * @param modelName - The name of the Ollama model to use
 * @returns A QA chain that can answer questions about the document
 */
export const initializeQAChain = async (file: File, modelName: string) => {
  try {
    // Load the PDF document
    const documents = await loadPdfFile(file);
    
    // Split the document into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50
    });
    const splits = await textSplitter.splitDocuments(documents);
    
    if (splits.length === 0) {
      throw new Error("No text content found in the PDF document.");
    }
    
    // Create embeddings
    const embeddings = new HuggingFaceTransformersEmbeddings({
      modelName: "Xenova/all-MiniLM-L6-v2"
    });
    
    // Create a vector store from the document chunks
    const vectorStore = await FaissStore.fromDocuments(splits, embeddings);
    
    // Initialize the Ollama LLM
    const llm = new Ollama({
      model: modelName,
      baseUrl: "http://localhost:11434" // Default Ollama API endpoint
    });
    
    // Create output parser
    const outputParser = new StringOutputParser();
    
    // Create the document chain
    const documentChain = await createStuffDocumentsChain({
      llm,
      prompt: customPromptTemplate,
      outputParser
    });
    
    // Create the retriever
    const retriever = vectorStore.asRetriever();
    
    // Create the retrieval chain
    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever
    });
    
    // Return a callable object that processes queries
    const qaChain = {
      call: async ({ query, callbacks }: { query: string; callbacks?: any[] }) => {
        const result = await retrievalChain.invoke(
          { 
            input: query,
          }, 
          { callbacks }
        );
        return { result: result.answer || "No answer found." };
      },
      llm
    };
    
    return qaChain;
  } catch (error: any) {
    console.error("Error initializing QA chain:", error);
    throw new Error(error.message || "Failed to initialize the QA chain.");
  }
};

/**
 * Process a query using the QA chain
 * @param query - The question to ask
 * @param qaChain - The QA chain to use
 * @param streamCallback - A callback function that receives streaming tokens
 * @returns The final answer to the question
 */
export const processQuery = async (
  query: string, 
  qaChain: any, 
  streamCallback: (token: string) => void
) => {
  try {
    // Create a callback handler for streaming tokens
    const callbackHandler = {
      handleLLMNewToken: (token: string) => {
        streamCallback(token);
      }
    };
    
    // Process the query using the QA chain
    const result = await qaChain.call({
      query: query,
      callbacks: [callbackHandler]
    });
    
    return result.result || result.text || "No answer found.";
  } catch (error: any) {
    console.error("Error processing query:", error);
    
    // Check for specific Ollama errors
    if (error.message && error.message.includes("Failed to fetch")) {
      return "Could not connect to Ollama. Please ensure the Ollama service is running on your machine.";
    } else if (error.message && error.message.includes("model not found")) {
      return `The model "${qaChain.llm.model}" was not found. Please ensure it is pulled locally using the Ollama CLI: "ollama pull ${qaChain.llm.model}"`;
    }
    
    return error.message || "An error occurred while processing your query.";
  }
};

/**
 * Get available Ollama models
 * @returns A list of available Ollama models
 */
export const getOllamaModels = async (): Promise<string[]> => {
  try {
    // In a real implementation, you would make an API call to Ollama
    // For now, we'll simulate fetching models
    const response = await fetch("http://localhost:11434/api/tags");
    
    if (!response.ok) {
      throw new Error("Failed to fetch models from Ollama");
    }
    
    const data = await response.json();
    return data.models?.map((model: any) => model.name) || [];
  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    // Return some default models as fallback
    return ["llama3", "mistral", "gemma", "phi"];
  }
};
