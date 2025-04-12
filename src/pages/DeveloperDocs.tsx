
import { useState } from "react";
import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Code, FileCode, GitBranch, GitPullRequest, Layers, Package, Workflow } from "lucide-react";

const DeveloperDocs = () => {
  // Define documentation sections and items
  const docSections = [
    {
      id: "architecture",
      title: "Architecture",
      items: [
        {
          id: "overview",
          title: "System Overview",
          href: "architecture-overview",
          content: <ArchitectureOverview />
        },
        {
          id: "frontend",
          title: "Frontend Architecture",
          href: "frontend-architecture",
          content: <FrontendArchitecture />
        },
        {
          id: "backend",
          title: "Backend Architecture",
          href: "backend-architecture",
          content: <BackendArchitecture />
        },
        {
          id: "data-flow",
          title: "Data Flow",
          href: "data-flow",
          content: <DataFlow />
        }
      ]
    },
    {
      id: "components",
      title: "Components",
      items: [
        {
          id: "core-components",
          title: "Core Components",
          href: "core-components",
          content: <CoreComponents />
        },
        {
          id: "ui-components",
          title: "UI Components",
          href: "ui-components",
          content: <UIComponents />
        },
        {
          id: "utilities",
          title: "Utilities & Helpers",
          href: "utilities",
          content: <Utilities />
        }
      ]
    },
    {
      id: "apis",
      title: "APIs & Services",
      items: [
        {
          id: "api-client",
          title: "API Client",
          href: "api-client",
          content: <APIClient />
        },
        {
          id: "document-processor",
          title: "Document Processor",
          href: "document-processor",
          content: <DocumentProcessor />
        },
        {
          id: "auth-services",
          title: "Authentication Services",
          href: "auth-services",
          content: <AuthServices />
        }
      ]
    },
    {
      id: "development",
      title: "Development Guide",
      items: [
        {
          id: "getting-started",
          title: "Getting Started",
          href: "getting-started",
          content: <GettingStarted />
        },
        {
          id: "workflow",
          title: "Development Workflow",
          href: "development-workflow",
          content: <DevelopmentWorkflow />
        },
        {
          id: "best-practices",
          title: "Best Practices",
          href: "best-practices",
          content: <BestPractices />
        },
        {
          id: "common-patterns",
          title: "Common Patterns",
          href: "common-patterns",
          content: <CommonPatterns />
        }
      ]
    },
    {
      id: "extension",
      title: "Extending the App",
      items: [
        {
          id: "new-features",
          title: "Adding New Features",
          href: "adding-features",
          content: <AddingFeatures />
        },
        {
          id: "custom-models",
          title: "Custom AI Models",
          href: "custom-models",
          content: <CustomModels />
        },
        {
          id: "document-formats",
          title: "Supporting New Document Formats",
          href: "document-formats",
          content: <DocumentFormats />
        }
      ]
    },
    {
      id: "function-reference",
      title: "Function Reference",
      items: [
        {
          id: "document-processing-functions",
          title: "Document Processing Functions",
          href: "document-processing-functions",
          content: <DocumentProcessingFunctions />
        },
        {
          id: "api-client-functions",
          title: "API Client Functions",
          href: "api-client-functions",
          content: <APIClientFunctions />
        },
        {
          id: "auth-functions",
          title: "Authentication Functions",
          href: "auth-functions",
          content: <AuthFunctions />
        },
        {
          id: "utility-functions",
          title: "Utility Functions",
          href: "utility-functions",
          content: <UtilityFunctions />
        }
      ]
    }
  ];

  return (
    <DocumentationLayout sections={docSections} defaultSectionId="architecture" defaultItemId="overview">
      <h1 className="text-4xl font-bold mb-6">Developer Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welcome to the comprehensive developer documentation for the Indian Cybercrime Coordination Centre (I4C) Chatbot project.
        This guide will help you understand the codebase, architecture, and development workflows.
      </p>
    </DocumentationLayout>
  );
};

