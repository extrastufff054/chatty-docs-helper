
# Indian Cybercrime Coordination Centre (I4C) Chatbot

A React-based PDF chatbot with Python backend that allows users to upload PDFs and ask questions about their content using local Ollama AI models.

## Features

- Upload and process PDF documents
- Chat interface with streaming responses
- Integration with Ollama for local AI model inference
- Multiple model support
- Dark/light mode support
- Responsive design
- Chat history management
- Customizable AI behavior with system prompts

## Architecture

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, LangChain
- **AI Models**: Ollama (local models)
- **Vector Database**: FAISS for semantic search

## Requirements

- Node.js 16+
- Python 3.9+
- Ollama installed and running locally
- At least one Ollama model downloaded

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python app.py
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
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

## Docker Setup (Optional)

To run the backend in Docker:

```bash
docker build -t i4c-chatbot-backend .
docker run -p 5000:5000 --name i4c-chatbot-backend i4c-chatbot-backend
```

## Usage

1. Select an Ollama model from the sidebar
2. Upload a PDF document through the admin interface
3. Wait for the document to be processed
4. Select the document from the sidebar to start a new chat
5. Type your questions in the chat input and press Enter
6. Navigate between different chats using the chat history sidebar

## How It Works

1. PDF documents are uploaded to the Python backend
2. Text is split into chunks and embedded using sentence transformers
3. Embeddings are stored in a FAISS vector store
4. User queries are processed against the vector store to find relevant chunks
5. Relevant chunks and the query are sent to the Ollama model
6. Model responses are streamed back to the UI

## Developer Guide

### Project Structure

```
/
├── frontend/               # React frontend application
│   ├── src/                
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and helpers
│   │   ├── pages/          # Main application pages
│   │   └── contexts/       # React context providers
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
└── README.md               # Project documentation
```

### Key Technologies

- **Frontend**
  - React 18 with Hooks
  - TypeScript for type safety
  - Tailwind CSS for styling
  - shadcn/ui component library
  - React Router for routing
  - Vite for fast development

- **Backend**
  - Flask for API endpoints
  - LangChain for LLM integration
  - FAISS for vector similarity search
  - PyPDF for document parsing
  - Ollama for running local AI models

### Local Development

To set up the project for local development:

1. Clone the repository
2. Set up the backend (see Backend Setup)
3. Set up the frontend (see Frontend Setup)
4. Make changes to the code
5. Run tests to ensure functionality

## Server Configuration

The server can be configured through environment variables:

- `FLASK_ENV`: Set to "development" or "production"
- `PORT`: Server port (default: 5000)
- `ADMIN_TOKEN`: Secret token for admin authentication
- `OLLAMA_BASE_URL`: URL for Ollama API (default: http://localhost:11434)
- `STORAGE_PATH`: Directory for storing uploads and vector databases

## Contribution Guide

We welcome contributions to the I4C Chatbot project! To contribute:

1. Fork the repository
2. Create a new branch for your feature or fix
3. Make your changes
4. Run tests to ensure functionality
5. Submit a pull request

Please follow these guidelines:
- Write clean, readable code
- Include comments for complex logic
- Update documentation for new features
- Follow existing code style and patterns

## License

MIT
