
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border/40 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
              alt="I4C Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Indian Cybercrime Coordination Centre Documentation
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
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="user">User Guide</TabsTrigger>
            <TabsTrigger value="developer">Developer Guide</TabsTrigger>
            <TabsTrigger value="server">Server Guide</TabsTrigger>
            <TabsTrigger value="contribution">Contribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="space-y-8">
            <div className="mb-6 border-b pb-8">
              <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                I4C Chatbot allows you to chat with your PDF documents using local language models.
                You can ask questions about your documents and get relevant answers based on their content.
              </p>
              <p className="text-muted-foreground">
                This application uses Ollama to run AI language models locally on your machine, ensuring privacy and security for your documents.
              </p>
            </div>

            <div className="mb-6 border-b pb-8">
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

            <div className="mb-6 border-b pb-8">
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
          </TabsContent>
          
          <TabsContent value="developer" className="space-y-8">
            <div className="mb-6 border-b pb-8">
              <h2 className="text-3xl font-bold mb-4">Developer Guide</h2>
              <p className="text-muted-foreground mb-4">
                This guide provides technical information for developers who want to understand, modify, or extend the I4C Chatbot application.
              </p>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Architecture Overview</h2>
              <p className="text-muted-foreground mb-4">
                The application follows a client-server architecture:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">Frontend:</span> React application with TypeScript, Tailwind CSS, and shadcn/ui components.
                </li>
                <li>
                  <span className="font-medium text-foreground">Backend:</span> Python Flask server that handles document processing and AI model interactions.
                </li>
                <li>
                  <span className="font-medium text-foreground">AI Models:</span> Integration with Ollama for local AI model inference.
                </li>
                <li>
                  <span className="font-medium text-foreground">Vector Database:</span> FAISS for semantic search and retrieval.
                </li>
              </ul>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Frontend Structure</h2>
              <p className="text-muted-foreground mb-4">
                The React application is organized as follows:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">src/components/:</span> Reusable UI components
                </li>
                <li>
                  <span className="font-medium text-foreground">src/pages/:</span> Main application pages
                </li>
                <li>
                  <span className="font-medium text-foreground">src/hooks/:</span> Custom React hooks
                </li>
                <li>
                  <span className="font-medium text-foreground">src/lib/:</span> Utility functions and helpers
                </li>
                <li>
                  <span className="font-medium text-foreground">src/contexts/:</span> React context providers
                </li>
              </ul>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Key Technologies</h2>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">React 18:</span> UI library with hooks and functional components
                </li>
                <li>
                  <span className="font-medium text-foreground">TypeScript:</span> Static typing for improved code quality
                </li>
                <li>
                  <span className="font-medium text-foreground">Tailwind CSS:</span> Utility-first CSS framework
                </li>
                <li>
                  <span className="font-medium text-foreground">shadcn/ui:</span> Accessible UI component library
                </li>
                <li>
                  <span className="font-medium text-foreground">Vite:</span> Fast development and build tool
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Local Development</h2>
              <p className="text-muted-foreground mb-4">
                To set up the project for local development:
              </p>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>
                  <span className="font-medium text-foreground">Clone the repository:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>git clone https://github.com/yourusername/i4c-chatbot.git</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Install frontend dependencies:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>cd frontend
