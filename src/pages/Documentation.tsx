
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border/40 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
              alt="I4C Logo" 
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              I4C Chatbot Documentation
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => window.location.href = "/"} className="hover-scale">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl mx-auto">
        <div className="mb-10 border-b pb-8">
          <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
          <p className="text-muted-foreground mb-4">
            I4C Chatbot allows you to chat with your PDF documents using local language models.
            You can ask questions about your documents and get relevant answers based on their content.
          </p>
          <p className="text-muted-foreground">
            This application uses Ollama to run AI language models locally on your machine, ensuring privacy and security for your documents.
          </p>
        </div>

        <div className="mb-10 border-b pb-8">
          <h2 className="text-2xl font-bold mb-4">Using the Chatbot</h2>
          <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
            <li>
              <span className="font-medium text-foreground">Select a Document:</span> Choose a document from the sidebar that you want to chat about.
            </li>
            <li>
              <span className="font-medium text-foreground">Ask Questions:</span> Type your questions in the input field at the bottom of the chat area.
            </li>
            <li>
              <span className="font-medium text-foreground">Get Answers:</span> The chatbot will respond with relevant information extracted from your document.
            </li>
          </ol>
        </div>

        <div className="mb-10 border-b pb-8">
          <h2 className="text-2xl font-bold mb-4">Administration</h2>
          <p className="text-muted-foreground mb-4">
            To upload and manage documents, access the admin page at <code className="bg-muted px-1 py-0.5 rounded">/admin</code>.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Document Upload Process:</h3>
          <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
            <li>
              <span className="font-medium text-foreground">Admin Authentication:</span> Enter your admin token to access the document management interface.
            </li>
            <li>
              <span className="font-medium text-foreground">Select a PDF:</span> Drag and drop or click to upload a PDF document.
            </li>
            <li>
              <span className="font-medium text-foreground">Add Metadata:</span> Provide a title and optional description for the document.
            </li>
            <li>
              <span className="font-medium text-foreground">Choose Model:</span> Select the Ollama model to use for processing the document.
            </li>
            <li>
              <span className="font-medium text-foreground">Upload:</span> Click the upload button and wait for processing to complete.
            </li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Requirements</h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>
              <span className="font-medium text-foreground">Ollama:</span> Must be installed and running on your local machine.
            </li>
            <li>
              <span className="font-medium text-foreground">Language Models:</span> At least one Ollama model must be installed (e.g., llama2, mistral).
            </li>
            <li>
              <span className="font-medium text-foreground">PDF Documents:</span> Files should be text-based PDFs, not scanned images.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