// Architecture Section Components
const ArchitectureOverview = () => (
  <div>
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
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Key System Components</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Document Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Handles PDF parsing, text extraction, chunking, and embedding generation for semantic search.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Query Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Transforms user queries, retrieves relevant document chunks using vector similarity, and generates AI responses.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Authentication & Authorization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manages user authentication, session management, and role-based access control.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Admin Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Provides document upload, system prompt management, and user administration capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Communication Flow</h2>
    
    <p className="mb-4">
      The application follows this general communication flow:
    </p>
    
    <ol className="list-decimal ml-6 space-y-2 mb-6">
      <li>User interacts with React UI (uploads document or asks question)</li>
      <li>Frontend API client sends request to Flask backend</li>
      <li>Backend processes request (document processing or query handling)</li>
      <li>For AI operations, backend communicates with Ollama API</li>
      <li>Response flows back to frontend for display</li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Design Principles</h2>
    
    <ul className="list-disc ml-6 space-y-2">
      <li><strong>Component-Based Architecture:</strong> UI is built from reusable components</li>
      <li><strong>Separation of Concerns:</strong> Clear boundaries between presentation, business logic, and data access</li>
      <li><strong>Stateless Backend:</strong> Backend focuses on processing without maintaining complex state</li>
      <li><strong>Progressive Enhancement:</strong> Core functionality works without advanced features, with enhancements added progressively</li>
      <li><strong>Responsive Design:</strong> Application works across various device sizes</li>
    </ul>
  </div>
);

