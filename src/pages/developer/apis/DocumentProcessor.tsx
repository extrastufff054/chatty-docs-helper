
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";

const DocumentProcessor = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Document Processor</h1>
      
      <p className="mb-6">
        The Document Processor module handles PDF processing, text extraction, chunking, and query processing.
        This page documents the key functions and their usage patterns.
      </p>
      
      <div className="bg-muted p-4 rounded-lg mb-8 flex items-center gap-3">
        <Code className="h-5 w-5 text-primary" />
        <span>File Location: <code>src/lib/documentProcessor.ts</code></span>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Key Functions</h2>
      
      <div className="space-y-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">initializeQAChain(file, modelName)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Initializes a QA chain with a PDF file and Ollama model.
            </p>
            
            <h3 className="text-sm font-semibold mt-2 mb-2">Parameters:</h3>
            <ul className="text-sm space-y-1">
              <li><span className="font-mono">file</span>: The PDF file to process</li>
              <li><span className="font-mono">modelName</span>: The name of the Ollama model to use</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Returns:</h3>
            <p className="text-sm">A promise that resolves to a QA chain object.</p>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Index.tsx - For handling document uploads in the main chat interface</li>
              <li>src/components/admin/DocumentUpload.tsx - For processing uploaded files</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Workflow:</h3>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              <li>Creates a FormData object with the file and model</li>
              <li>Sends an HTTP POST request to the upload endpoint</li>
              <li>Processes the server response</li>
              <li>Returns a QA chain object with the session ID and model name</li>
            </ol>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Usage Example:</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto">
{`const handleFileUpload = async (file) => {
  try {
    setIsProcessing(true);
    const qaChain = await initializeQAChain(file, selectedModel);
    setQaChain(qaChain);
  } finally {
    setIsProcessing(false);
  }
};`}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">processQuery(query, qaChain, streamCallback)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Processes a user query against a document using the QA chain.
            </p>
            
            <h3 className="text-sm font-semibold mt-2 mb-2">Parameters:</h3>
            <ul className="text-sm space-y-1">
              <li><span className="font-mono">query</span>: The question to ask</li>
              <li><span className="font-mono">qaChain</span>: The QA chain object containing sessionId</li>
              <li><span className="font-mono">streamCallback</span>: A callback function for streaming tokens (optional)</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Returns:</h3>
            <p className="text-sm">A promise that resolves to the final answer.</p>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Index.tsx - For handling user questions in the chat interface</li>
              <li>src/components/ChatInterface.tsx - For submitting questions to the backend</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Workflow:</h3>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              <li>Sends an HTTP POST request to the query endpoint with the question and session ID</li>
              <li>Processes streaming tokens if a callback is provided</li>
              <li>Returns the final answer</li>
            </ol>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Usage Example:</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto">
{`const handleSubmit = async (e) => {
  e.preventDefault();
  
  const userMessage = { role: "user", content: prompt };
  setMessages(prev => [...prev, userMessage]);
  
  let responseText = "";
  await processQuery(prompt, qaChain, (token) => {
    responseText += token;
    setStreamingContent(responseText);
  });
  
  setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
};`}
            </pre>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-12 mb-4">Processing Pipeline</h2>
      
      <div className="bg-muted p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">Document Processing Pipeline</h3>
        <ol className="list-decimal pl-5 space-y-4">
          <li className="text-sm">
            <strong>PDF Loading</strong>: Document is loaded using pdf-parse library
          </li>
          <li className="text-sm">
            <strong>Text Extraction</strong>: Text is extracted from PDF content
          </li>
          <li className="text-sm">
            <strong>Text Splitting</strong>: Document is split into manageable chunks using RecursiveCharacterTextSplitter
          </li>
          <li className="text-sm">
            <strong>Embedding Creation</strong>: Text chunks are converted to vector embeddings
          </li>
          <li className="text-sm">
            <strong>Vector Storage</strong>: Embeddings are stored in a FAISS vector store for efficient retrieval
          </li>
        </ol>
      </div>
      
      <div className="bg-muted p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">Query Processing Pipeline</h3>
        <ol className="list-decimal pl-5 space-y-4">
          <li className="text-sm">
            <strong>Query Embedding</strong>: User query is converted to vector representation
          </li>
          <li className="text-sm">
            <strong>Retrieval</strong>: FAISS finds most similar document chunks using vector similarity
          </li>
          <li className="text-sm">
            <strong>Prompt Construction</strong>: Query and retrieved chunks are combined into a prompt
          </li>
          <li className="text-sm">
            <strong>LLM Inference</strong>: Prompt is sent to Ollama model for processing
          </li>
          <li className="text-sm">
            <strong>Response Streaming</strong>: Model generates tokens which are streamed to the UI
          </li>
        </ol>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer/apis/api-client">
          <Button variant="outline">Back to API Client</Button>
        </Link>
        <Link to="/developer/guide/getting-started">
          <Button>Development Guide</Button>
        </Link>
      </div>
    </div>
  );
};

export default DocumentProcessor;
