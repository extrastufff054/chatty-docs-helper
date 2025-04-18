
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";

const APIClient = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">API Client</h1>
      
      <p className="mb-6">
        The API Client module provides functions for interacting with the backend API.
        This page documents the key functions, their usage patterns, and where they are used.
      </p>
      
      <div className="bg-muted p-4 rounded-lg mb-8 flex items-center gap-3">
        <Code className="h-5 w-5 text-primary" />
        <span>File Location: <code>src/lib/apiClient.ts</code></span>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Key Functions</h2>
      
      <div className="space-y-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">fetchDocuments()</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Fetches all available documents from the API.
            </p>
            
            <h3 className="text-sm font-semibold mt-2 mb-2">Parameters:</h3>
            <p className="text-sm">None</p>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Returns:</h3>
            <p className="text-sm">A promise with an array of documents.</p>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Admin.tsx - For displaying the list of available documents</li>
              <li>src/components/admin/DocumentsList.tsx - For rendering document cards</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Usage Example:</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto">
{`useEffect(() => {
  const loadDocuments = async () => {
    try {
      const documents = await fetchDocuments();
      setDocuments(documents);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };
  
  loadDocuments();
}, []);`}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">selectDocument(documentId, model, options)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Selects a document for querying.
            </p>
            
            <h3 className="text-sm font-semibold mt-2 mb-2">Parameters:</h3>
            <ul className="text-sm space-y-1">
              <li><span className="font-mono">documentId</span>: Document ID to select</li>
              <li><span className="font-mono">model</span>: Model to use for the document</li>
              <li><span className="font-mono">options</span>: Optional parameters</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Returns:</h3>
            <p className="text-sm">A promise with session ID.</p>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Index.tsx - For selecting documents from the document list</li>
              <li>src/components/DocumentSelector.tsx - For handling document selection events</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Usage Example:</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto">
{`const handleDocumentSelect = async (docId) => {
  try {
    const { session_id } = await selectDocument(docId, selectedModel, {
      promptId: 'default',
      temperature: 0.0
    });
    setSessionId(session_id);
  } catch (error) {
    console.error("Error selecting document:", error);
  }
};`}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">processQuery(sessionId, query, options)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Process a query against a selected document.
            </p>
            
            <h3 className="text-sm font-semibold mt-2 mb-2">Parameters:</h3>
            <ul className="text-sm space-y-1">
              <li><span className="font-mono">sessionId</span>: Session ID for the query</li>
              <li><span className="font-mono">query</span>: Query text</li>
              <li><span className="font-mono">options</span>: Additional query options</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Returns:</h3>
            <p className="text-sm">Promise with answer and tokens.</p>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Index.tsx - For handling user questions with selected documents</li>
              <li>src/components/ChatInterface.tsx - For submitting questions to the backend</li>
            </ul>
            
            <h3 className="text-sm font-semibold mt-4 mb-2">Usage Example:</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto">
{`const submitQuestion = async (question) => {
  try {
    const response = await processQuery(sessionId, question, {
      stream: true,
      enhanceFactualAccuracy: true
    });
    
    if (response.tokens) {
      // Handle streaming tokens
    }
    
    return response.answer;
  } catch (error) {
    console.error("Error processing query:", error);
    return null;
  }
};`}
            </pre>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer/components/core">
          <Button variant="outline">Back to Components</Button>
        </Link>
        <Link to="/developer/apis/document-processor">
          <Button>Document Processor</Button>
        </Link>
      </div>
    </div>
  );
};

export default APIClient;