npm install</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Start the development server:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>npm run dev</code>
                  </pre>
                </li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="server" className="space-y-8">
            <div className="mb-6 border-b pb-8">
              <h2 className="text-3xl font-bold mb-4">Server Guide</h2>
              <p className="text-muted-foreground mb-4">
                This guide provides information for setting up and managing the backend server for the I4C Chatbot application.
              </p>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Server Architecture</h2>
              <p className="text-muted-foreground mb-4">
                The backend is built with Python and Flask, utilizing the following components:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">Flask:</span> Web framework for the API endpoints
                </li>
                <li>
                  <span className="font-medium text-foreground">LangChain:</span> Framework for working with large language models
                </li>
                <li>
                  <span className="font-medium text-foreground">FAISS:</span> Vector database for efficient similarity search
                </li>
                <li>
                  <span className="font-medium text-foreground">Ollama:</span> Interface for running local AI models
                </li>
                <li>
                  <span className="font-medium text-foreground">PyPDF:</span> Library for PDF processing
                </li>
              </ul>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
              <p className="text-muted-foreground mb-4">
                The server exposes the following key endpoints:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">/api/documents:</span> GET - Retrieve all available documents
                </li>
                <li>
                  <span className="font-medium text-foreground">/api/upload-document:</span> POST - Upload and process a new document
                </li>
                <li>
                  <span className="font-medium text-foreground">/api/delete-document:</span> POST - Delete an existing document
                </li>
                <li>
                  <span className="font-medium text-foreground">/api/select-document:</span> POST - Initialize a chat session with a document
                </li>
                <li>
                  <span className="font-medium text-foreground">/api/query:</span> POST - Send a query to the AI model
                </li>
                <li>
                  <span className="font-medium text-foreground">/api/system-prompts:</span> GET/POST - Manage system prompts
                </li>
              </ul>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Server Setup</h2>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>
                  <span className="font-medium text-foreground">Install Python 3.9+:</span> Required for compatibility with all dependencies
                </li>
                <li>
                  <span className="font-medium text-foreground">Create a virtual environment:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Install dependencies:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>pip install -r requirements.txt</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Start the server:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>python app.py</code>
                  </pre>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Server Configuration</h2>
              <p className="text-muted-foreground mb-4">
                The server can be configured through environment variables or configuration files:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">FLASK_ENV:</span> Set to "development" for development mode or "production" for production
                </li>
                <li>
                  <span className="font-medium text-foreground">PORT:</span> The port on which the server runs (default: 5000)
                </li>
                <li>
                  <span className="font-medium text-foreground">ADMIN_TOKEN:</span> Secret token for admin authentication
                </li>
                <li>
                  <span className="font-medium text-foreground">OLLAMA_BASE_URL:</span> URL for Ollama API (default: http://localhost:11434)
                </li>
                <li>
                  <span className="font-medium text-foreground">STORAGE_PATH:</span> Directory to store uploaded files and vector databases
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="contribution" className="space-y-8">
            <div className="mb-6 border-b pb-8">
              <h2 className="text-3xl font-bold mb-4">Contribution Guide</h2>
              <p className="text-muted-foreground mb-4">
                We welcome contributions to the I4C Chatbot project! This guide outlines the process for contributing code, reporting issues, and suggesting enhancements.
              </p>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Code Contributions</h2>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>
                  <span className="font-medium text-foreground">Fork the repository:</span> Create your own copy of the repository on GitHub
                </li>
                <li>
                  <span className="font-medium text-foreground">Clone your fork:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>git clone https://github.com/yourusername/i4c-chatbot.git</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Create a branch:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>git checkout -b feature/your-feature-name</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Make your changes:</span> Implement your feature or fix
                </li>
                <li>
                  <span className="font-medium text-foreground">Run tests:</span> Ensure all tests pass
                </li>
                <li>
                  <span className="font-medium text-foreground">Commit your changes:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>git commit -m "Descriptive commit message"</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Push to your fork:</span>
                  <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                    <code>git push origin feature/your-feature-name</code>
                  </pre>
                </li>
                <li>
                  <span className="font-medium text-foreground">Create a Pull Request:</span> Open a PR against the main repository
                </li>
              </ol>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Coding Standards</h2>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">TypeScript:</span> Use TypeScript for all frontend code with proper typing
                </li>
                <li>
                  <span className="font-medium text-foreground">Python:</span> Follow PEP 8 for Python code
                </li>
                <li>
                  <span className="font-medium text-foreground">Component Structure:</span> Keep components small and focused on a single responsibility
                </li>
                <li>
                  <span className="font-medium text-foreground">Documentation:</span> Add comments for complex logic and document new features
                </li>
                <li>
                  <span className="font-medium text-foreground">Formatting:</span> Use consistent formatting (preferably with Prettier for frontend)
                </li>
              </ul>
            </div>

            <div className="mb-6 border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">Reporting Issues</h2>
              <p className="text-muted-foreground mb-4">
                When reporting issues, please include:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">Issue description:</span> Clear and concise description of the problem
                </li>
                <li>
                  <span className="font-medium text-foreground">Steps to reproduce:</span> Detailed steps to reproduce the issue
                </li>
                <li>
                  <span className="font-medium text-foreground">Expected behavior:</span> What you expected to happen
                </li>
                <li>
                  <span className="font-medium text-foreground">Actual behavior:</span> What actually happened
                </li>
                <li>
                  <span className="font-medium text-foreground">Environment details:</span> Browser, OS, and application version
                </li>
                <li>
                  <span className="font-medium text-foreground">Screenshots:</span> If applicable
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Feature Requests</h2>
              <p className="text-muted-foreground mb-4">
                We welcome feature suggestions! Please provide:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">Feature description:</span> Clear explanation of the proposed feature
                </li>
                <li>
                  <span className="font-medium text-foreground">Use case:</span> Why this feature would be useful
                </li>
                <li>
                  <span className="font-medium text-foreground">Implementation ideas:</span> Any thoughts on how it might be implemented
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Documentation;
