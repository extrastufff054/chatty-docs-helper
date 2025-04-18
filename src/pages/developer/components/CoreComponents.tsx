
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CoreComponents = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Core Components</h1>
      
      <p className="mb-6">
        This section describes the key components used in the application, their purpose, 
        how they interact with each other, and where they are used within the codebase.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Chat Components</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>ChatMessage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Renders a single message in the chat interface, supporting both user and assistant messages.
            </p>
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Index.tsx - Main chat interface</li>
            </ul>
            <h3 className="text-sm font-semibold mt-4 mb-2">Key Props:</h3>
            <ul className="text-sm space-y-1">
              <li><span className="font-mono">role</span>: "user" | "assistant"</li>
              <li><span className="font-mono">content</span>: string</li>
              <li><span className="font-mono">isLoading</span>?: boolean</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SystemPromptWrapper</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Wraps the chat interface with system prompt selection functionality.
            </p>
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Index.tsx - Main chat interface</li>
            </ul>
            <h3 className="text-sm font-semibold mt-4 mb-2">Key Functions:</h3>
            <ul className="text-sm space-y-1">
              <li>Loads and manages system prompts</li>
              <li>Provides prompt selection interface</li>
              <li>Passes selected prompt to chat interface</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Document Processing Components</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>DocumentUpload</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Handles document upload functionality, including drag-and-drop and file selection.
            </p>
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Admin.tsx - Admin dashboard</li>
              <li>src/pages/Index.tsx - Main interface</li>
            </ul>
            <h3 className="text-sm font-semibold mt-4 mb-2">Dependencies:</h3>
            <ul className="text-sm space-y-1">
              <li>DropzoneArea - UI for drag-and-drop</li>
              <li>UploadProgressBar - Shows upload progress</li>
              <li>documentProcessor.ts - Document processing logic</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>DocumentsList</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Displays a list of available documents with options to select, delete, or view details.
            </p>
            <h3 className="text-sm font-semibold mt-4 mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>src/pages/Admin.tsx - Admin dashboard</li>
            </ul>
            <h3 className="text-sm font-semibold mt-4 mb-2">Functions:</h3>
            <ul className="text-sm space-y-1">
              <li>Fetches documents via apiClient.ts</li>
              <li>Renders document cards</li>
              <li>Provides document management options</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer">
          <Button variant="outline">Back to Overview</Button>
        </Link>
        <Link to="/developer/apis/api-client">
          <Button>Explore APIs</Button>
        </Link>
      </div>
    </div>
  );
};

export default CoreComponents;
