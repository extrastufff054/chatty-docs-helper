
# API Reference

This document provides detailed information about the API endpoints available in the I4C Chatbot system, including request/response formats, authentication requirements, and example usage.

## API Overview

The I4C Chatbot exposes several API endpoints categorized into the following groups:

1. **Authentication APIs**: User login, logout, and session management
2. **Document Management APIs**: Upload, retrieve, and delete documents
3. **Query APIs**: Process questions against documents
4. **User Management APIs**: Create, update, and manage users
5. **System Management APIs**: Configuration and system status

## Base URL

All API endpoints are relative to the base URL of your deployment:

```
https://your-deployment-domain.com/api
```

For local development:

```
http://localhost:5000/api
```

## Authentication

Most API endpoints require authentication using a Bearer token:

```
Authorization: Bearer <session-token>
```

The session token is obtained from the `/auth/login` endpoint.

## API Endpoints

### Authentication APIs

#### Login

Authenticates a user and returns a session token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "session": {
    "token": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "approved": true
    },
    "expiresAt": "2023-08-01T00:00:00.000Z"
  }
}
```

**Error Response**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Validate Session

Validates an existing session token.

- **URL**: `/auth/validate`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "valid": true,
  "session": {
    "token": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "approved": true
    },
    "expiresAt": "2023-08-01T00:00:00.000Z"
  }
}
```

**Error Response**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "valid": false
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/auth/validate \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Logout

Invalidates a session token.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Signup

Registers a new user.

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Auth Required**: No
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securePassword123!"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "success": true
}
```

**Error Response**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "success": false,
  "error": "Username already exists"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"newuser@example.com","password":"securePassword123!"}'
```

### Document Management APIs

#### Upload Document

Uploads a new document.

- **URL**: `/documents/upload`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: The document file (PDF)
- `title` (optional): Document title
- `description` (optional): Document description

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "success": true,
  "documentId": "doc-123",
  "title": "Sample Document",
  "filename": "sample.pdf"
}
```

**Error Response**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "success": false,
  "error": "Invalid file format"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851" \
  -F "file=@sample.pdf" \
  -F "title=Sample Document" \
  -F "description=A sample document for testing"
```

#### List Documents

Retrieves a list of all documents.

- **URL**: `/documents`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "documents": [
    {
      "id": "doc-123",
      "title": "Sample Document",
      "filename": "sample.pdf",
      "description": "A sample document for testing",
      "uploadedBy": "admin",
      "uploadedAt": "2023-07-15T10:30:00.000Z",
      "size": 1024000
    },
    // ... more documents
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Get Document

Retrieves a specific document by ID.

- **URL**: `/documents/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

**URL Parameters**:
- `id`: Document ID

**Success Response**:
- **Code**: 200 OK
- **Content**: The document file

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Document not found"
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/documents/doc-123 \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851" \
  -o downloaded_document.pdf
```

#### Delete Document

Deletes a document by ID.

- **URL**: `/documents/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)

**URL Parameters**:
- `id`: Document ID

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true
}
```

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Document not found"
}
```

**Example**:
```bash
curl -X DELETE http://localhost:5000/api/documents/doc-123 \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

### Query APIs

#### Process Query

Processes a query against a document.

- **URL**: `/query`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "documentId": "doc-123",
  "query": "What is the main topic of this document?",
  "model": "llama3",
  "systemPromptId": "default"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content** (for non-streaming):
```json
{
  "answer": "The main topic of this document is cybersecurity best practices for government agencies.",
  "sources": [
    {
      "page": 1,
      "text": "This document outlines cybersecurity best practices for government agencies..."
    }
  ]
}
```

**For streaming responses**:
The response will be a stream of server-sent events (SSE) with partial responses.

**Error Response**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Document not found"
}
```

**Example (non-streaming)**:
```bash
curl -X POST http://localhost:5000/api/query \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851" \
  -H "Content-Type: application/json" \
  -d '{"documentId":"doc-123","query":"What is the main topic of this document?","model":"llama3","systemPromptId":"default"}'
```

#### Query with Streaming

Processes a query with streaming response.

- **URL**: `/query/stream`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Content-Type**: `application/json`

**Request Body**: Same as `/query`

**Success Response**:
- **Code**: 200 OK
- **Content-Type**: `text/event-stream`
- **Content**: Stream of events with the format:

```
data: {"token": "The"}

data: {"token": " main"}

data: {"token": " topic"}

// ... more tokens

