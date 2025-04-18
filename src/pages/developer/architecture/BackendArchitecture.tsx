
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BackendArchitecture = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Backend Architecture</h1>
      
      <p className="mb-6">
        The backend is built using Python with Flask, providing REST APIs for document processing, query handling, and administrative functions.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col p-4 bg-muted rounded-lg">
          <span className="font-medium mb-1">Python 3.9+</span>
          <span className="text-sm text-muted-foreground">Core programming language</span>
        </div>
        
        <div className="flex flex-col p-4 bg-muted rounded-lg">
          <span className="font-medium mb-1">Flask</span>
          <span className="text-sm text-muted-foreground">Lightweight web framework</span>
        </div>
        
        <div className="flex flex-col p-4 bg-muted rounded-lg">
          <span className="font-medium mb-1">LangChain</span>
          <span className="text-sm text-muted-foreground">AI/LLM interaction framework</span>
        </div>
        
        <div className="flex flex-col p-4 bg-muted rounded-lg">
          <span className="font-medium mb-1">FAISS</span>
          <span className="text-sm text-muted-foreground">Vector similarity search</span>
        </div>
        
        <div className="flex flex-col p-4 bg-muted rounded-lg">
          <span className="font-medium mb-1">PyPDF</span>
          <span className="text-sm text-muted-foreground">PDF parsing library</span>
        </div>
        
        <div className="flex flex-col p-4 bg-muted rounded-lg">
          <span className="font-medium mb-1">Sentence-Transformers</span>
          <span className="text-sm text-muted-foreground">Text embedding generation</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">API Endpoints</h2>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <Tabs defaultValue="documents">
            <TabsList className="mb-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents">
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>GET</Badge>
                    <span className="font-mono text-sm">/api/documents</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Retrieve all available documents
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>POST</Badge>
                    <span className="font-mono text-sm">/api/upload</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload and process a new document (PDF parsing, chunking, embedding)
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>POST</Badge>
                    <span className="font-mono text-sm">/api/select-document</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select a document for Q&A (creates a session)
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="query">
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>POST</Badge>
                    <span className="font-mono text-sm">/api/query</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Process a question against a selected document
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>GET</Badge>
                    <span className="font-mono text-sm">/api/models</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get list of available Ollama models
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="admin">
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>POST</Badge>
                    <span className="font-mono text-sm">/admin/upload</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload document through admin interface
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>DELETE</Badge>
                    <span className="font-mono text-sm">/admin/documents/:id</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Delete a document
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="auth">
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>POST</Badge>
                    <span className="font-mono text-sm">/auth/login</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Authenticate user and get token
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>POST</Badge>
                    <span className="font-mono text-sm">/auth/signup</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create a new user account
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer/architecture/overview">
          <Button variant="outline">Back to Overview</Button>
        </Link>
        <Link to="/developer/apis/api-client">
          <Button>Explore API Client</Button>
        </Link>
      </div>
    </div>
  );
};

export default BackendArchitecture;
