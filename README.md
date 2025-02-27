
# PDF Chatbot

A React-based PDF chatbot with Python backend that allows users to upload PDFs and ask questions about their content using local Ollama AI models.

## Features

- Upload and process PDF documents
- Chat interface with streaming responses
- Integration with Ollama for local AI model inference
- Multiple model support
- Dark/light mode support
- Responsive design

## Architecture

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, LangChain
- **AI Models**: Ollama (local models)

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
docker build -t pdf-chatbot-backend .
docker run -p 5000:5000 --name pdf-chatbot-backend pdf-chatbot-backend
```

## Usage

1. Select an Ollama model from the sidebar
2. Upload a PDF document
3. Wait for the document to be processed
4. Type your questions in the chat input and press Enter

## How It Works

1. PDF documents are uploaded to the Python backend
2. Text is split into chunks and embedded using sentence transformers
3. Embeddings are stored in a FAISS vector store
4. User queries are processed against the vector store to find relevant chunks
5. Relevant chunks and the query are sent to the Ollama model
6. Model responses are streamed back to the UI

## Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Python
- Flask
- LangChain
- FAISS
- Ollama
- PyPDF

## Documentation

The application includes built-in documentation accessible at `/documentation`, with separate sections for:

- **User Guide**: How to use the application
- **Developer Guide**: Technical details and customization
- **Admin Guide**: Installation, troubleshooting, and maintenance

## License

MIT