data: [DONE]
```

**Example (curl with streaming)**:
```bash
curl -X POST http://localhost:5000/api/query/stream \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851" \
  -H "Content-Type: application/json" \
  -d '{"documentId":"doc-123","query":"What is the main topic of this document?","model":"llama3","systemPromptId":"default"}' \
  --no-buffer
```

### User Management APIs

#### List Users

Retrieves a list of all users.

- **URL**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Admin role)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "users": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "approved": true,
      "createdAt": "2023-07-01T00:00:00.000Z"
    },
    // ... more users
  ]
}
```

**Error Response**:
- **Code**: 403 Forbidden
- **Content**:
```json
{
  "error": "Insufficient permissions"
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Get User

Retrieves a specific user by ID.

- **URL**: `/users/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Admin role or own user)

**URL Parameters**:
- `id`: User ID

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "id": "1",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "approved": true,
  "createdAt": "2023-07-01T00:00:00.000Z"
}
```

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "User not found"
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Approve User

Approves a user account.

- **URL**: `/users/:id/approve`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token, Admin role)

**URL Parameters**:
- `id`: User ID

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "user": {
    "id": "2",
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "user",
    "approved": true,
    "createdAt": "2023-07-15T00:00:00.000Z"
  }
}
```

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "User not found"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/users/2/approve \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Update User Role

Updates a user's role.

- **URL**: `/users/:id/role`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token, Admin role)
- **Content-Type**: `application/json`

**URL Parameters**:
- `id`: User ID

**Request Body**:
```json
{
  "role": "moderator"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "user": {
    "id": "2",
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "moderator",
    "approved": true,
    "createdAt": "2023-07-15T00:00:00.000Z"
  }
}
```

**Error Response**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Invalid role"
}
```

**Example**:
```bash
curl -X PUT http://localhost:5000/api/users/2/role \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851" \
  -H "Content-Type: application/json" \
  -d '{"role":"moderator"}'
```

#### Delete User

Deletes a user.

- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token, Admin role)

**URL Parameters**:
- `id`: User ID

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true
}
```

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "User not found"
}
```

**Example**:
```bash
curl -X DELETE http://localhost:5000/api/users/2 \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

### System Management APIs

#### Get Ollama Models

Retrieves available Ollama models.

- **URL**: `/models`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "models": ["llama3", "phi", "mistral", "gemma", "llama3:8b"]
}
```

**Error Response**:
- **Code**: 503 Service Unavailable
- **Content**:
```json
{
  "error": "Ollama service unavailable"
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/models \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Get System Prompts

Retrieves available system prompts.

- **URL**: `/system-prompts`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "prompts": [
    {
      "id": "default",
      "name": "Default Prompt",
      "template": "You are a helpful assistant analyzing the document... {context}... Question: {question}"
    },
    // ... more prompts
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/system-prompts \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851"
```

#### Create System Prompt

Creates a new system prompt.

- **URL**: `/system-prompts`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token, Admin role)
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "Concise Prompt",
  "template": "Answer briefly based on this context: {context}\nQuestion: {question}\nKeep your answer short and to the point."
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "success": true,
  "prompt": {
    "id": "prompt-123",
    "name": "Concise Prompt",
    "template": "Answer briefly based on this context: {context}\nQuestion: {question}\nKeep your answer short and to the point."
  }
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/system-prompts \
  -H "Authorization: Bearer d290f1ee-6c54-4b01-90e6-d701748f0851" \
  -H "Content-Type: application/json" \
  -d '{"name":"Concise Prompt","template":"Answer briefly based on this context: {context}\nQuestion: {question}\nKeep your answer short and to the point."}'
```

#### Health Check

Checks the health status of the system.

- **URL**: `/health`
- **Method**: `GET`
- **Auth Required**: No

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "status": "ok",
  "services": {
    "ollama": "ok",
    "database": "ok"
  },
  "version": "1.0.0"
}
```

**Error Response**:
- **Code**: 503 Service Unavailable
- **Content**:
```json
{
  "status": "degraded",
  "services": {
    "ollama": "error",
    "database": "ok"
  },
  "version": "1.0.0"
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/health
```

## Error Codes and Handling

The API uses standard HTTP status codes to indicate the success or failure of a request:

- **200 OK**: The request was successful
- **201 Created**: A new resource was successfully created
- **400 Bad Request**: The request was malformed or contained invalid parameters
- **401 Unauthorized**: Authentication failed or was not provided
- **403 Forbidden**: The authenticated user lacks permission for the requested operation
- **404 Not Found**: The requested resource was not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: An unexpected error occurred on the server
- **503 Service Unavailable**: A required service (e.g., Ollama) is unavailable

All error responses follow a consistent format:

```json
{
  "error": "Human-readable error message",
  "details": { "additional": "error details" }  // Optional
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Authentication endpoints: 10 requests per minute per IP
- Query endpoints: 60 requests per minute per user
- Document upload: 10 uploads per hour per user

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1626283200
```

When a rate limit is exceeded, the API responds with a 429 status code and includes a `Retry-After` header indicating when the client can retry.

## Versioning

The API version is specified in the URL path:

```
http://localhost:5000/api/v1/documents
```

If no version is specified, the latest version is used.

## Webhooks

The system can send webhook notifications for certain events:

- Document processing completion
- User approval status change
- System status changes

Webhook configuration is available through the admin interface.

## Client Libraries

### JavaScript/TypeScript

```typescript
// Example TypeScript client for the I4C Chatbot API

class I4CChatbotClient {
  private baseUrl: string;
  private token: string | null = null;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
  
  // Authentication
  async login(username: string, password: string): Promise<{ success: boolean; token?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success && data.session) {
        this.token = data.session.token;
        return { success: true, token: this.token };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  }
  
  // Document upload
  async uploadDocument(file: File, title?: string, description?: string): Promise<{ success: boolean; documentId?: string }> {
    if (!this.token) {
      return { success: false };
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      
      const response = await fetch(`${this.baseUrl}/api/documents/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` },
        body: formData
      });
      
      const data = await response.json();
      return {
        success: data.success,
        documentId: data.documentId
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false };
    }
  }
  
  // Query processing with streaming
  async queryWithStreaming(documentId: string, query: string, model: string, callback: (token: string) => void): Promise<boolean> {
    if (!this.token) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/api/query/stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ documentId, query, model })
      });
      
      const reader = response.body?.getReader();
      if (!reader) return false;
      
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const content = line.slice(5).trim();
            if (content === '[DONE]') {
              return true;
            }
            
            try {
              const parsed = JSON.parse(content);
              if (parsed.token) {
                callback(parsed.token);
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Query error:', error);
      return false;
    }
  }
  
  // More methods for other API endpoints...
}
```

### Python

```python
# Example Python client for the I4C Chatbot API

