
# PDF Chatbot Developer Guide

This guide provides technical information for developers who want to understand, extend, or modify the PDF Chatbot application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Code Structure](#code-structure)
4. [Technology Stack](#technology-stack)
5. [Development Setup](#development-setup)
6. [Key Workflows](#key-workflows)
7. [Function Reference](#function-reference)
8. [API Documentation](#api-documentation)
9. [Common Usage Patterns](#common-usage-patterns)
10. [Testing](#testing)
11. [Performance Considerations](#performance-considerations)
12. [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

PDF Chatbot is a React-based web application that uses LangChain for document processing and QA capabilities. It integrates with Ollama for AI model inference. The application follows a component-based architecture with a clear separation of concerns:

- **UI Layer**: React components for user interaction
- **Business Logic Layer**: Document processing, embedding, and query handling
- **API Layer**: Integration with Ollama API for model inference

Data flows as follows:
1. User uploads a PDF document
2. Document is processed, chunked, and embedded
3. Embeddings are stored in a vector database (FAISS)
4. User submits a question
5. Question is used to retrieve relevant document chunks
6. Chunks and question are sent to the Ollama model
7. Response is streamed back to the UI

## System Components

### Document Processing

The document processing pipeline consists of:

1. **Document Loading**: Uses pdf-parse to extract text from PDF files
2. **Text Splitting**: Splits the document into manageable chunks using RecursiveCharacterTextSplitter
3. **Embedding Creation**: Converts text chunks to vector embeddings using SentenceTransformerEmbeddings
4. **Vector Storage**: Stores embeddings in a FAISS vector store for efficient retrieval

### Query Processing

The query processing pipeline consists of:

1. **Query Embedding**: Converts user query to vector representation
2. **Retrieval**: Finds most similar document chunks using vector similarity
3. **Prompt Construction**: Combines query and retrieved chunks into a prompt
4. **LLM Inference**: Sends prompt to Ollama model and streams response
5. **Response Handling**: Displays streaming tokens in the UI

## Code Structure

```
src/
├── components/         # Reusable UI components
│   └── ChatMessage.tsx # Chat message component
├── lib/                # Utility functions and business logic
│   └── documentProcessor.ts # PDF processing and QA logic
├── pages/              # Application pages
│   ├── Index.tsx       # Main chatbot interface
│   ├── Documentation.tsx # Documentation page
│   └── NotFound.tsx    # 404 page
└── App.tsx             # Application entry point
```

### Key Files

- **documentProcessor.ts**: Contains the core document processing and QA logic
- **Index.tsx**: Main application UI and state management
- **ChatMessage.tsx**: Component for rendering chat messages

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Document Processing**: LangChain.js
- **PDF Parsing**: pdf-parse
- **Embeddings**: SentenceTransformerEmbeddings
- **Vector Store**: FAISS (Facebook AI Similarity Search)
- **LLM Interface**: Ollama API
- **File Upload**: react-dropzone
- **UI Components**: shadcn/ui (based on Radix UI)

## Development Setup

### Prerequisites

- Node.js 16 or higher
- Ollama installed (for model inference)
- At least one Ollama model downloaded

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-chatbot.git
cd pdf-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Development Mode Features

- Hot reloading for instant feedback
- Error overlay for debugging
- Console warnings for potential issues

## Key Workflows

### Document Upload and Processing

The document upload and processing workflow is implemented in `Index.tsx` and `documentProcessor.ts`:

1. User uploads a PDF using react-dropzone
2. File is passed to `initializeQAChain` function
3. Function loads the PDF, splits it, creates embeddings, and initializes the QA chain
4. QA chain is stored in state for later use

```typescript
// Simplified example of the document processing flow
const handleFileUpload = async (file) => {
  try {
    setIsProcessing(true);
    const qaChain = await initializeQAChain(file, selectedModel);
    setQaChain(qaChain);
  } finally {
    setIsProcessing(false);
  }
};
```

### Question Answering

The question answering workflow:

1. User submits a question through the chat input
2. Question is passed to the `processQuery` function along with the QA chain
3. Function retrieves relevant document chunks and generates a response
4. Response is streamed back to the UI

```typescript
// Simplified example of the question answering flow
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const userMessage = { role: "user", content: prompt };
  setMessages(prev => [...prev, userMessage]);
  
  let responseText = "";
  await processQuery(prompt, qaChain, (token) => {
    responseText += token;
    setStreamingContent(responseText);
  });
  
  setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
};
```

## Function Reference

This section provides detailed information about key functions in the application, including their purpose, usage patterns, and references to files where they are used.

### Document Processing Functions

#### `initializeQAChain`

**Location**: `src/lib/documentProcessor.ts`

**Purpose**: Initializes a QA chain with a PDF file and Ollama model.

**Parameters**:
- `file`: The PDF file to process
- `modelName`: The name of the Ollama model to use
- `retrievalOptions`: Options for document retrieval (optional)

**Returns**: A promise that resolves to a QA chain object.

**Used in**:
- `src/pages/Index.tsx` - For handling document uploads in the main chat interface
- `src/components/DocumentUploader.tsx` - For processing uploaded files

**Usage Example**:
```typescript
const handleFileUpload = async (file) => {
  const qaChain = await initializeQAChain(file, "llama3");
  setQaChain(qaChain);
};
```

**Workflow**:
1. Creates a FormData object with the file and model
2. Sends an HTTP POST request to the upload endpoint
3. Processes the server response
4. Returns a QA chain object with the session ID and model name

#### `processQuery`

**Location**: `src/lib/documentProcessor.ts`

**Purpose**: Processes a user query against a document using the QA chain.

**Parameters**:
- `query`: The question to ask
- `qaChain`: The QA chain object containing sessionId
- `streamCallback`: A callback function for streaming tokens (optional)

**Returns**: A promise that resolves to the final answer.

**Used in**:
- `src/pages/Index.tsx` - For handling user questions in the chat interface
- `src/components/ChatInterface.tsx` - For submitting questions to the backend

**Usage Example**:
```typescript
const handleSubmit = async (question) => {
  let responseText = "";
  await processQuery(question, qaChain, (token) => {
    responseText += token;
    setStreamingContent(responseText);
  });
  
  setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
};
```

**Workflow**:
1. Sends an HTTP POST request to the query endpoint with the question and session ID
2. Processes streaming tokens if a callback is provided
3. Returns the final answer

#### `getOllamaModels`

**Location**: `src/lib/documentProcessor.ts`

**Purpose**: Fetches available Ollama models from the backend.

**Parameters**: None

**Returns**: A promise that resolves to an array of model names.

**Used in**:
- `src/pages/Index.tsx` - For populating the model selection dropdown
- `src/components/ModelDropdown.tsx` - For displaying available models

**Usage Example**:
```typescript
useEffect(() => {
  const fetchModels = async () => {
    try {
      const models = await getOllamaModels();
      setAvailableModels(models);
    } catch (error) {
      console.error("Failed to fetch models:", error);
    }
  };
  
  fetchModels();
}, []);
```

**Workflow**:
1. Sends an HTTP GET request to the models endpoint
2. Processes the server response
3. Returns an array of model names or defaults if the request fails

### API Client Functions

#### `fetchDocuments`

**Location**: `src/lib/apiClient.ts`

**Purpose**: Fetches all available documents from the API.

**Parameters**: None

**Returns**: A promise with an array of documents.

**Used in**:
- `src/pages/Admin.tsx` - For displaying the list of available documents
- `src/components/admin/DocumentsList.tsx` - For rendering document cards

**Usage Example**:
```typescript
useEffect(() => {
  const loadDocuments = async () => {
    try {
      const documents = await fetchDocuments();
      setDocuments(documents);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };
  
  loadDocuments();
}, []);
```

**Workflow**:
1. Sends an HTTP GET request to the documents endpoint
2. Processes the server response with retry logic
3. Returns the documents array or throws an error

#### `selectDocument`

**Location**: `src/lib/apiClient.ts`

**Purpose**: Selects a document for querying.

**Parameters**:
- `documentId`: Document ID to select
- `model`: Model to use for the document
- `options`: Optional parameters for document selection

**Returns**: A promise with session ID.

**Used in**:
- `src/pages/Index.tsx` - For selecting documents from the document list
- `src/components/DocumentSelector.tsx` - For handling document selection events

**Usage Example**:
```typescript
const handleDocumentSelect = async (docId) => {
  try {
    const { session_id } = await selectDocument(docId, selectedModel, {
      promptId: 'default',
      temperature: 0.0
    });
    setSessionId(session_id);
  } catch (error) {
    console.error("Error selecting document:", error);
  }
};
```

**Workflow**:
1. Sends an HTTP POST request to the select-document endpoint
2. Includes document ID, model, and options in the request body
3. Returns the session ID or throws an error

#### `processQuery` (API Client version)

**Location**: `src/lib/apiClient.ts`

**Purpose**: Process a query against a selected document.

**Parameters**:
- `sessionId`: Session ID for the query
- `query`: Query text
- `options`: Additional query options

**Returns**: Promise with answer and tokens.

**Used in**:
- `src/pages/Index.tsx` - For handling user questions with selected documents
- `src/components/ChatInterface.tsx` - For submitting questions to the backend

**Usage Example**:
```typescript
const submitQuestion = async (question) => {
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
};
```

**Workflow**:
1. Sends an HTTP POST request to the query endpoint
2. Includes session ID, query, and options in the request body
3. Returns the full response data or throws an error

### Authentication Functions

#### `login`

**Location**: `src/lib/auth.ts`

**Purpose**: Authenticates a user and gets a token.

**Parameters**:
- `username`: User's username
- `password`: User's password

**Returns**: A promise with authentication token and user info.

**Used in**:
- `src/pages/Auth.tsx` - For handling user login
- `src/components/auth/LoginForm.tsx` - For submitting login credentials

**Usage Example**:
```typescript
const handleLogin = async (credentials) => {
  try {
    const { token, user } = await login(credentials.username, credentials.password);
    setAuthToken(token);
    setUser(user);
    navigate('/');
  } catch (error) {
    setError("Login failed. Please check your credentials.");
  }
};
```

**Workflow**:
1. Sends an HTTP POST request to the login endpoint
2. Includes username and password in the request body
3. Returns the token and user info or throws an error

#### `signup`

**Location**: `src/lib/auth.ts`

**Purpose**: Creates a new user account.

**Parameters**:
- `username`: New user's username
- `password`: New user's password
- `email`: New user's email

**Returns**: A promise with success status.

**Used in**:
- `src/pages/Auth.tsx` - For handling user registration
- `src/components/auth/SignupForm.tsx` - For submitting registration details

**Usage Example**:
```typescript
const handleSignup = async (userData) => {
  try {
    await signup(userData.username, userData.password, userData.email);
    setSuccess("Account created successfully. You can now log in.");
  } catch (error) {
    setError("Registration failed. Please try again.");
  }
};
```

**Workflow**:
1. Sends an HTTP POST request to the signup endpoint
2. Includes username, password, and email in the request body
3. Returns success status or throws an error

## Common Usage Patterns

### Working with Documents

Documents are central to the application. Here are common patterns for working with them:

#### Uploading and Processing Documents

Documents are uploaded through the UI using react-dropzone. The uploaded file is then processed using the `initializeQAChain` function from `documentProcessor.ts`.

**Key Components**:
- `src/components/admin/DocumentUpload.tsx` - UI for document upload
- `src/components/admin/DropzoneArea.tsx` - Drag-and-drop area for files
- `src/lib/documentProcessor.ts` - Processing logic

**Workflow**:
1. User selects or drops a file in the UI
2. File is validated for type and size
3. File is passed to `initializeQAChain` for processing
4. Loading state is managed during processing
5. Success/error states are handled and displayed to the user

#### Querying Documents

Users can query documents using the chat interface. Queries are processed using the `processQuery` function.

**Key Components**:
- `src/pages/Index.tsx` - Main chat interface
- `src/components/ChatMessage.tsx` - Displays chat messages
- `src/lib/documentProcessor.ts` - Query processing logic

**Workflow**:
1. User inputs a question in the chat interface
2. Question is sent to `processQuery` along with the QA chain
3. Response is streamed back and displayed in real-time
4. Chat history is updated with the new messages

### Authentication Flows

Authentication is handled through login and signup forms. The auth functions are defined in `src/lib/auth.ts`.

**Key Components**:
- `src/pages/Auth.tsx` - Authentication page
- `src/components/auth/LoginForm.tsx` - Login form
- `src/components/auth/SignupForm.tsx` - Signup form
- `src/contexts/AuthContext.tsx` - Auth context provider

**Workflow**:
1. User navigates to the auth page
2. User submits login/signup form
3. Form data is validated
4. Auth function (`login`/`signup`) is called
5. On success, user is redirected or shown a success message
6. On failure, an error message is displayed

## API Documentation

### Document Processor API

#### `initializeQAChain(file: File, modelName: string): Promise<any>`

Initializes a QA chain with a PDF file and Ollama model.

Parameters:
- `file`: The PDF file to process
- `modelName`: The name of the Ollama model to use

Returns:
- A promise that resolves to a QA chain object

#### `processQuery(query: string, qaChain: any, streamCallback: (token: string) => void): Promise<string>`

Processes a query using the QA chain and streams the response.

Parameters:
- `query`: The question to ask
- `qaChain`: The QA chain to use
- `streamCallback`: A callback function that receives streaming tokens

Returns:
- A promise that resolves to the final answer

#### `getOllamaModels(): Promise<string[]>`

Gets a list of available Ollama models.

Returns:
- A promise that resolves to an array of model names

## Testing

The application doesn't include automated tests yet, but here are some testing strategies:

### Manual Testing Checklist

1. Upload various PDF documents (different sizes, formats, content types)
2. Try different Ollama models
3. Ask a variety of questions (simple, complex, in/out of document scope)
4. Test edge cases (empty documents, very large documents, etc.)
5. Verify streaming responses work correctly
6. Check for memory leaks during extended use

### Potential Automated Testing

- Unit tests for document processing functions
- Component tests for UI elements
- Integration tests for the full application flow
- Performance benchmarks for different document sizes

## Performance Considerations

### Memory Usage

- PDF processing can be memory-intensive for large documents
- Vector embeddings and storage consume additional memory
- Consider implementing pagination or lazy loading for very large documents

### Optimization Techniques

1. **Chunking Strategy**: Adjust chunk size and overlap based on document type
2. **Model Selection**: Use smaller models for faster responses when appropriate
3. **Embedding Caching**: Cache embeddings for frequently used documents
4. **Streaming**: Always use streaming for responses to improve perceived performance

## Contributing Guidelines

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed information on how to contribute to the project.

---

This guide is maintained by the PDF Chatbot team. For any questions or clarifications, please open an issue on the repository.
