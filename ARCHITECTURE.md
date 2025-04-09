
# I4C Chatbot System Architecture

## Overview

The I4C Chatbot is a document-based question answering system designed for the Indian Cybercrime Coordination Centre. This system allows users to upload and query documents using natural language, leveraging local AI models through Ollama.

## System Components

### 1. Frontend Architecture

The frontend is built with React and TypeScript, providing a responsive and interactive user interface. Key components include:

- **React/TypeScript**: Core UI framework
- **Tailwind CSS**: For styling and responsive design
- **shadcn/ui**: Component library for consistent UI elements
- **Authentication System**: Browser-based authentication using IndexedDB for user storage
- **Document Viewer**: For displaying uploaded documents
- **Chat Interface**: For interacting with documents using natural language

### 2. Backend Architecture

The backend processing occurs in two places:

- **Browser-based Processing**: For authentication, user management, and simple operations
- **Python Flask Server**: For document processing, vector embedding, and AI inference (referenced in the documentation but implemented separately)

### 3. Database Architecture

- **IndexedDB**: Browser-based database for user authentication and session management
- **Vector Database**: FAISS for document embeddings and similarity search (in Python backend)

### 4. Authentication System

- **User Roles**: Admin, Moderator, and regular User roles
- **Session Management**: Token-based authentication with expiry
- **Approval Workflow**: New users require admin approval
- **Password Security**: SHA-256 hashing (note: production should use more secure methods)

### 5. Integration Points

- **Ollama API**: For connecting to local AI models
- **Document Processing Pipeline**: For PDF parsing and document processing

## Data Flow

1. **User Authentication**:
   ```
   User -> Login Form -> Authentication Service -> IndexedDB -> Session Token -> Protected Routes
   ```

2. **Document Processing**:
   ```
   Upload PDF -> Text Extraction -> Chunking -> Embedding -> Vector Storage -> Query Processing
   ```

3. **Query Flow**:
   ```
   User Query -> Retrieve Relevant Chunks -> Generate AI Prompt -> Ollama API -> Stream Response -> UI
   ```

## Scaling Considerations

### Horizontal Scaling

- **Frontend**: Can be deployed to CDN with multiple edge locations
- **Backend**: Can be containerized and deployed across multiple nodes
- **Database**: Vector databases can be sharded for larger document collections

### Vertical Scaling

- **Memory**: Increase for larger document processing capabilities
- **CPU/GPU**: Enhance for faster model inference
- **Storage**: Expand for larger document collections

## Security Architecture

- **Authentication**: Token-based with proper expiry
- **Authorization**: Role-based access control
- **Data Security**: Client-side encryption for sensitive data
- **API Security**: Rate limiting and input validation

## Deployment Architecture

- **Docker Containers**: For consistent environments
- **Nginx**: As reverse proxy and static file server
- **Network Isolation**: Proper segmentation between components

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Browser)                                          │
│ ┌───────────────┐  ┌────────────────┐  ┌────────────────┐   │
│ │ React/TS/     │  │ Authentication │  │ Document       │   │
│ │ Tailwind      │  │ System (IndexDB)│  │ Viewer/Chat   │   │
│ └───────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend Services                                            │
│ ┌───────────────┐  ┌────────────────┐  ┌────────────────┐   │
│ │ Flask API     │  │ Document       │  │ Ollama AI      │   │
│ │ Server        │  │ Processor      │  │ Integration    │   │
│ └───────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────────────────────────────────────────┐
│ Storage Layer                                               │
│ ┌───────────────┐  ┌────────────────┐  ┌────────────────┐   │
│ │ IndexedDB     │  │ FAISS Vector   │  │ Document       │   │
│ │ (User Data)   │  │ Storage        │  │ File Storage   │   │
│ └───────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

This architecture document provides a high-level overview of the system components and how they interact. Each component is detailed further in specialized documentation files.
