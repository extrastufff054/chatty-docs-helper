
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ArchitectureOverview = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">System Architecture Overview</h1>
      
      <p className="mb-4">
        The I4C Chatbot is built using a modern web architecture that separates concerns between
        the frontend (React) and backend (Python/Flask). This overview will help you understand
        how the different parts of the system work together.
      </p>
      
      <div className="my-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              High-Level Architecture
            </CardTitle>
            <CardDescription>
              The system follows a clear separation of concerns with distinct layers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Presentation Layer (Frontend)</h3>
                <p className="text-sm text-muted-foreground">
                  React components, routing, and state management. Responsible for user interaction and displaying data.
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Application Layer</h3>
                <p className="text-sm text-muted-foreground">
                  Business logic implemented in React components, hooks, and utility functions. Handles document processing, query formulation, and response rendering.
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">API Layer</h3>
                <p className="text-sm text-muted-foreground">
                  API clients that communicate with the backend. Handle error processing, retries, and data transformation.
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Backend Services</h3>
                <p className="text-sm text-muted-foreground">
                  Flask server handling document processing, embedding, and AI model inference via Ollama.
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">AI Processing Layer</h3>
                <p className="text-sm text-muted-foreground">
                  Ollama integration for running AI models locally, with document retrieval and semantic search capabilities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer/architecture/frontend">
          <Button>Frontend Architecture</Button>
        </Link>
        <Link to="/developer/architecture/backend">
          <Button>Backend Architecture</Button>
        </Link>
        <Link to="/developer/architecture/data-flow">
          <Button>Data Flow</Button>
        </Link>
      </div>
    </div>
  );
};

export default ArchitectureOverview;