import requests
import json
import sseclient
from typing import Dict, List, Optional, Callable, Any

class I4CChatbotClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.token = None
    
    def login(self, username: str, password: str) -> Dict[str, Any]:
        """Login and get session token"""
        try:
            response = requests.post(
                f"{self.base_url}/api/auth/login",
                json={"username": username, "password": password}
            )
            data = response.json()
            
            if data.get("success") and data.get("session"):
                self.token = data["session"]["token"]
                return {"success": True, "token": self.token}
            
            return {"success": False}
        except Exception as e:
            print(f"Login error: {e}")
            return {"success": False}
    
    def get_documents(self) -> List[Dict[str, Any]]:
        """Get list of documents"""
        if not self.token:
            return []
        
        try:
            response = requests.get(
                f"{self.base_url}/api/documents",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            data = response.json()
            return data.get("documents", [])
        except Exception as e:
            print(f"Error getting documents: {e}")
            return []
    
    def upload_document(self, file_path: str, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
        """Upload a document"""
        if not self.token:
            return {"success": False}
        
        try:
            files = {"file": open(file_path, "rb")}
            data = {}
            if title:
                data["title"] = title
            if description:
                data["description"] = description
            
            response = requests.post(
                f"{self.base_url}/api/documents/upload",
                headers={"Authorization": f"Bearer {self.token}"},
                files=files,
                data=data
            )
            
            return response.json()
        except Exception as e:
            print(f"Upload error: {e}")
            return {"success": False}
    
    def query_with_streaming(self, document_id: str, query: str, model: str, callback: Callable[[str], None]) -> bool:
        """Process query with streaming response"""
        if not self.token:
            return False
        
        try:
            response = requests.post(
                f"{self.base_url}/api/query/stream",
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json",
                    "Accept": "text/event-stream"
                },
                json={"documentId": document_id, "query": query, "model": model},
                stream=True
            )
            
            client = sseclient.SSEClient(response)
            for event in client.events():
                if event.data == "[DONE]":
                    return True
                
                try:
                    data = json.loads(event.data)
                    if "token" in data:
                        callback(data["token"])
                except Exception as e:
                    print(f"Error parsing SSE: {e}")
            
            return True
        except Exception as e:
            print(f"Query error: {e}")
            return False
    
    # More methods for other API endpoints...
```

This API Reference document provides comprehensive information about the available API endpoints, their request/response formats, and example client implementations for working with the I4C Chatbot system.
