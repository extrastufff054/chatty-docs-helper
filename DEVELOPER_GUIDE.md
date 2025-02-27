
# PDF Chatbot Developer Guide

This guide provides technical information for developers who want to understand, extend, or modify the PDF Chatbot application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Code Structure](#code-structure)
4. [Technology Stack](#technology-stack)
5. [Development Setup](#development-setup)
6. [Key Workflows](#key-workflows)
7. [Customization Guide](#customization-guide)
8. [API Documentation](#api-documentation)
9. [Testing](#testing)
10. [Performance Considerations](#performance-considerations)
11. [Contributing Guidelines](#contributing-guidelines)

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

## Customization Guide

### Prompt Template

You can customize the prompt template in `documentProcessor.ts` to change how the AI responds to questions:

```typescript
// Modify this prompt template to customize the AI behavior
const customPromptTemplate = new PromptTemplate({
  inputVariables: ["context", "question"],
  template: `You are a helpful assistant that carefully analyzes the entire document to generate a coherent, comprehensive answer.
Given the following document excerpts and a question, synthesize a well-rounded answer that provides full context and continuity.
Do not simply return isolated fragments; instead, integrate the information into a unified, context-rich response.

Document Excerpts:
{context}

Question: {question}
Answer:`
});
```

### Document Processing Parameters

Adjust these parameters in `documentProcessor.ts` to change how documents are processed:

```typescript
// Increase or decrease chunk size based on your needs
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,  // Smaller for faster processing, larger for better context
  chunkOverlap: 50 // Adjust overlap for better continuity between chunks
});

// Change embedding model if needed
const embeddings = new SentenceTransformerEmbeddings({
  modelName: "all-MiniLM-L6-v2" // Can be changed to other compatible models
});
```

### UI Customization

The UI can be customized by modifying the components in the `components` directory and the main page in `pages/Index.tsx`. The application uses Tailwind CSS for styling.

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
