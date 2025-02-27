
# PDF Chatbot Administrator Guide

This guide provides detailed information for administrators on how to install, configure, maintain, and troubleshoot the PDF Chatbot application.

## System Requirements

- **Node.js**: Version 16 or higher
- **Ollama**: Latest version (for model inference)
- **Web Browser**: Chrome, Firefox, Safari, Edge
- **RAM**: 
  - 2GB+ for document processing
  - Additional RAM depends on the Ollama model size (4-16GB recommended)
- **Disk Space**: 
  - ~100MB for the application
  - 1-15GB for Ollama models (depends on models used)

## Installation

### 1. Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/) (version 16 or higher).

### 2. Install Ollama

Follow the installation instructions for your platform at [ollama.ai](https://ollama.ai).

### 3. Pull Ollama Models

Open a terminal and pull at least one model:

```bash
# Pull a small model for testing
ollama pull tinyllama

# Pull a more capable model for production
ollama pull llama3

# Pull a larger model for better quality
ollama pull llama3:8b
```

### 4. Clone and Set Up the Application

```bash
# Clone the repository
git clone https://github.com/yourusername/pdf-chatbot.git
cd pdf-chatbot

# Install dependencies
npm install

# Start the development server
npm run dev

# For production build
npm run build
```

### 5. Serving in Production

For production deployment, build the application and serve it using a static file server:

```bash
# Build the application
npm run build

# Serve using a static file server (example with serve)
npx serve -s dist
```

Alternatively, you can use nginx, Apache, or any other static file server.

## Configuration

### Environment Configuration

The application doesn't require environment variables by default, but you can configure the Ollama endpoint by modifying the `baseUrl` in `src/lib/documentProcessor.ts`:

```typescript
const llm = new Ollama({
  model: modelName,
  baseUrl: "http://your-ollama-server:11434" // Default is http://localhost:11434
});
```

### Model Configuration

You can adjust the following parameters in `src/lib/documentProcessor.ts`:

- **Chunk Size**: Controls how documents are split (default: 500)
- **Chunk Overlap**: Controls overlap between chunks (default: 50)
- **Embedding Model**: The SentenceTransformer model used (default: "all-MiniLM-L6-v2")

```typescript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,  // Adjust this value
  chunkOverlap: 50 // Adjust this value
});

const embeddings = new SentenceTransformerEmbeddings({
  modelName: "all-MiniLM-L6-v2" // You can change this to another compatible model
});
```

## Monitoring and Maintenance

### Monitoring Ollama

You can check the status of Ollama:

```bash
# Check if Ollama is running
ps aux | grep ollama

# Check available models
ollama list
```

### Log Files

The application logs errors to the browser console. For Ollama logs, check:

- Linux/macOS: `/var/log/ollama.log` or use `journalctl -u ollama`
- Windows: Event Viewer or the Ollama installation directory

### Backup and Restore

Backup the following:

1. Ollama models: typically in `~/.ollama/models/`
2. Application code and configuration

### Updates

Keep the following updated:

1. Ollama: Update regularly for security and performance improvements
2. Node.js: Keep at a supported version
3. Application: Pull the latest code and rebuild

## Troubleshooting

### Common Issues

#### No Models Available

**Symptoms**: The model dropdown is empty or shows an error.

**Solution**:
1. Ensure Ollama is running: `ollama serve`
2. Check if models are installed: `ollama list`
3. Pull a model if none are available: `ollama pull llama3`
4. Check network connectivity to Ollama (default: http://localhost:11434)

#### PDF Processing Errors

**Symptoms**: Error message when uploading a PDF.

**Solution**:
1. Check if the PDF is corrupted or password-protected
2. Try with a smaller or simpler PDF
3. Check browser console for detailed error messages
4. Ensure sufficient memory is available

#### Slow Response Times

**Symptoms**: Long waiting times for responses.

**Solution**:
1. Use a smaller or more efficient model
2. Reduce document chunk size
3. Ensure the machine has adequate resources
4. Close other resource-intensive applications

#### Out of Memory Errors

**Symptoms**: Application crashes or Ollama fails.

**Solution**:
1. Use a smaller model
2. Process smaller documents
3. Increase system swap space
4. Add more RAM to the system

### Advanced Troubleshooting

#### Network Issues

If the application can't connect to Ollama:

1. Verify Ollama is running: `curl http://localhost:11434/api/tags`
2. Check firewall settings
3. Ensure correct URL is configured in the application

#### Model Loading Issues

If models fail to load:

1. Check Ollama logs for errors
2. Verify model files exist and are not corrupted
3. Re-pull the model: `ollama pull modelname`

## Security Considerations

### Data Privacy

- All document processing occurs locally in the browser and through local Ollama API calls
- No data is sent to external servers
- Be careful when processing sensitive documents

### Network Security

- By default, Ollama binds to localhost only
- If exposing Ollama to other machines, use appropriate network security measures
- Consider using a VPN or SSH tunnel for remote access

### Access Control

- The application does not include authentication by default
- If deploying for multiple users, consider adding authentication or access controls at the web server level

## Performance Optimization

### Ollama Configuration

Adjust Ollama parameters for better performance:

```bash
# Run with specific GPU parameters
CUDA_VISIBLE_DEVICES=0 ollama serve

# Set thread count
OLLAMA_NUM_THREADS=4 ollama serve
```

### Document Processing

For optimal document processing:

1. Use smaller chunk sizes for faster processing (300-500)
2. Use larger chunk sizes for better context (1000-1500)
3. Adjust overlap based on document type (10% of chunk size is a good starting point)

### Hardware Recommendations

- **CPU**: 4+ cores recommended
- **RAM**: 16GB+ for larger models
- **GPU**: Optional but helpful for larger models
- **Disk**: SSD recommended for faster model loading

## Contact and Support

For support, please:

1. Check the documentation
2. Look for existing issues on GitHub
3. Open a new issue if needed
4. Contact the maintainers directly for urgent matters

---

This guide is maintained by the PDF Chatbot team. Last updated: [Current Date].
