
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DataFlow = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Data Flow</h1>
      
      <p className="mb-6">
        This section explains how data flows through the system, from document upload to question answering.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Document Processing Flow</h2>
      
      <div className="relative overflow-x-auto mb-8">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-32 flex-shrink-0 text-center">
              <div className="p-3 bg-primary/10 rounded-lg font-medium">
                User
              </div>
            </div>
            <div className="flex-grow">
              <div className="p-4 bg-muted rounded-lg">
                Uploads PDF document through web interface
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-32 flex-shrink-0 text-center">
              <div className="p-3 bg-primary/10 rounded-lg font-medium">
                React Frontend
              </div>
            </div>
            <div className="flex-grow">
              <div className="p-4 bg-muted rounded-lg">
                Captures file, validates format and size, sends to backend via multipart form data
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-32 flex-shrink-0 text-center">
              <div className="p-3 bg-primary/10 rounded-lg font-medium">
                Flask Backend
              </div>
            </div>
            <div className="flex-grow">
              <div className="p-4 bg-muted rounded-lg">
                Receives file, saves to disk, and initiates document processing pipeline
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-32 flex-shrink-0 text-center">
              <div className="p-3 bg-primary/10 rounded-lg font-medium">
                FAISS Vector DB
              </div>
            </div>
            <div className="flex-grow">
              <div className="p-4 bg-muted rounded-lg">
                Stores vector embeddings with metadata, creates searchable index
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mt-12 mb-4">Query Processing Flow</h2>
      
      <div className="relative overflow-x-auto mb-8">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-32 flex-shrink-0 text-center">
              <div className="p-3 bg-primary/10 rounded-lg font-medium">
                User
              </div>
            </div>
            <div className="flex-grow">
              <div className="p-4 bg-muted rounded-lg">
                Selects document and submits a question via chat interface
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-32 flex-shrink-0 text-center">
              <div className="p-3 bg-primary/10 rounded-lg font-medium">
                FAISS Vector DB
              </div>
            </div>
            <div className="flex-grow">
              <div className="p-4 bg-muted rounded-lg">
                Performs similarity search to find relevant document chunks
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-32 flex-shrink-0 text-center">
              <div className="p-3 bg-primary/10 rounded-lg font-medium">
                Ollama API
              </div>
            </div>
            <div className="flex-grow">
              <div className="p-4 bg-muted rounded-lg">
                Processes the assembled prompt using the selected LLM model
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer/architecture/overview">
          <Button variant="outline">Back to Overview</Button>
        </Link>
        <Link to="/developer/apis/document-processor">
          <Button>Explore Document Processor</Button>
        </Link>
      </div>
    </div>
  );
};

export default DataFlow;
