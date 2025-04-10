
import { useState, useEffect } from "react";
import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";

const Documentation = () => {
  const documentationSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      items: [
        {
          id: "introduction",
          title: "Introduction",
          href: "introduction",
          content: (
            <div>
              <h1>Introduction to I4C Chatbot</h1>
              <p>
                The I4C Chatbot is a sophisticated document-based question answering system designed
                for the Indian Cybercrime Coordination Centre. It allows users to interact with
                uploaded documents through natural language queries, leveraging AI to extract
                and provide relevant information.
              </p>
              <p>
                This system enables law enforcement officials and authorized personnel to quickly
                access and analyze information from various documents, reports, and manuals related
                to cybercrime investigation and coordination.
              </p>

              <h2>Key Features</h2>
              <ul>
                <li>Document-based chat interactions using natural language</li>
                <li>Multi-model support for different types of documents</li>
                <li>Persistent chat history for continued conversations</li>
                <li>Role-based access control for secure document management</li>
                <li>Admin interface for document and system management</li>
              </ul>
            </div>
          ),
        },
        {
          id: "quick-start",
          title: "Quick Start Guide",
          href: "quick-start",
          content: (
            <div>
              <h1>Quick Start Guide</h1>
              <p>
                This guide will help you quickly get started with the I4C Chatbot interface.
              </p>

              <h2>1. Logging In</h2>
              <p>
                Use your authorized credentials to log in through the authentication page.
                Different access levels (admin vs. regular user) will determine what features
                are available to you.
              </p>

              <h2>2. Selecting a Document</h2>
              <p>
                From the sidebar, choose a document you wish to interact with. The document
                will be loaded and prepared for querying.
              </p>

              <h2>3. Asking Questions</h2>
              <p>
                Use the chat interface to ask questions about the selected document. Type your
                question in the input field at the bottom of the screen and press Enter or
                click the Send button.
              </p>

              <h2>4. Viewing Responses</h2>
              <p>
                The AI will analyze the document and provide relevant answers based on the
                content. Responses appear in the chat window, with the most recent at the bottom.
              </p>

              <h2>5. Managing Conversations</h2>
              <p>
                You can start new chats, switch between previous conversations, or continue
                existing ones using the chat history panel on the right side of the interface.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: "using-the-system",
      title: "Using the System",
      items: [
        {
          id: "chatting",
          title: "Chatting with Documents",
          href: "chatting",
          content: (
            <div>
              <h1>Chatting with Documents</h1>
              <p>
                The core functionality of the I4C Chatbot allows you to have interactive
                conversations with the content of selected documents. Here's how to make
                the most of this feature:
              </p>

              <h2>Question Formulation</h2>
              <p>
                When asking questions, try to be specific and clear. The AI performs best
                when questions are direct and focused on particular information within the document.
              </p>
              <ul>
                <li><strong>Good:</strong> "What are the key procedures for handling digital evidence?"</li>
                <li><strong>Better:</strong> "What steps should be taken when collecting mobile phone evidence according to section 3.2?"</li>
              </ul>

              <h2>Follow-up Questions</h2>
              <p>
                The system maintains context within a conversation, allowing you to ask follow-up 
                questions that reference previous queries or answers without restating the entire context.
              </p>

              <h2>Managing Chat Sessions</h2>
              <p>
                You can create multiple chat sessions for different inquiry threads, even on the same document.
                This helps organize your research and investigations into logical segments.
              </p>
              <p>
                Use the "New Chat" button to start a fresh conversation, or select a previous chat
                from the history panel to continue where you left off.
              </p>

              <h2>Processing Time</h2>
              <p>
                For large or complex documents, the initial loading may take a few moments.
                Similarly, detailed questions might require additional processing time.
                The system provides visual feedback during these operations.
              </p>
            </div>
          ),
        },
        {
          id: "document-selection",
          title: "Document Selection",
          href: "document-selection",
          content: (
            <div>
              <h1>Document Selection</h1>
              <p>
                The I4C Chatbot allows you to interact with various documents that have been
                uploaded and processed by administrators. Understanding how to select and
                switch between documents is essential for effective use.
              </p>

              <h2>Browsing Available Documents</h2>
              <p>
                All documents available to you are listed in the left sidebar of the application.
                Each document entry shows:
              </p>
              <ul>
                <li>Document title</li>
                <li>Document type/model (when visible)</li>
              </ul>

              <h2>Selecting a Document</h2>
              <p>
                To select a document:
              </p>
              <ol>
                <li>Locate the document in the sidebar list</li>
                <li>Click on the document title or icon</li>
                <li>Wait for the document to load and process</li>
                <li>Once loaded, the document details will appear in the "Current Document" section</li>
              </ol>

              <h2>Understanding Document Models</h2>
              <p>
                Documents may be processed using different AI models, optimized for various types of content:
              </p>
              <ul>
                <li><strong>Standard:</strong> General-purpose document analysis</li>
                <li><strong>Legal:</strong> Optimized for legal documents and regulations</li>
                <li><strong>Technical:</strong> Better for technical manuals and specifications</li>
              </ul>
              <p>
                The model used for a document is selected by administrators during the upload process
                and is displayed in the document details section.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: "admin-features",
      title: "Administrator Features",
      items: [
        {
          id: "document-management",
          title: "Document Management",
          href: "document-management",
          content: (
            <div>
              <h1>Document Management</h1>
              <p>
                Administrators have access to comprehensive document management capabilities,
                allowing for the maintenance and organization of the document repository.
              </p>

              <h2>Uploading Documents</h2>
              <p>
                To upload a new document:
              </p>
              <ol>
                <li>Navigate to the Admin panel</li>
                <li>Select "Document Management"</li>
                <li>Click "Upload Document" or drag files to the designated area</li>
                <li>Provide a title and optional description</li>
                <li>Select the appropriate AI model for processing</li>
                <li>Submit the document for processing</li>
              </ol>
              <p>
                Processing time depends on document size and complexity. The system will notify you
                when processing is complete.
              </p>

              <h2>Managing Existing Documents</h2>
              <p>
                For existing documents, administrators can:
              </p>
              <ul>
                <li>View document details and metadata</li>
                <li>Update document titles or descriptions</li>
                <li>Delete documents that are no longer needed</li>
                <li>Monitor document usage statistics</li>
              </ul>

              <h2>Document Access Control</h2>
              <p>
                The system allows for controlling which user roles can access specific documents.
                This helps in maintaining confidentiality and ensuring appropriate information
                access based on user clearance.
              </p>
            </div>
          ),
        },
        {
          id: "user-management",
          title: "User Management",
          href: "user-management",
          content: (
            <div>
              <h1>User Management</h1>
              <p>
                The I4C Chatbot includes a comprehensive user management system that allows
                administrators to control access and permissions within the application.
              </p>

              <h2>User Roles</h2>
              <p>
                The system supports multiple user roles, each with different levels of access:
              </p>
              <ul>
                <li><strong>Administrators:</strong> Full system access, including user management, document management, and system settings</li>
                <li><strong>Moderators:</strong> Can view all documents and manage some content but cannot change system settings</li>
                <li><strong>Regular Users:</strong> Can only access documents and features they've been granted permission to use</li>
              </ul>

              <h2>Creating New Users</h2>
              <p>
                To add a new user to the system:
              </p>
              <ol>
                <li>Navigate to the Admin panel</li>
                <li>Select "User Management"</li>
                <li>Click "Add User"</li>
                <li>Fill in the required information (name, email, role, etc.)</li>
                <li>Set initial password or enable self-registration</li>
                <li>Save the new user profile</li>
              </ol>

              <h2>Managing Existing Users</h2>
              <p>
                For existing users, administrators can:
              </p>
              <ul>
                <li>Edit user information and contact details</li>
                <li>Modify user roles and permissions</li>
                <li>Reset passwords</li>
                <li>Disable or delete user accounts</li>
                <li>View user activity logs</li>
              </ul>

              <h2>User Authentication Security</h2>
              <p>
                The system employs several security measures for user authentication:
              </p>
              <ul>
                <li>Password complexity requirements</li>
                <li>Account lockout after failed attempts</li>
                <li>Session timeout for inactive users</li>
                <li>Optional two-factor authentication</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: "system-architecture",
      title: "System Architecture",
      items: [
        {
          id: "frontend",
          title: "Frontend Architecture",
          href: "frontend",
          content: (
            <div>
              <h1>Frontend Architecture</h1>
              <p>
                The I4C Chatbot frontend is built using modern web technologies to deliver
                a responsive, accessible, and intuitive user experience.
              </p>

              <h2>Technology Stack</h2>
              <p>
                The frontend is developed using:
              </p>
              <ul>
                <li><strong>React:</strong> A JavaScript library for building user interfaces</li>
                <li><strong>TypeScript:</strong> For type safety and improved developer experience</li>
                <li><strong>Tailwind CSS:</strong> For styling and responsive design</li>
                <li><strong>shadcn/ui:</strong> For consistent, accessible UI components</li>
                <li><strong>Tanstack Query:</strong> For efficient data fetching and state management</li>
              </ul>

              <h2>Component Structure</h2>
              <p>
                The application follows a component-based architecture:
              </p>
              <ul>
                <li><strong>Pages:</strong> Main views like Index, Admin, Auth, Documentation</li>
                <li><strong>Components:</strong> Reusable UI elements organized by functionality</li>
                <li><strong>Contexts:</strong> Global state management for themes, authentication, etc.</li>
                <li><strong>Hooks:</strong> Custom React hooks for shared logic</li>
                <li><strong>Lib:</strong> Utility functions and API clients</li>
              </ul>

              <h2>Responsive Design</h2>
              <p>
                The interface is designed to work across various device sizes:
              </p>
              <ul>
                <li>Mobile-optimized layouts with appropriate navigation patterns</li>
                <li>Tablet and desktop versions with expanded functionality</li>
                <li>Adaptive components that adjust to available screen space</li>
              </ul>

              <h2>State Management</h2>
              <p>
                The application uses multiple approaches to state management:
              </p>
              <ul>
                <li>React Context for global application state</li>
                <li>Local component state for UI-specific concerns</li>
                <li>React Query for server state management</li>
                <li>LocalStorage for persisting user preferences and sessions</li>
              </ul>
            </div>
          ),
        },
        {
          id: "backend",
          title: "Backend Integration",
          href: "backend",
          content: (
            <div>
              <h1>Backend Integration</h1>
              <p>
                The I4C Chatbot frontend integrates with a specialized backend that handles
                document processing, chat functionality, and user management.
              </p>

              <h2>API Architecture</h2>
              <p>
                The frontend communicates with the backend through a RESTful API:
              </p>
              <ul>
                <li>Authentication endpoints for user management</li>
                <li>Document API for upload, retrieval, and management</li>
                <li>Chat API for processing queries and managing conversations</li>
                <li>Admin API for system configuration and monitoring</li>
              </ul>

              <h2>Document Processing</h2>
              <p>
                When a document is uploaded or selected, the following occurs:
              </p>
              <ol>
                <li>Document is sent to the backend for processing</li>
                <li>Backend parses and indexes the document content</li>
                <li>AI models create a searchable representation of the document</li>
                <li>The processed document becomes available for querying</li>
              </ol>

              <h2>Chat Processing Workflow</h2>
              <p>
                When a user submits a question:
              </p>
              <ol>
                <li>Query is sent to the backend API</li>
                <li>Backend processes the query against the selected document</li>
                <li>Relevant information is extracted from the document</li>
                <li>AI formulates a natural language response</li>
                <li>Response is streamed back to the frontend</li>
                <li>Conversation history is updated and persisted</li>
              </ol>

              <h2>Data Security</h2>
              <p>
                Security measures implemented for the API include:
              </p>
              <ul>
                <li>JWT authentication for secure API access</li>
                <li>HTTPS encryption for all communications</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Input validation to prevent injection attacks</li>
                <li>Access controls based on user permissions</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: "deployment",
      title: "Deployment & Scaling",
      items: [
        {
          id: "deployment-guide",
          title: "Deployment Guide",
          href: "deployment-guide",
          content: (
            <div>
              <h1>Deployment Guide</h1>
              <p>
                This guide covers the steps required to deploy the I4C Chatbot system
                in production environments.
              </p>

              <h2>System Requirements</h2>
              <p>
                Minimum requirements for production deployment:
              </p>
              <ul>
                <li>Modern web server (Nginx, Apache)</li>
                <li>Node.js runtime environment (v16+)</li>
                <li>Python environment (3.8+) for backend services</li>
                <li>Database server (PostgreSQL recommended)</li>
                <li>Storage solution for documents and indices</li>
                <li>16GB RAM minimum (32GB+ recommended for larger deployments)</li>
                <li>Multi-core CPU architecture</li>
              </ul>

              <h2>Deployment Options</h2>
              <p>
                The system can be deployed using several methods:
              </p>
              <ul>
                <li><strong>Docker containerization:</strong> Using the provided Dockerfile and docker-compose configuration</li>
                <li><strong>Traditional server setup:</strong> Manual installation of components</li>
                <li><strong>Cloud deployment:</strong> Using services like AWS, Google Cloud, or Azure</li>
              </ul>

              <h2>Docker Deployment (Recommended)</h2>
              <p>
                Steps for deploying with Docker:
              </p>
              <ol>
                <li>Ensure Docker and docker-compose are installed</li>
                <li>Clone the repository</li>
                <li>Configure environment variables in .env file</li>
                <li>Run <code>docker-compose up -d</code> to start the services</li>
                <li>The system will be available on the configured port</li>
              </ol>

              <h2>Environment Variables</h2>
              <p>
                Required environment variables include:
              </p>
              <ul>
                <li><code>API_BASE_URL</code>: Backend API endpoint</li>
                <li><code>JWT_SECRET</code>: Secret for JWT token generation</li>
                <li><code>DATABASE_URL</code>: Connection string for the database</li>
                <li><code>STORAGE_PATH</code>: Path for document storage</li>
              </ul>

              <h2>SSL Configuration</h2>
              <p>
                For production deployments, SSL is mandatory:
              </p>
              <ul>
                <li>Obtain an SSL certificate from a trusted provider</li>
                <li>Configure the web server to use HTTPS</li>
                <li>Set up redirects from HTTP to HTTPS</li>
                <li>Implement appropriate security headers</li>
              </ul>
            </div>
          ),
        },
        {
          id: "scaling",
          title: "Scaling Strategies",
          href: "scaling",
          content: (
            <div>
              <h1>Scaling Strategies</h1>
              <p>
                As usage of the I4C Chatbot increases, you may need to scale the system
                to accommodate growing demands. This guide outlines strategies for scaling
                different components of the application.
              </p>

              <h2>Vertical Scaling</h2>
              <p>
                Increasing resources on existing servers:
              </p>
              <ul>
                <li>Upgrade CPU and RAM for better processing performance</li>
                <li>Increase storage capacity for more documents</li>
                <li>Optimize database server configuration</li>
              </ul>
              <p>
                <strong>Pros:</strong> Simpler implementation, no architectural changes<br />
                <strong>Cons:</strong> Limited by hardware constraints, potential downtime during upgrades
              </p>

              <h2>Horizontal Scaling</h2>
              <p>
                Adding more instances of application components:
              </p>
              <ul>
                <li>Deploy multiple frontend instances behind a load balancer</li>
                <li>Scale backend API servers based on demand</li>
                <li>Implement document processing worker pools</li>
                <li>Database replication and sharding</li>
              </ul>
              <p>
                <strong>Pros:</strong> Near-linear scalability, improved reliability<br />
                <strong>Cons:</strong> More complex architecture, potential state management challenges
              </p>

              <h2>Caching Strategies</h2>
              <p>
                Implementing caching to reduce load:
              </p>
              <ul>
                <li>Response caching for common queries</li>
                <li>Document index caching</li>
                <li>Session data caching</li>
                <li>Static asset CDN distribution</li>
              </ul>

              <h2>Database Scaling</h2>
              <p>
                Options for scaling the database:
              </p>
              <ul>
                <li>Read replicas for distributing query load</li>
                <li>Sharding for distributing write operations</li>
                <li>Connection pooling for efficient resource utilization</li>
                <li>Consider NoSQL solutions for specific data types</li>
              </ul>

              <h2>Monitoring and Autoscaling</h2>
              <p>
                Implementing dynamic scaling based on demand:
              </p>
              <ul>
                <li>Set up comprehensive monitoring of system metrics</li>
                <li>Configure autoscaling rules based on CPU, memory, and request load</li>
                <li>Implement circuit breakers for resilience during peak loads</li>
                <li>Regular performance testing to identify bottlenecks</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      items: [
        {
          id: "common-issues",
          title: "Common Issues",
          href: "common-issues",
          content: (
            <div>
              <h1>Common Issues and Solutions</h1>
              <p>
                This section covers frequently encountered issues and their solutions
                to help users and administrators troubleshoot problems.
              </p>

              <h2>Document Loading Problems</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Issue</th>
                    <th className="border p-2 text-left">Possible Causes</th>
                    <th className="border p-2 text-left">Solutions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Document fails to load</td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Network connectivity issues</li>
                        <li>Server processing error</li>
                        <li>Document corruption</li>
                      </ul>
                    </td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Check network connection</li>
                        <li>Refresh the page</li>
                        <li>Ask administrator to check document status</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Document processing takes too long</td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Large document size</li>
                        <li>Complex document structure</li>
                        <li>Server under heavy load</li>
                      </ul>
                    </td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Be patient for large documents</li>
                        <li>Try processing during off-peak hours</li>
                        <li>Consider splitting very large documents</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>Chat Response Issues</h2>
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Issue</th>
                    <th className="border p-2 text-left">Possible Causes</th>
                    <th className="border p-2 text-left">Solutions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">No response to questions</td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>API timeout</li>
                        <li>Connection issues</li>
                        <li>Server errors</li>
                      </ul>
                    </td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Check network connection</li>
                        <li>Refresh the page and try again</li>
                        <li>Verify session hasn't expired</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Irrelevant or incorrect answers</td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Ambiguous question</li>
                        <li>Information not in document</li>
                        <li>AI limitations</li>
                      </ul>
                    </td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Rephrase question to be more specific</li>
                        <li>Check if information exists in document</li>
                        <li>Provide more context in your question</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>Login and Authentication Issues</h2>
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Issue</th>
                    <th className="border p-2 text-left">Possible Causes</th>
                    <th className="border p-2 text-left">Solutions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Unable to log in</td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Incorrect credentials</li>
                        <li>Account locked or disabled</li>
                        <li>Authentication service issues</li>
                      </ul>
                    </td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Verify username and password</li>
                        <li>Use password reset if available</li>
                        <li>Contact administrator for account status</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Session unexpectedly ends</td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Session timeout</li>
                        <li>Token expiration</li>
                        <li>Multiple logins from different devices</li>
                      </ul>
                    </td>
                    <td className="border p-2">
                      <ul className="list-disc pl-4">
                        <li>Log in again</li>
                        <li>Check for session timeout settings</li>
                        <li>Avoid sharing credentials across devices</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: "error-codes",
          title: "Error Codes Reference",
          href: "error-codes",
          content: (
            <div>
              <h1>Error Codes Reference</h1>
              <p>
                This reference guide documents the error codes you may encounter when using
                the I4C Chatbot system, along with explanations and recommended actions.
              </p>

              <h2>API Error Codes</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Code</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Suggested Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2"><code>AUTH_001</code></td>
                    <td className="border p-2">Authentication token missing</td>
                    <td className="border p-2">Log in again to obtain a new token</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>AUTH_002</code></td>
                    <td className="border p-2">Authentication token expired</td>
                    <td className="border p-2">Log in again to refresh your session</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>AUTH_003</code></td>
                    <td className="border p-2">Insufficient permissions</td>
                    <td className="border p-2">Contact administrator for proper access rights</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>DOC_001</code></td>
                    <td className="border p-2">Document not found</td>
                    <td className="border p-2">Verify document ID or check if document has been deleted</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>DOC_002</code></td>
                    <td className="border p-2">Document processing failed</td>
                    <td className="border p-2">Check document format and try uploading again</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>CHAT_001</code></td>
                    <td className="border p-2">Session creation failed</td>
                    <td className="border p-2">Try selecting the document again</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>CHAT_002</code></td>
                    <td className="border p-2">Query processing timeout</td>
                    <td className="border p-2">Try a simpler question or check network connection</td>
                  </tr>
                </tbody>
              </table>

              <h2>Frontend Error Codes</h2>
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Code</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Suggested Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2"><code>UI_001</code></td>
                    <td className="border p-2">Component rendering failure</td>
                    <td className="border p-2">Refresh the page or clear browser cache</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>UI_002</code></td>
                    <td className="border p-2">Form validation error</td>
                    <td className="border p-2">Check input fields for correct format</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>UI_003</code></td>
                    <td className="border p-2">Local storage access error</td>
                    <td className="border p-2">Ensure cookies/local storage is enabled in browser</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>NET_001</code></td>
                    <td className="border p-2">Network request failed</td>
                    <td className="border p-2">Check internet connection and try again</td>
                  </tr>
                  <tr>
                    <td className="border p-2"><code>NET_002</code></td>
                    <td className="border p-2">API connection timeout</td>
                    <td className="border p-2">Wait and retry, or check with administrator</td>
                  </tr>
                </tbody>
              </table>

              <h2>Contacting Support</h2>
              <p>
                If you encounter persistent errors or issues not covered in this reference:
              </p>
              <ul>
                <li>For system administrators: Check server logs for detailed error information</li>
                <li>For users: Contact your organization's IT support or system administrator</li>
                <li>Include the error code and a description of the actions that led to the error</li>
                <li>Note any recent system changes or updates that might be relevant</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: "developer-guide",
      title: "Developer Guide",
      items: [
        {
          id: "codebase-structure",
          title: "Codebase Structure",
          href: "codebase-structure",
          content: (
            <div className="animate-fade-in">
              <h1>Codebase Structure</h1>
              <p className="text-lg mb-6">
                This guide explains the project's file structure and organization to help developers understand
                and navigate the codebase effectively.
              </p>

              <h2 className="mt-8 mb-4">Directory Structure</h2>
              <div className="overflow-auto">
                <pre className="p-4 bg-muted rounded-lg mb-6 text-sm">
                  {`src/
├── components/     # UI components organized by feature
│   ├── ui/         # Shadcn/UI components
│   ├── admin/      # Admin interface components
│   ├── auth/       # Authentication components
│   └── documentation/ # Documentation UI components
├── contexts/       # React contexts for global state
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and API clients
├── pages/          # Application pages/routes
└── index.css       # Global CSS styles`}
                </pre>
              </div>

              <h2 className="mt-8 mb-4">Key Files</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg transition-all hover:shadow-md">
                  <h3 className="text-lg font-semibold mb-2">src/main.tsx</h3>
                  <p>Application entry point that sets up the React root and router.</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Renders the root component with React Router</li>
                    <li>Imports global CSS styles</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg transition-all hover:shadow-md">
                  <h3 className="text-lg font-semibold mb-2">src/App.tsx</h3>
                  <p>Main application component that sets up:</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li>React Query client</li>
                    <li>Theme context</li>
                    <li>Authentication context</li>
                    <li>Route definitions and protection</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg transition-all hover:shadow-md">
                  <h3 className="text-lg font-semibold mb-2">src/contexts/</h3>
                  <p>Contains global state management via React Context:</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li><strong>AuthContext.tsx:</strong> Manages user authentication state</li>
                    <li><strong>ThemeContext.tsx:</strong> Handles theme switching (light/dark/system)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg transition-all hover:shadow-md">
                  <h3 className="text-lg font-semibold mb-2">src/pages/</h3>
                  <p>Contains top-level page components, each corresponding to a route:</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li><strong>Index.tsx:</strong> Main chatbot interface</li>
                    <li><strong>Admin.tsx:</strong> Admin dashboard</li>
                    <li><strong>AdminAuth.tsx:</strong> Admin authentication</li>
                    <li><strong>Auth.tsx:</strong> User authentication</li>
                    <li><strong>Documentation.tsx:</strong> Documentation system</li>
                    <li><strong>NotFound.tsx:</strong> 404 page</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg transition-all hover:shadow-md">
                  <h3 className="text-lg font-semibold mb-2">src/lib/</h3>
                  <p>Contains utility functions and service modules:</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li><strong>apiClient.ts:</strong> API integration for user-facing features</li>
                    <li><strong>adminApiClient.ts:</strong> Admin-specific API functions</li>
                    <li><strong>documentProcessor.ts:</strong> Logic for document processing and QA</li>
                    <li><strong>utils.ts:</strong> Generic utility functions</li>
                    <li><strong>auth.ts:</strong> Authentication utilities</li>
                  </ul>
                </div>
              </div>

              <h2 className="mt-8 mb-4">Component Structure</h2>
              <p className="mb-4">
                Components are organized by feature area and follow a consistent pattern:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">UI Components</h3>
                  <p className="mb-2">Located in <code>src/components/ui/</code>:</p>
                  <ul className="list-disc ml-5">
                    <li>Shadcn/UI base components</li>
                    <li>Reusable across the application</li>
                    <li>Provide consistent styling</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Feature Components</h3>
                  <p className="mb-2">Located in feature-specific directories:</p>
                  <ul className="list-disc ml-5">
                    <li>Compose UI components into feature-specific UIs</li>
                    <li>Contain business logic for their feature area</li>
                    <li>May connect to API or state management</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "customization-guide",
          title: "Customization Guide",
          href: "customization-guide",
          content: (
            <div className="animate-fade-in">
              <h1>Customization Guide</h1>
              <p className="text-lg mb-6">
                This guide explains how to customize and extend the application for different use cases.
              </p>

              <h2 className="mt-8 mb-4">Theme Customization</h2>
              <p className="mb-4">
                The application uses CSS variables for theming, which can be customized in:
              </p>
              <pre className="p-4 bg-muted rounded-lg mb-6 text-sm">
                {`// src/index.css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    /* ... other variables */
  }

  .dark {
    --background: 220 10% 12%;
    --foreground: 220 20% 85%;
    /* ... other variables */
  }
}`}
              </pre>
              <p className="mb-6">
                These variables control the color scheme used throughout the application.
                Modify them to create a custom theme.
              </p>

              <h2 className="mt-8 mb-4">Adding New Components</h2>
              <p className="mb-4">
                To add a new component to the application:
              </p>
              <ol className="list-decimal ml-8 mb-6 space-y-2">
                <li>Create a new file in the appropriate directory under <code>src/components/</code></li>
                <li>Export the component as either a default or named export</li>
                <li>Import and use the component where needed</li>
              </ol>

              <p className="mb-4">Example of a new component:</p>
              <pre className="p-4 bg-muted rounded-lg mb-6 text-sm">
                {`// src/components/MyNewComponent.tsx
import React from 'react';

interface MyNewComponentProps {
  title: string;
  children: React.ReactNode;
}

export function MyNewComponent({ title, children }: MyNewComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}`}
              </pre>

              <h2 className="mt-8 mb-4">Adding New Routes</h2>
              <p className="mb-4">
                To add a new route to the application:
              </p>
              <ol className="list-decimal ml-8 mb-6 space-y-2">
                <li>Create a new page component in <code>src/pages/</code></li>
                <li>Add the route to the router in <code>src/App.tsx</code></li>
                <li>Decide if the route should be protected or public</li>
              </ol>

              <p className="mb-4">Example of adding a new route:</p>
              <pre className="p-4 bg-muted rounded-lg mb-6 text-sm">
                {`// In src/App.tsx, add to the Routes component:

<Route path="/new-feature" element={<UserRoute element={<NewFeature />} />} />

// For an admin-only route:
<Route path="/admin/new-feature" element={<AdminTokenRoute element={<AdminNewFeature />} />} />`}
              </pre>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <DocumentationLayout sections={documentationSections}>
      <div className="prose prose-slate max-w-none">
        <h1>I4C Chatbot Documentation</h1>
        <p>
          Welcome to the documentation for the I4C Chatbot system. This
          comprehensive guide will help you understand, use, and administer the
          system effectively.
        </p>
        <p>
          Select a topic from the sidebar to explore specific areas of the
          documentation.
        </p>
      </div>
    </DocumentationLayout>
  );
};

export default Documentation;

