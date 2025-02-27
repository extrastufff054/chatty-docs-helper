
# PDF Chatbot

A React-based PDF chatbot that allows users to upload PDFs and ask questions about their content using local Ollama AI models.

## Features

- Upload and process PDF documents
- Chat interface with streaming responses
- Integration with Ollama for local AI model inference
- Multiple model support
- Dark/light mode support
- Responsive design

## Requirements

- Node.js 16+
- Ollama installed and running locally
- At least one Ollama model downloaded

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-chatbot.git
cd pdf-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Install Ollama from [ollama.ai](https://ollama.ai)

4. Pull at least one model:
```bash
ollama pull llama3
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Select an Ollama model from the sidebar
2. Upload a PDF document
3. Wait for the document to be processed
4. Type your questions in the chat input and press Enter

## How It Works

1. PDF documents are loaded and parsed in the browser
2. Text is split into chunks and embedded using sentence transformers
3. Embeddings are stored in a FAISS vector store
4. User queries are processed against the vector store to find relevant chunks
5. Relevant chunks and the query are sent to the Ollama model
6. Model responses are streamed back to the UI

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- LangChain
- FAISS
- Ollama
- pdf-parse
- SentenceTransformer

## Architecture

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

## Documentation

The application includes built-in documentation accessible at `/documentation`, with separate sections for:

- **User Guide**: How to use the application
- **Developer Guide**: Technical details and customization
- **Admin Guide**: Installation, troubleshooting, and maintenance

## Customization

You can customize the application by:

- Modifying the prompt template in `src/lib/documentProcessor.ts`
- Adjusting the chunk size and overlap for document processing
- Adding support for additional file types
- Implementing persistence for chat history and processed documents

## License

MIT

## Acknowledgements

- [LangChain](https://js.langchain.com) for document processing and QA capabilities
- [Ollama](https://ollama.ai) for local AI model inference
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) for PDF parsing