const FrontendArchitecture = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Frontend Architecture</h1>
    
    <p className="mb-6">
      The frontend is built using React with TypeScript, focusing on component reusability, state management, and responsive design.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Directory Structure</h2>
    
    <Card className="mb-8">
      <CardContent className="pt-6">
        <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`src/
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── admin/          # Admin interface components
│   ├── auth/           # Authentication components
│   └── documentation/  # Documentation components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and business logic
├── pages/              # Application pages/routes
└── config/             # Configuration files`}
        </pre>
      </CardContent>
    </Card>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Key Technologies</h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">React 18</span>
        <span className="text-sm text-muted-foreground">UI library with hooks for state management</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">TypeScript</span>
        <span className="text-sm text-muted-foreground">Static typing for safer code</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">React Router</span>
        <span className="text-sm text-muted-foreground">Client-side routing</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">Tailwind CSS</span>
        <span className="text-sm text-muted-foreground">Utility-first styling</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">shadcn/ui</span>
        <span className="text-sm text-muted-foreground">UI component collection</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">React Query</span>
        <span className="text-sm text-muted-foreground">Data fetching and caching</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">Framer Motion</span>
        <span className="text-sm text-muted-foreground">Animations and transitions</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">React Hook Form</span>
        <span className="text-sm text-muted-foreground">Form handling and validation</span>
      </div>
      
      <div className="flex flex-col p-4 bg-muted rounded-lg">
        <span className="font-medium mb-1">Zod</span>
        <span className="text-sm text-muted-foreground">Schema validation</span>
      </div>
    </div>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">State Management</h2>
    
    <p className="mb-4">
      The application uses a combination of state management approaches:
    </p>
    
    <div className="space-y-4 mb-8">
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Local Component State</h3>
        <p className="text-sm text-muted-foreground">
          Used for UI state that doesn't need to be shared (using useState and useReducer hooks).
        </p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Context API</h3>
        <p className="text-sm text-muted-foreground">
          For shared state across components (AuthContext, ThemeContext).
        </p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">React Query</h3>
        <p className="text-sm text-muted-foreground">
          For server state management, caching, and synchronization.
        </p>
      </div>
    </div>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Component Hierarchies</h2>
    
    <p className="mb-4">The main component hierarchies include:</p>
    
    <Tabs defaultValue="chat" className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="chat">Chat Interface</TabsTrigger>
        <TabsTrigger value="admin">Admin Panel</TabsTrigger>
        <TabsTrigger value="auth">Authentication</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat">
        <Card>
          <CardContent className="pt-6">
            <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`Index.tsx
├── DocumentSelector
│   └── ModelDropdown
├── ChatInterface
│   ├── ChatMessage
│   ├── ChatInput
│   └── ChatControls
└── DocumentUploader
    └── DropzoneArea`}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="admin">
        <Card>
          <CardContent className="pt-6">
            <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`Admin.tsx
├── AdminHeader
├── DocumentUpload
│   ├── DropzoneArea
│   └── UploadProgressBar
├── DocumentsList
│   └── DocumentCard
├── SystemPromptManagement
│   ├── PromptList
│   └── PromptForm
└── UserManagement
    └── UserTable`}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="auth">
        <Card>
          <CardContent className="pt-6">
            <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`Auth.tsx
├── AuthContext (Provider)
├── LoginForm
│   └── Form components
└── SignupForm
    └── Form components`}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Error Handling</h2>
    
    <p>The frontend implements several error handling strategies:</p>
    
    <ul className="list-disc ml-6 space-y-2 mb-8">
      <li>API errors are caught and displayed via toast notifications</li>
      <li>Form validation errors are displayed inline</li>
      <li>Global error boundaries catch unexpected errors</li>
      <li>Network retries are built into the API client</li>
    </ul>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Routing Structure</h2>
    
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="font-mono">/</span>
            <span className="text-sm text-muted-foreground">Main chat interface</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="font-mono">/admin</span>
            <span className="text-sm text-muted-foreground">Admin dashboard</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="font-mono">/admin/auth</span>
            <span className="text-sm text-muted-foreground">Admin authentication</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="font-mono">/auth</span>
            <span className="text-sm text-muted-foreground">User authentication</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="font-mono">/documentation</span>
            <span className="text-sm text-muted-foreground">User documentation</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="font-mono">/developer</span>
            <span className="text-sm text-muted-foreground">Developer documentation</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="font-mono">*</span>
            <span className="text-sm text-muted-foreground">Not found page</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const BackendArchitecture = () => (
  <div>
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
              
              <div className="p-3 border rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Badge>GET</Badge>
                  <span className="font-mono text-sm">/api/system-prompts</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get available system prompts
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
                  <Badge>GET</Badge>
                  <span className="font-mono text-sm">/admin/documents</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get all documents with admin details
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
              
              <div className="p-3 border rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">More endpoints...</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Endpoints for system prompt and user management
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
              
              <div className="p-3 border rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Badge>POST</Badge>
                  <span className="font-mono text-sm">/auth/validate</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Validate an authentication token
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Document Processing Pipeline</h2>
    
    <p className="mb-4">
      The backend implements a multi-stage document processing pipeline:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li className="p-3 bg-muted rounded-md">
        <strong>Document Loading:</strong> PDF file is parsed and text is extracted
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Text Chunking:</strong> Document is split into manageable chunks using recursive character text splitter
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Embedding Generation:</strong> Text chunks are converted to vector embeddings
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Vector Storage:</strong> Embeddings are stored in FAISS vector database for efficient retrieval
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Session Creation:</strong> Document ID and processing metadata are associated with a session
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Query Processing Pipeline</h2>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li className="p-3 bg-muted rounded-md">
        <strong>Question Embedding:</strong> User query is converted to a vector representation
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Similarity Search:</strong> Vector database is searched for chunks similar to the query using cosine similarity
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Context Assembly:</strong> Retrieved chunks are combined with the query and system prompt
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Ollama Inference:</strong> Assembled prompt is sent to the Ollama API for processing
      </li>
      <li className="p-3 bg-muted rounded-md">
        <strong>Response Streaming:</strong> Tokens are streamed back to the client as they're generated
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Configuration</h2>
    
    <p className="mb-4">
      The backend can be configured through environment variables or a config file:
    </p>
    
    <div className="p-4 bg-muted rounded-lg mb-8 overflow-auto">
      <pre className="text-sm">
{`# Server configuration
FLASK_ENV=development  # or production
PORT=5000
ADMIN_TOKEN=your_secure_token

# Ollama configuration
OLLAMA_BASE_URL=http://localhost:11434

# Storage configuration
STORAGE_PATH=./storage
UPLOAD_FOLDER=./uploads
VECTOR_DB_PATH=./vector_db

# Document processing configuration
CHUNK_SIZE=500
CHUNK_OVERLAP=50
DEFAULT_SIMILARITY_THRESHOLD=0.7
DEFAULT_CHUNK_COUNT=5`}
      </pre>
    </div>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Performance Considerations</h2>
    
    <div className="space-y-4 mb-8">
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Document Processing</h3>
        <p className="text-sm text-muted-foreground">
          Large documents (100+ pages) may require significant memory and processing time.
          Consider implementing pagination or background processing for very large files.
        </p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Model Inference</h3>
        <p className="text-sm text-muted-foreground">
          Ollama model performance depends on hardware specifications. Larger models provide better
          responses but require more memory and processing power. Consider offering multiple
          model sizes for different hardware capabilities.
        </p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Vector Search</h3>
        <p className="text-sm text-muted-foreground">
          FAISS performance scales with the size of the vector database. Extremely large document
          collections may require indexing optimizations and pagination of search results.
        </p>
      </div>
    </div>
  </div>
);

