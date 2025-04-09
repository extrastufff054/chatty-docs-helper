
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Documentation = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">I4C Chatbot Developer Documentation</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-220px)] pr-4">
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>Understanding the I4C Chatbot Application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The I4C Chatbot is a React-based web application designed to provide an interactive chatbot interface 
                  that allows users to query PDF documents using AI models. The application includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A user authentication system with role-based access control</li>
                  <li>Document upload and processing capabilities</li>
                  <li>Chat interface for interacting with AI models</li>
                  <li>Admin panel for managing users, documents, and system prompts</li>
                  <li>Responsive design for different screen sizes</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Key Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Authentication with multiple user roles (admin, moderator, user)</li>
                  <li>Document processing with AI model integration</li>
                  <li>Chat-based query interface with streaming responses</li>
                  <li>User management with approval workflows</li>
                  <li>System prompt customization</li>
                  <li>Dark/light theme support</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Technology Stack</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS, Shadcn UI</li>
                  <li><strong>State Management:</strong> React Context API, React Query</li>
                  <li><strong>Authentication:</strong> Custom auth with IndexedDB</li>
                  <li><strong>Storage:</strong> Browser IndexedDB for local data persistence</li>
                  <li><strong>API:</strong> HTTP requests to Python backend with document processing</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Getting Started</h3>
                <p>To start development with this project:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Clone the repository</li>
                  <li>Install dependencies with <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">npm install</code></li>
                  <li>Start the development server with <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">npm run dev</code></li>
                  <li>Ensure the Python backend is running (separate setup)</li>
                </ol>
                
                <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-md p-4 mt-6">
                  <p className="font-semibold">Note:</p>
                  <p>This documentation focuses on the frontend architecture. For information about the Python backend, refer to the backend documentation.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Architecture</CardTitle>
                <CardDescription>How the I4C Chatbot is structured</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Directory Structure</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
{`src/
├── components/     # UI components
│   ├── admin/      # Admin panel components
│   ├── auth/       # Authentication components
│   └── ui/         # Shadcn UI components
├── contexts/       # React contexts for state management
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and core logic
├── pages/          # Main application pages
├── config/         # Configuration files
└── main.tsx        # Application entry point`}
                </pre>
                
                <h3 className="text-xl font-semibold mt-6">Core Architecture Concepts</h3>
                
                <h4 className="text-lg font-semibold mt-4">1. Component-Based Structure</h4>
                <p>
                  The application follows React's component-based architecture, with reusable UI components organized by 
                  feature area. This promotes code reusability and separation of concerns.
                </p>
                
                <h4 className="text-lg font-semibold mt-4">2. Context API for State Management</h4>
                <p>
                  React Context API is used for global state management, particularly for authentication state (via AuthContext). 
                  This provides access to authentication data and methods throughout the application without prop drilling.
                </p>
                
                <h4 className="text-lg font-semibold mt-4">3. Custom Hooks</h4>
                <p>
                  Custom React hooks encapsulate reusable logic, such as toast notifications, form handling, and API interactions. 
                  These hooks simplify component code and promote the reuse of complex functionality.
                </p>
                
                <h4 className="text-lg font-semibold mt-4">4. Browser-Based Database</h4>
                <p>
                  The application uses IndexedDB (through a custom wrapper in <code>db.ts</code>) to store user data directly 
                  in the browser. This enables user management functionality without requiring a backend database.
                </p>
                
                <h4 className="text-lg font-semibold mt-4">5. API Client Architecture</h4>
                <p>
                  Separate API client modules (<code>apiClient.ts</code> and <code>adminApiClient.ts</code>) handle 
                  communication with the backend. These provide structured methods for different API endpoints and include 
                  error handling and retries.
                </p>
                
                <h3 className="text-xl font-semibold mt-6">Data Flow</h3>
                
                <p>The typical data flow in the application follows this pattern:</p>
                
                <ol className="list-decimal pl-6 space-y-2">
                  <li>User interacts with a component (e.g., submits a form, clicks a button)</li>
                  <li>Component calls a method from context or custom hook</li>
                  <li>The method may communicate with an API client or database utility</li>
                  <li>Results are returned to the component and/or stored in global state</li>
                  <li>UI updates to reflect the new state</li>
                </ol>
                
                <h3 className="text-xl font-semibold mt-6">Authentication Flow</h3>
                
                <p>The authentication system follows this general flow:</p>
                
                <ol className="list-decimal pl-6 space-y-2">
                  <li>User registers or logs in through authentication forms</li>
                  <li>Credentials are validated against stored user data in IndexedDB</li>
                  <li>On successful authentication, a session token is generated and stored</li>
                  <li>The token is used to maintain authenticated state across page reloads</li>
                  <li>Protected routes and components check authentication status through the AuthContext</li>
                </ol>
                
                <h3 className="text-xl font-semibold mt-6">API Architecture</h3>
                
                <p>The application communicates with a Python backend for document processing and AI functionality:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Document uploads are processed by the backend and converted to vector embeddings</li>
                  <li>User queries are sent to the backend, which retrieves relevant document sections</li>
                  <li>The backend forwards queries and context to AI models for processing</li>
                  <li>Responses are streamed back to the frontend for real-time display</li>
                </ul>
                
                <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4 mt-6">
                  <p className="font-semibold">Pro Tip:</p>
                  <p>
                    When adding new features, follow the established patterns in the codebase. If you're adding a new API endpoint, 
                    create corresponding methods in the API client. For new UI features, create reusable components and hooks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Components Guide</CardTitle>
                <CardDescription>Understanding the major components in the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Authentication Components</h3>
                
                <h4 className="text-lg font-semibold mt-4">AuthContext</h4>
                <p>
                  <code>AuthContext</code> (in <code>src/contexts/AuthContext.tsx</code>) is the core of the authentication system.
                  It provides:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Current user data and authentication state</li>
                  <li>Login, signup, and logout methods</li>
                  <li>Role-based authorization checks</li>
                  <li>Session persistence across page reloads</li>
                </ul>
                <p className="mt-2">
                  The context uses the auth utility library to handle the actual authentication logic and 
                  exposes a clean API for components to use.
                </p>
                
                <h4 className="text-lg font-semibold mt-4">LoginForm and SignupForm</h4>
                <p>
                  These components in <code>src/components/auth/</code> provide the UI for user authentication. 
                  They use form validation, error handling, and connect to the AuthContext for authentication operations.
                </p>
                
                <h3 className="text-xl font-semibold mt-6">Admin Components</h3>
                
                <h4 className="text-lg font-semibold mt-4">UserManagement</h4>
                <p>
                  The <code>UserManagement</code> component provides the admin interface for managing users, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>User listing with filtering and sorting</li>
                  <li>User approval workflow</li>
                  <li>Role management</li>
                  <li>User deletion</li>
                </ul>
                
                <h4 className="text-lg font-semibold mt-4">DocumentUpload and DocumentsList</h4>
                <p>
                  These components handle document management in the admin panel, allowing administrators to upload 
                  new documents and manage existing ones. They interact with the document processing API.
                </p>
                
                <h4 className="text-lg font-semibold mt-4">SystemPromptManagement</h4>
                <p>
                  This component allows administrators to create and manage system prompts that control the AI's behavior 
                  when responding to user queries.
                </p>
                
                <h3 className="text-xl font-semibold mt-6">Chat Components</h3>
                
                <h4 className="text-lg font-semibold mt-4">ChatMessage</h4>
                <p>
                  Renders individual chat messages with support for different message types (user, assistant) 
                  and formatted content.
                </p>
                
                <h3 className="text-xl font-semibold mt-6">Utility Components</h3>
                
                <h4 className="text-lg font-semibold mt-4">ThemeToggle</h4>
                <p>
                  Allows users to switch between light and dark themes.
                </p>
                
                <h4 className="text-lg font-semibold mt-4">UI Components</h4>
                <p>
                  The application uses a set of reusable UI components from the shadcn/ui library, located in 
                  <code>src/components/ui/</code>. These include buttons, forms, dialogs, and other UI elements.
                </p>
                
                <h3 className="text-xl font-semibold mt-6">Component Interaction Patterns</h3>
                
                <h4 className="text-lg font-semibold mt-4">Context Consumers</h4>
                <p>
                  Many components consume the AuthContext to access user data and authentication state. This is typically 
                  done using the <code>useAuth</code> hook:
                </p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm mt-2">
{`const MyComponent = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // Component logic using authentication state
}`}
                </pre>
                
                <h4 className="text-lg font-semibold mt-4">API Integration</h4>
                <p>
                  Components that interact with the backend typically use the API client utilities:
                </p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm mt-2">
{`const MyComponent = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.fetchSomeData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);
  
  // Render component using data
}`}
                </pre>
                
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md p-4 mt-6">
                  <p className="font-semibold">Best Practice:</p>
                  <p>
                    When creating new components, follow these principles:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Keep components focused on a single responsibility</li>
                    <li>Extract reusable logic to custom hooks</li>
                    <li>Use context for global state instead of prop drilling</li>
                    <li>Implement proper error handling and loading states</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="auth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication System</CardTitle>
                <CardDescription>A detailed guide to the authentication implementation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Overview</h3>
                <p>
                  The I4C Chatbot uses a custom, browser-based authentication system with the following features:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>User registration and login</li>
                  <li>Role-based access control (admin, moderator, user roles)</li>
                  <li>Session management</li>
                  <li>User approval workflow</li>
                  <li>Password hashing for security</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Core Components</h3>
                
                <h4 className="text-lg font-semibold mt-4">1. Database (db.ts)</h4>
                <p>
                  The <code>db.ts</code> file provides a wrapper around IndexedDB for storing user data in the browser. 
                  It includes methods for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Creating, retrieving, updating, and deleting users</li>
                  <li>Querying users by ID, username, or email</li>
                  <li>Managing user approval and roles</li>
                </ul>
                
                <h4 className="text-lg font-semibold mt-4">2. Authentication Manager (auth.ts)</h4>
                <p>
                  The <code>auth.ts</code> file contains the core authentication logic, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Password hashing and verification</li>
                  <li>Session token generation and validation</li>
                  <li>Login, signup, and logout functionality</li>
                  <li>Session persistence</li>
                </ul>
                
                <h4 className="text-lg font-semibold mt-4">3. Authentication Context (AuthContext.tsx)</h4>
                <p>
                  The <code>AuthContext</code> provides a React context for authentication state, exposing:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Current user data and session information</li>
                  <li>Authentication status (isAuthenticated, isAdmin)</li>
                  <li>Login, signup, and logout methods</li>
                  <li>Loading state during authentication operations</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">User Data Model</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
{`interface User {
  id: string;               // UUID for user identification
  username: string;         // Unique username
  email: string;            // Unique email address
  passwordHash: string;     // SHA-256 hash of user password
  role: "admin" | "user" | "moderator";  // User role for access control
  approved: boolean;        // Account approval status
  createdAt: string;        // ISO timestamp of account creation
}`}
                </pre>
                
                <h3 className="text-xl font-semibold mt-6">Session Data Model</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
{`interface AuthSession {
  token: string;            // Unique session token
  user: User;               // User associated with this session
  expiresAt: string;        // ISO timestamp of session expiration
}`}
                </pre>
                
                <h3 className="text-xl font-semibold mt-6">Authentication Workflows</h3>
                
                <h4 className="text-lg font-semibold mt-4">Registration Flow</h4>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>User submits registration form with username, email, and password</li>
                  <li>System checks for existing users with the same username or email</li>
                  <li>Password is hashed using SHA-256 (would use bcrypt in production)</li>
                  <li>New user record is created with "user" role and unapproved status</li>
                  <li>User must wait for admin approval before logging in</li>
                </ol>
                
                <h4 className="text-lg font-semibold mt-4">Login Flow</h4>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>User submits login form with username and password</li>
                  <li>System retrieves user record by username</li>
                  <li>Password is hashed and compared with stored hash</li>
                  <li>System checks if user is approved</li>
                  <li>If authentication succeeds, a new session is created with a unique token</li>
                  <li>Session token is stored in localStorage for persistence</li>
                  <li>Application state is updated with authenticated user data</li>
                </ol>
                
                <h4 className="text-lg font-semibold mt-4">Session Validation Flow</h4>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>On application load, system checks for existing session token in localStorage</li>
                  <li>If token exists, it's validated against stored sessions</li>
                  <li>System checks if session is expired</li>
                  <li>System verifies that the user still exists and is approved</li>
                  <li>If validation succeeds, session is restored and user is automatically logged in</li>
                </ol>
                
                <h4 className="text-lg font-semibold mt-4">Admin Token Login Flow</h4>
                <p>
                  For backward compatibility, the system supports logging in with an admin token:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Admin provides a token</li>
                  <li>Token is validated against the expected admin token</li>
                  <li>System finds the first user with admin role</li>
                  <li>If validation succeeds, a new session is created for the admin user</li>
                </ol>
                
                <h3 className="text-xl font-semibold mt-6">Production Considerations</h3>
                
                <p>
                  The current authentication implementation is suitable for development but has limitations for production use:
                </p>
                
                <h4 className="text-lg font-semibold mt-4">Security Enhancements</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Replace SHA-256 with a more secure password hashing algorithm like bcrypt or Argon2</li>
                  <li>Implement proper CSRF protection</li>
                  <li>Use HTTP-only cookies instead of localStorage for token storage</li>
                  <li>Add rate limiting for authentication attempts</li>
                  <li>Implement multi-factor authentication</li>
                </ul>
                
                <h4 className="text-lg font-semibold mt-4">Database Migration</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Replace IndexedDB with a server-side database (PostgreSQL, MongoDB, etc.)</li>
                  <li>Implement proper database migration strategies</li>
                  <li>Add data backup and recovery procedures</li>
                </ul>
                
                <h4 className="text-lg font-semibold mt-4">Session Management</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Implement sliding session expiration</li>
                  <li>Add session invalidation on password change</li>
                  <li>Support multiple concurrent sessions per user with management UI</li>
                  <li>Implement refresh tokens for long-lived sessions</li>
                </ul>
                
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md p-4 mt-6">
                  <p className="font-semibold">Important Security Note:</p>
                  <p>
                    The current password hashing implementation uses SHA-256, which is not recommended for password storage in production. 
                    For production use, implement a proper password hashing algorithm like bcrypt with salt and appropriate work factor.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Complete guide to the application's API functionality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">API Client Modules</h3>
                
                <p>
                  The application includes two main API client modules:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><code>apiClient.ts</code>: For regular user API operations</li>
                  <li><code>adminApiClient.ts</code>: For admin-specific operations</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Standard API Operations</h3>
                
                <h4 className="text-lg font-semibold mt-4">Documents API</h4>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>fetchDocuments()</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Fetches all available documents from the API.</p>
                    <p className="text-xs font-semibold">Returns:</p>
                    <p className="text-xs">Promise with array of documents</p>
                    <p className="text-xs font-semibold mt-2">Example:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs mt-1">
{`const documents = await fetchDocuments();
console.log(documents); // Array of document objects`}
                    </pre>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>selectDocument(documentId: string, model: string)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Selects a document for querying with a specified model.</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>documentId</code>: Document ID to select</li>
                      <li><code>model</code>: Model to use for the document</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with session ID</p>
                    <p className="text-xs font-semibold mt-2">Example:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs mt-1">
{`const result = await selectDocument("doc-123", "llama3");
console.log(result.session_id); // Session ID for future queries`}
                    </pre>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>processQuery(sessionId: string, query: string)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Processes a query against a selected document.</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>sessionId</code>: Session ID for the query</li>
                      <li><code>query</code>: Query text</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with answer and tokens</p>
                    <p className="text-xs font-semibold mt-2">Example:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs mt-1">
{`const result = await processQuery("session-456", "What is the purpose of this document?");
console.log(result.answer); // AI-generated answer`}
                    </pre>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold mt-6">System Prompts API</h4>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>fetchSystemPrompts()</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Fetches all available system prompts.</p>
                    <p className="text-xs font-semibold">Returns:</p>
                    <p className="text-xs">Promise with array of system prompts</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mt-6">Admin API Operations</h3>
                
                <h4 className="text-lg font-semibold mt-4">Admin Authentication</h4>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>validateAdminToken(token: string)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Validates an admin token with the backend.</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>token</code>: Admin token to validate</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with validation result (boolean)</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>fetchAdminToken()</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Fetches the admin token for setup.</p>
                    <p className="text-xs font-semibold">Returns:</p>
                    <p className="text-xs">Promise with admin token or null</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold mt-4">Admin Document Management</h4>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>fetchAdminDocuments(adminToken: string)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Fetches all documents (admin view).</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>adminToken</code>: Admin authentication token</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with array of documents</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>deleteDocument(adminToken: string, documentId: string)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Deletes a document (admin only).</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>adminToken</code>: Admin authentication token</li>
                      <li><code>documentId</code>: Document ID to delete</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with deletion result</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold mt-4">Admin System Prompts Management</h4>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>fetchAdminSystemPrompts(adminToken: string)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Fetches all system prompts (admin view).</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>adminToken</code>: Admin authentication token</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with array of system prompts</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>updateSystemPrompt(adminToken: string, promptId: string, promptData: any)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Updates a system prompt.</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>adminToken</code>: Admin authentication token</li>
                      <li><code>promptId</code>: System prompt ID to update</li>
                      <li><code>promptData</code>: Updated prompt data</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with update result</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mt-6">Document Processing API</h3>
                
                <h4 className="text-lg font-semibold mt-4">Document Initialization</h4>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>initializeQAChain(file: File, modelName: string)</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Initializes a QA chain with a document file and AI model.</p>
                    <p className="text-xs font-semibold">Parameters:</p>
                    <ul className="text-xs list-disc pl-6">
                      <li><code>file</code>: The document file to process (PDF, DOCX, etc.)</li>
                      <li><code>modelName</code>: The name of the Ollama model to use</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Returns:</p>
                    <p className="text-xs">Promise with QA chain result object</p>
                    <p className="text-xs font-semibold mt-2">Example:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs mt-1">
{`const qaChain = await initializeQAChain(file, "llama3");
console.log(qaChain.sessionId); // Session ID for future queries`}
                    </pre>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold mt-4">Available Models</h4>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                    <code>getOllamaModels()</code>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-2">Gets a list of available Ollama models.</p>
                    <p className="text-xs font-semibold">Returns:</p>
                    <p className="text-xs">Promise with array of model names</p>
                    <p className="text-xs font-semibold mt-2">Example:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs mt-1">
{`const models = await getOllamaModels();
console.log(models); // ["llama3", "mistral", "gemma", ...]`}
                    </pre>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mt-6">API Configuration</h3>
                
                <p>
                  The API client modules use configuration from <code>src/config/apiConfig.ts</code>, which includes:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><code>getApiBaseUrl()</code>: Determines the correct API base URL based on the environment</li>
                  <li><code>API_BASE_URL</code>: The base URL for API requests</li>
                  <li><code>apiUrl(endpoint)</code>: Utility function to create a fully qualified API URL</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Error Handling</h3>
                
                <p>
                  The API client modules include robust error handling with:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request timeout controls</li>
                  <li>Retry logic for failed requests</li>
                  <li>Detailed error reporting</li>
                  <li>Status code context in error messages</li>
                </ul>
                
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md p-4 mt-6">
                  <p className="font-semibold">API Security Note:</p>
                  <p>
                    The admin API operations require an admin token for authentication. Always ensure this token 
                    is kept secure and not exposed in client-side code or logs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <div className="mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          For more information, refer to the following resources:
        </p>
        <div className="flex flex-wrap gap-4 mt-2">
          <Link to="/" className="text-blue-500 hover:underline text-sm">Home</Link>
          <a href="/DEVELOPER_GUIDE.md" className="text-blue-500 hover:underline text-sm" target="_blank">Developer Guide</a>
          <a href="/AUTHENTICATION_GUIDE.md" className="text-blue-500 hover:underline text-sm" target="_blank">Authentication Guide</a>
          <a href="/README.md" className="text-blue-500 hover:underline text-sm" target="_blank">README</a>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
