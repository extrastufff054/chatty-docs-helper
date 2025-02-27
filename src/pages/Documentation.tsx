
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, AlertTriangle, Info, Terminal, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  return (
    <div className="container py-10 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to="/">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">PDF Chatbot Documentation</h1>
      </div>
      
      <Tabs defaultValue="user">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>User Guide</span>
          </TabsTrigger>
          <TabsTrigger value="developer" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span>Developer Guide</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin Guide</span>
          </TabsTrigger>
        </TabsList>
        
        {/* User Guide */}
        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>How to use the PDF chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Welcome to the PDF Chatbot</h3>
              <p>This application allows you to upload a PDF document and ask questions about its content. The chatbot uses local AI models through Ollama to generate responses based on the content of your document.</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Step 1: Select an AI model</h4>
                <p>Select one of the available Ollama models from the sidebar. If no models are shown, you'll need to install Ollama and download at least one model.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Step 2: Upload a PDF document</h4>
                <p>Click on the upload area or drag and drop a PDF file into it. The system will process the document, which may take a few moments depending on the size.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Step 3: Ask questions</h4>
                <p>Once the document is processed, you can type your questions in the input field at the bottom of the chat area and press Enter or click the Send button.</p>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>For best results, ask specific questions related to the content of your document.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Features & Limitations</CardTitle>
              <CardDescription>What you can do with the PDF chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Features</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Upload and analyze PDF documents</li>
                  <li>Use different Ollama models for different use cases</li>
                  <li>Ask multiple questions about the same document</li>
                  <li>Get comprehensive answers based on document content</li>
                  <li>Real-time streaming of responses</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Limitations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Only PDF documents are supported</li>
                  <li>Performance depends on the selected Ollama model</li>
                  <li>Very large documents might be processed slower</li>
                  <li>Requires Ollama to be installed and running locally</li>
                  <li>No chat history persistence between sessions</li>
                </ul>
              </div>
              
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This application processes documents locally and does not send your data to external servers.
                  However, the quality of responses depends on the AI model you select.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Developer Guide */}
        <TabsContent value="developer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>Technical overview of the PDF chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The PDF chatbot is built using React for the frontend and LangChain for document processing and QA capabilities. The application runs entirely in the browser and communicates with a local Ollama instance for AI model inference.</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Key Components</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Frontend:</strong> React, Tailwind CSS, shadcn/ui</li>
                  <li><strong>Document Processing:</strong> LangChain, pdf-parse</li>
                  <li><strong>Embeddings:</strong> SentenceTransformerEmbeddings</li>
                  <li><strong>Vector Store:</strong> FAISS (Facebook AI Similarity Search)</li>
                  <li><strong>LLM Interface:</strong> Ollama API</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Data Flow</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>User uploads a PDF document</li>
                  <li>Document is loaded and parsed using pdf-parse</li>
                  <li>Text is split into chunks using RecursiveCharacterTextSplitter</li>
                  <li>Chunks are embedded using SentenceTransformerEmbeddings</li>
                  <li>Embeddings are stored in a FAISS vector store</li>
                  <li>User queries are processed against the vector store</li>
                  <li>Relevant document chunks are retrieved and sent to the Ollama model</li>
                  <li>Model generates a response which is streamed back to the UI</li>
                </ol>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Development Setup</AlertTitle>
                <AlertDescription>
                  Make sure you have Node.js 16+ and Ollama installed on your development machine.
                  Run <code className="bg-muted px-1 py-0.5 rounded">npm install</code> to install dependencies and <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code> to start the development server.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API & Customization</CardTitle>
              <CardDescription>How to extend and customize the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Key Files</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code className="bg-muted px-1 py-0.5 rounded">src/lib/documentProcessor.ts</code> - Core document processing and QA logic</li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">src/pages/Index.tsx</code> - Main application UI</li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">src/components/ChatMessage.tsx</code> - Chat message component</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Customizing the Prompt Template</h4>
                <p>You can modify the prompt template in <code className="bg-muted px-1 py-0.5 rounded">documentProcessor.ts</code> to change how the AI responds to questions:</p>
                <pre className="bg-muted p-2 rounded overflow-x-auto">
                  {`const customPromptTemplate = new PromptTemplate({
  inputVariables: ["context", "question"],
  template: \`Your custom prompt here...\`
});`}
                </pre>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Extending with New Features</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Multiple Document Support:</strong> Modify the UI to allow multiple documents and update the vector store logic</li>
                  <li><strong>Additional File Types:</strong> Add support for other document types by implementing appropriate loaders</li>
                  <li><strong>Persistence:</strong> Implement IndexedDB storage for saving processed documents and chat history</li>
                  <li><strong>Custom Embedding Models:</strong> Replace the default embedding model with alternatives</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Admin Guide */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation & Requirements</CardTitle>
              <CardDescription>How to set up the PDF chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">System Requirements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Node.js 16 or higher</li>
                  <li>Ollama installed and running (for model inference)</li>
                  <li>At least one Ollama model downloaded</li>
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>2GB+ RAM for document processing</li>
                  <li>Additional RAM requirements depend on the Ollama model size</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Installation Steps</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Clone the repository: <code className="bg-muted px-1 py-0.5 rounded">git clone https://github.com/yourusername/pdf-chatbot.git</code></li>
                  <li>Install dependencies: <code className="bg-muted px-1 py-0.5 rounded">npm install</code></li>
                  <li>Install Ollama: <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://ollama.ai</a></li>
                  <li>Pull at least one model: <code className="bg-muted px-1 py-0.5 rounded">ollama pull llama3</code></li>
                  <li>Start the application: <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code></li>
                </ol>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Production Deployment</AlertTitle>
                <AlertDescription>
                  For production, build the application with <code className="bg-muted px-1 py-0.5 rounded">npm run build</code> and serve it using a static file server.
                  Ensure Ollama is properly set up and accessible from the client machine.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting & Maintenance</CardTitle>
              <CardDescription>Common issues and how to resolve them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Common Issues</h4>
                
                <div className="space-y-1">
                  <h5 className="font-medium">No models available</h5>
                  <p><strong>Solution:</strong> Ensure Ollama is running and you have pulled at least one model using <code className="bg-muted px-1 py-0.5 rounded">ollama pull modelname</code>.</p>
                </div>
                
                <div className="space-y-1">
                  <h5 className="font-medium">Error processing document</h5>
                  <p><strong>Solution:</strong> Check if the PDF is valid and not encrypted. Try with a smaller or simpler PDF first.</p>
                </div>
                
                <div className="space-y-1">
                  <h5 className="font-medium">Connection errors with Ollama</h5>
                  <p><strong>Solution:</strong> Verify Ollama is running with <code className="bg-muted px-1 py-0.5 rounded">ollama serve</code> and check if it's accessible at http://localhost:11434.</p>
                </div>
                
                <div className="space-y-1">
                  <h5 className="font-medium">Out of memory errors</h5>
                  <p><strong>Solution:</strong> Try with a smaller model or reduce the chunk size in the document processor configuration.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Performance Optimization</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use smaller and more efficient models for faster responses</li>
                  <li>Adjust chunk size and overlap in the document processor for better retrieval quality</li>
                  <li>Consider using a dedicated machine for running Ollama models</li>
                  <li>For large documents, consider pre-processing and storing embeddings</li>
                </ul>
              </div>
              
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Security Considerations</AlertTitle>
                <AlertDescription>
                  This application processes documents locally, but be aware that the content is sent to the Ollama API.
                  Ensure Ollama is properly secured and only accessible by authorized users.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