const DataFlow = () => (
  <div>
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
              PDF Processor
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Extracts text from PDF, handles OCR if needed, cleans and normalizes text
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-32 flex-shrink-0 text-center">
            <div className="p-3 bg-primary/10 rounded-lg font-medium">
              Text Splitter
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Divides document into chunks with controlled size and overlap
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-32 flex-shrink-0 text-center">
            <div className="p-3 bg-primary/10 rounded-lg font-medium">
              Embedding Model
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Generates vector embeddings for each text chunk
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
        
        <div className="flex items-start gap-4">
          <div className="w-32 flex-shrink-0 text-center">
            <div className="p-3 bg-primary/10 rounded-lg font-medium">
              Flask Backend
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Creates document record, stores metadata, and returns success response to frontend
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
              React Frontend
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Sends query along with document ID and session information to backend
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
              Processes query, validates session, and prepares for similarity search
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-32 flex-shrink-0 text-center">
            <div className="p-3 bg-primary/10 rounded-lg font-medium">
              Embedding Model
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Converts user question to vector embedding
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
              Prompt Builder
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Combines system prompt, user query, conversation history, and relevant chunks
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
        
        <div className="flex items-start gap-4">
          <div className="w-32 flex-shrink-0 text-center">
            <div className="p-3 bg-primary/10 rounded-lg font-medium">
              Flask Backend
            </div>
          </div>
          <div className="flex-grow">
            <div className="p-4 bg-muted rounded-lg">
              Streams LLM response tokens back to the frontend as they're generated
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
              Renders response incrementally, updates conversation history, and manages UI state
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Placeholder for other documentation components
const CoreComponents = () => <div>Core Components documentation</div>;
const UIComponents = () => <div>UI Components documentation</div>;
const Utilities = () => <div>Utilities & Helpers documentation</div>;
const APIClient = () => <div>API Client documentation</div>;
const DocumentProcessor = () => <div>Document Processor documentation</div>;
const AuthServices = () => <div>Authentication Services documentation</div>;
const GettingStarted = () => <div>Getting Started documentation</div>;
const DevelopmentWorkflow = () => <div>Development Workflow documentation</div>;
const BestPractices = () => <div>Best Practices documentation</div>;
const CommonPatterns = () => <div>Common Patterns documentation</div>;
const AddingFeatures = () => <div>Adding New Features documentation</div>;
const CustomModels = () => <div>Custom AI Models documentation</div>;
const DocumentFormats = () => <div>Supporting New Document Formats documentation</div>;
const DocumentProcessingFunctions = () => <div>Document Processing Functions reference</div>;
const APIClientFunctions = () => <div>API Client Functions reference</div>;
const AuthFunctions = () => <div>Authentication Functions reference</div>;
const UtilityFunctions = () => <div>Utility Functions reference</div>;

export default DeveloperDocs;

