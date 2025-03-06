
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Book, Cpu, FileText, Settings, Users, MessageCircle, Server, Code, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Documentation Page
 * 
 * Comprehensive documentation for the I4C Chatbot system
 */
const Documentation = () => {
  const [activeSection, setActiveSection] = useState("overview");
  
  return (
    <div className="container mx-auto py-8 space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
            alt="I4C Logo" 
            className="app-logo h-20 w-auto mr-2"
          />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            I4C Chatbot Documentation
          </h1>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Link to="/">
            <Button variant="outline" className="hover-scale">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="h-[calc(100vh-200px)] md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="mr-2 h-5 w-5" />
              Documentation
            </CardTitle>
            <CardDescription>
              Explore the I4C Chatbot system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              <Button 
                variant={activeSection === "overview" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("overview")}
              >
                <Info className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button 
                variant={activeSection === "user-guide" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("user-guide")}
              >
                <Users className="mr-2 h-4 w-4" />
                User Guide
              </Button>
              <Button 
                variant={activeSection === "admin-guide" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("admin-guide")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Guide
              </Button>
              <Button 
                variant={activeSection === "api" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("api")}
              >
                <Server className="mr-2 h-4 w-4" />
                API Reference
              </Button>
              <Button 
                variant={activeSection === "models" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("models")}
              >
                <Cpu className="mr-2 h-4 w-4" />
                AI Models
              </Button>
              <Button 
                variant={activeSection === "prompts" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("prompts")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                System Prompts
              </Button>
              <Button 
                variant={activeSection === "documents" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("documents")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Document Processing
              </Button>
              <Button 
                variant={activeSection === "technical" ? "default" : "ghost"} 
                className="justify-start rounded-none"
                onClick={() => setActiveSection("technical")}
              >
                <Code className="mr-2 h-4 w-4" />
                Technical Details
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Content Area */}
        <Card className="h-[calc(100vh-200px)] md:col-span-3">
          <CardHeader>
            <CardTitle>
              {activeSection === "overview" && "I4C Chatbot Overview"}
              {activeSection === "user-guide" && "User Guide"}
              {activeSection === "admin-guide" && "Administrator Guide"}
              {activeSection === "api" && "API Reference"}
              {activeSection === "models" && "AI Models"}
              {activeSection === "prompts" && "System Prompts"}
              {activeSection === "documents" && "Document Processing"}
              {activeSection === "technical" && "Technical Details"}
            </CardTitle>
            <CardDescription>
              {activeSection === "overview" && "Learn about the I4C Chatbot system and its capabilities"}
              {activeSection === "user-guide" && "How to use the I4C Chatbot system effectively"}
              {activeSection === "admin-guide" && "Administration and management of the I4C Chatbot system"}
              {activeSection === "api" && "Reference for the I4C Chatbot API endpoints"}
              {activeSection === "models" && "Information about supported AI models and their capabilities"}
              {activeSection === "prompts" && "Understanding and customizing system prompts"}
              {activeSection === "documents" && "How documents are processed and queried"}
              {activeSection === "technical" && "Technical architecture and implementation details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
              {/* Overview Section */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">Introduction</h3>
                    <p className="mt-2 text-muted-foreground">
                      The I4C Chatbot is a document-based question answering system that allows users to query information from uploaded documents using natural language. Designed for the Indian Cybercrime Coordination Centre, this system enables efficient retrieval of information from a variety of document formats.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Key Features</h3>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li>Document upload and processing (PDF, Word, Excel)</li>
                      <li>Natural language queries against document content</li>
                      <li>Multiple AI model support through Ollama integration</li>
                      <li>Customizable system prompts for tailored responses</li>
                      <li>Admin interface for document and prompt management</li>
                      <li>Secure authentication system</li>
                      <li>Responsive design for use on any device</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">System Architecture</h3>
                    <p className="mt-2 text-muted-foreground">
                      The I4C Chatbot consists of a React frontend, a Python Flask backend, and an Ollama integration for AI model inference. The system is containerized for easy deployment using Docker and served through Nginx.
                    </p>
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <pre className="text-xs">
{`┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│                 │     │              │     │             │
│  React Frontend ├────►│  Flask API   ├────►│  Ollama AI  │
│                 │     │              │     │             │
└─────────────────┘     └──────────────┘     └─────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │ File Storage │
                        └──────────────┘`}
                      </pre>
                    </div>
                  </section>
                </div>
              )}
              
              {/* User Guide Section */}
              {activeSection === "user-guide" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">Getting Started</h3>
                    <p className="mt-2 text-muted-foreground">
                      The I4C Chatbot interface is designed to be intuitive and easy to use. Follow these steps to start using the system:
                    </p>
                    <ol className="mt-2 space-y-2 list-decimal pl-6">
                      <li>Access the chatbot through your browser at the provided URL</li>
                      <li>From the available documents, select one to query</li>
                      <li>Choose an AI model to process your queries</li>
                      <li>Type your question in the query box and press Enter or click the Send button</li>
                      <li>Review the AI's response, which will include citations from the document</li>
                    </ol>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Asking Effective Questions</h3>
                    <p className="mt-2 text-muted-foreground">
                      To get the best results from the I4C Chatbot, consider these tips for formulating questions:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li>Be specific and clear in your questions</li>
                      <li>Use natural language rather than keywords</li>
                      <li>Ask one question at a time for more focused answers</li>
                      <li>For complex topics, break down questions into simpler parts</li>
                      <li>Include relevant context in your questions when needed</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Understanding Responses</h3>
                    <p className="mt-2 text-muted-foreground">
                      Chatbot responses are generated based on the content of the selected document and include:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>Answer Text:</strong> The AI's response to your query</li>
                      <li><strong>Citations:</strong> References to specific parts of the document</li>
                      <li><strong>Confidence Level:</strong> Indicated by the AI's tone and qualifying statements</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      If the AI doesn't have enough information to answer your question confidently, it will state this clearly rather than providing inaccurate information.
                    </p>
                  </section>
                </div>
              )}
              
              {/* Admin Guide Section */}
              {activeSection === "admin-guide" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">Accessing the Admin Panel</h3>
                    <p className="mt-2 text-muted-foreground">
                      To access the admin panel, navigate to the /admin route and authenticate with your admin token. The admin token is generated automatically on first system startup and can be found in the server logs or by requesting it from the API.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Managing Documents</h3>
                    <p className="mt-2 text-muted-foreground">
                      The Documents tab in the admin panel allows you to:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>Upload Documents:</strong> Add new PDF, Word, or Excel files</li>
                      <li><strong>Select Models:</strong> Choose which AI model to use for processing</li>
                      <li><strong>Add Metadata:</strong> Include title and description for better organization</li>
                      <li><strong>Delete Documents:</strong> Remove documents that are no longer needed</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      Each document is processed to extract text and create embeddings for AI-powered retrieval. This process can take some time for large documents.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">System Prompts Management</h3>
                    <p className="mt-2 text-muted-foreground">
                      The Advanced Settings tab allows you to manage system prompts, which control how the AI generates responses:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>View Existing Prompts:</strong> See all available system prompts</li>
                      <li><strong>Create New Prompts:</strong> Add custom prompt templates</li>
                      <li><strong>Edit Prompts:</strong> Modify existing prompt templates</li>
                      <li><strong>Set Temperature:</strong> Adjust the creativity level of AI responses</li>
                      <li><strong>Use Templates:</strong> Start with pre-defined templates</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      System prompts use special placeholders: {'{context}'} for document content and {'{question}'} for the user's query.
                    </p>
                  </section>
                </div>
              )}
              
              {/* API Reference Section */}
              {activeSection === "api" && (
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="admin-api">
                      <AccordionTrigger>Admin API Endpoints</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">GET /admin/token</h4>
                            <p className="text-sm text-muted-foreground mt-1">Returns the admin token for first-time setup</p>
                            <p className="text-xs font-mono mt-2 p-2 bg-muted rounded-md">Response: {"{ \"token\": \"admin-token\" }"}</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">GET /admin/documents</h4>
                            <p className="text-sm text-muted-foreground mt-1">Returns all uploaded documents</p>
                            <p className="text-xs text-muted-foreground mt-1">Authentication: Bearer Token</p>
                            <p className="text-xs font-mono mt-2 p-2 bg-muted rounded-md">Response: {"{ \"documents\": [...] }"}</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">POST /admin/documents</h4>
                            <p className="text-sm text-muted-foreground mt-1">Upload a new document</p>
                            <p className="text-xs text-muted-foreground mt-1">Authentication: Bearer Token</p>
                            <p className="text-xs text-muted-foreground mt-1">Content-Type: multipart/form-data</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">DELETE /admin/documents/:id</h4>
                            <p className="text-sm text-muted-foreground mt-1">Delete a document by ID</p>
                            <p className="text-xs text-muted-foreground mt-1">Authentication: Bearer Token</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="prompt-api">
                      <AccordionTrigger>System Prompts API</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">GET /admin/system-prompts</h4>
                            <p className="text-sm text-muted-foreground mt-1">Returns all system prompts</p>
                            <p className="text-xs text-muted-foreground mt-1">Authentication: Bearer Token</p>
                            <p className="text-xs font-mono mt-2 p-2 bg-muted rounded-md">Response: {"{ \"prompts\": [...] }"}</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">POST /admin/system-prompts</h4>
                            <p className="text-sm text-muted-foreground mt-1">Create a new system prompt</p>
                            <p className="text-xs text-muted-foreground mt-1">Authentication: Bearer Token</p>
                            <p className="text-xs text-muted-foreground mt-1">Content-Type: application/json</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">PUT /admin/system-prompts/:id</h4>
                            <p className="text-sm text-muted-foreground mt-1">Update a system prompt</p>
                            <p className="text-xs text-muted-foreground mt-1">Authentication: Bearer Token</p>
                            <p className="text-xs text-muted-foreground mt-1">Content-Type: application/json</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">DELETE /admin/system-prompts/:id</h4>
                            <p className="text-sm text-muted-foreground mt-1">Delete a system prompt</p>
                            <p className="text-xs text-muted-foreground mt-1">Authentication: Bearer Token</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="user-api">
                      <AccordionTrigger>User API Endpoints</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">GET /api/documents</h4>
                            <p className="text-sm text-muted-foreground mt-1">Returns all available documents for users</p>
                            <p className="text-xs font-mono mt-2 p-2 bg-muted rounded-md">Response: {"{ \"documents\": [...] }"}</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">GET /api/system-prompts</h4>
                            <p className="text-sm text-muted-foreground mt-1">Returns all available system prompts</p>
                            <p className="text-xs font-mono mt-2 p-2 bg-muted rounded-md">Response: {"{ \"prompts\": [...] }"}</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">POST /api/select-document</h4>
                            <p className="text-sm text-muted-foreground mt-1">Select a document for querying</p>
                            <p className="text-xs text-muted-foreground mt-1">Content-Type: application/json</p>
                            <p className="text-xs font-mono mt-2 p-2 bg-muted rounded-md">Body: {"{ \"document_id\": \"...\", \"model\": \"...\", \"prompt_id\": \"...\", \"temperature\": 0.0 }"}</p>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <h4 className="font-medium">POST /api/query</h4>
                            <p className="text-sm text-muted-foreground mt-1">Process a query against a selected document</p>
                            <p className="text-xs text-muted-foreground mt-1">Content-Type: application/json</p>
                            <p className="text-xs font-mono mt-2 p-2 bg-muted rounded-md">Body: {"{ \"session_id\": \"...\", \"query\": \"...\" }"}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
              
              {/* AI Models Section */}
              {activeSection === "models" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">Supported AI Models</h3>
                    <p className="mt-2 text-muted-foreground">
                      The I4C Chatbot supports any model available through Ollama. Common models include:
                    </p>
                    <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Llama 2</h4>
                        <p className="text-sm text-muted-foreground mt-1">A powerful open-source large language model from Meta AI.</p>
                        <p className="text-xs mt-2"><strong>Strengths:</strong> General knowledge, instruction following, balanced responses</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Mistral</h4>
                        <p className="text-sm text-muted-foreground mt-1">An efficient language model with strong performance.</p>
                        <p className="text-xs mt-2"><strong>Strengths:</strong> Efficiency, technical knowledge, code understanding</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Vicuna</h4>
                        <p className="text-sm text-muted-foreground mt-1">A fine-tuned model based on LLaMA.</p>
                        <p className="text-xs mt-2"><strong>Strengths:</strong> Conversational abilities, precise responses</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Phi-2</h4>
                        <p className="text-sm text-muted-foreground mt-1">A small but capable model from Microsoft.</p>
                        <p className="text-xs mt-2"><strong>Strengths:</strong> Lightweight, good performance on smaller hardware</p>
                      </div>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Model Selection Guidelines</h3>
                    <p className="mt-2 text-muted-foreground">
                      When choosing a model for document processing, consider:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>Document Complexity:</strong> More complex documents benefit from larger models</li>
                      <li><strong>Response Speed:</strong> Smaller models provide faster responses</li>
                      <li><strong>Accuracy Needs:</strong> Larger models typically provide more accurate information</li>
                      <li><strong>Hardware Constraints:</strong> Consider your server's capabilities</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Adding New Models</h3>
                    <p className="mt-2 text-muted-foreground">
                      To add new models to the system:
                    </p>
                    <ol className="mt-2 space-y-2 list-decimal pl-6">
                      <li>Access the server running Ollama</li>
                      <li>Use the Ollama CLI to pull new models: <code>ollama pull model-name</code></li>
                      <li>The model will automatically appear in the admin interface</li>
                    </ol>
                    <p className="mt-2 text-muted-foreground">
                      For more information on available models, visit the <a href="https://ollama.com/library" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Ollama Model Library</a>.
                    </p>
                  </section>
                </div>
              )}
              
              {/* System Prompts Section */}
              {activeSection === "prompts" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">Understanding System Prompts</h3>
                    <p className="mt-2 text-muted-foreground">
                      System prompts are instructions given to the AI that guide how it processes and responds to user queries. They act as the "personality" and behavior guidelines for the AI.
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      In the I4C Chatbot, system prompts contain placeholders for dynamic content:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><code>{"{context}"}</code>: Replaced with relevant document content</li>
                      <li><code>{"{question}"}</code>: Replaced with the user's query</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Default System Prompts</h3>
                    <p className="mt-2 text-muted-foreground">
                      The system comes with pre-configured prompts:
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Default Prompt</h4>
                        <p className="text-sm text-muted-foreground mt-1">A balanced prompt that provides comprehensive answers with citations.</p>
                        <div className="mt-2 p-2 bg-muted rounded-md text-xs font-mono">
                          <p>You are a helpful, respectful and honest assistant. Your task is to answer the user's question based on the provided document content.</p>
                          <p className="mt-1">Document content: {"{context}"}</p>
                          <p className="mt-1">User's question: {"{question}"}</p>
                          <p className="mt-1">Provide a clear, concise answer using only the information from the document. If the document doesn't contain the answer, say "I don't have enough information to answer this question."</p>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Concise Prompt</h4>
                        <p className="text-sm text-muted-foreground mt-1">A prompt that generates shorter, more direct answers.</p>
                        <div className="mt-2 p-2 bg-muted rounded-md text-xs font-mono">
                          <p>Answer the question briefly based on this context: {"{context}"}</p>
                          <p className="mt-1">Question: {"{question}"}</p>
                          <p className="mt-1">Keep your answer short and to the point. Only use information from the context provided.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Creating Effective Prompts</h3>
                    <p className="mt-2 text-muted-foreground">
                      Guidelines for creating effective system prompts:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>Be Specific:</strong> Clearly define the AI's role and response style</li>
                      <li><strong>Include Constraints:</strong> Specify if answers should only come from the document</li>
                      <li><strong>Define Format:</strong> Indicate how answers should be structured</li>
                      <li><strong>Error Handling:</strong> Explain how to respond when information is unavailable</li>
                      <li><strong>Use Temperature:</strong> Adjust the temperature parameter to control randomness (0.0 for precise, 1.0 for creative)</li>
                    </ul>
                  </section>
                </div>
              )}
              
              {/* Document Processing Section */}
              {activeSection === "documents" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">Document Processing Pipeline</h3>
                    <p className="mt-2 text-muted-foreground">
                      The I4C Chatbot processes documents through several stages:
                    </p>
                    <ol className="mt-2 space-y-2 list-decimal pl-6">
                      <li><strong>Upload:</strong> Document is transferred to the server</li>
                      <li><strong>Text Extraction:</strong> Content is extracted based on document type</li>
                      <li><strong>Chunking:</strong> Text is divided into manageable segments</li>
                      <li><strong>Embedding:</strong> Each chunk is converted to vector embeddings</li>
                      <li><strong>Indexing:</strong> Embeddings are stored in a vector database for retrieval</li>
                    </ol>
                    <p className="mt-2 text-muted-foreground">
                      This process enables efficient semantic search and retrieval of relevant content when users ask questions.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Supported Document Types</h3>
                    <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          PDF Documents
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Text and basic formatting are extracted. Tables and images are not processed.
                        </p>
                        <p className="text-xs mt-2"><strong>Processed with:</strong> pdf-parse library</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          Word Documents (DOCX)
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Text and basic structure are extracted. Complex formatting may be simplified.
                        </p>
                        <p className="text-xs mt-2"><strong>Processed with:</strong> python-docx library</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-green-500" />
                          Excel Files (XLSX/XLS)
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cell contents are extracted and formatted as tabular text.
                        </p>
                        <p className="text-xs mt-2"><strong>Processed with:</strong> pandas library</p>
                      </div>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Query Processing</h3>
                    <p className="mt-2 text-muted-foreground">
                      When a user submits a query, the system:
                    </p>
                    <ol className="mt-2 space-y-2 list-decimal pl-6">
                      <li>Converts the query to an embedding vector</li>
                      <li>Searches the document's vector database for similar content</li>
                      <li>Retrieves the most relevant chunks</li>
                      <li>Combines chunks with the system prompt and user query</li>
                      <li>Sends the combined input to the selected AI model</li>
                      <li>Returns the model's response to the user</li>
                    </ol>
                    <p className="mt-2 text-muted-foreground">
                      This retrieval-augmented generation (RAG) approach enables accurate, document-grounded responses.
                    </p>
                  </section>
                </div>
              )}
              
              {/* Technical Details Section */}
              {activeSection === "technical" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">System Architecture</h3>
                    <p className="mt-2 text-muted-foreground">
                      The I4C Chatbot uses a modern stack with these key components:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS, shadcn/ui</li>
                      <li><strong>Backend:</strong> Python Flask API</li>
                      <li><strong>AI:</strong> Ollama for running local language models</li>
                      <li><strong>Vector Store:</strong> FAISS for efficient similarity search</li>
                      <li><strong>Web Server:</strong> Nginx for serving the application</li>
                      <li><strong>Containerization:</strong> Docker for deployment</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Deployment Configuration</h3>
                    <p className="mt-2 text-muted-foreground">
                      The system is configured for easy deployment with Docker:
                    </p>
                    <div className="mt-2 p-4 bg-muted rounded-md text-xs font-mono overflow-auto">
                      <pre>
{`# Clone the repository
git clone https://github.com/your-org/i4c-chatbot.git

# Navigate to the project directory
cd i4c-chatbot

# Build and run with Docker
docker build -t i4c-chatbot .
docker run -p 80:80 -p 5000:5000 i4c-chatbot`}
                      </pre>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      The Docker container includes:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li>Python environment with all dependencies</li>
                      <li>Nginx web server configuration</li>
                      <li>Ollama for AI model inference</li>
                      <li>The built React application</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">API Configuration</h3>
                    <p className="mt-2 text-muted-foreground">
                      The API is configured to work in both development and production environments:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>Development:</strong> API requests are proxied through Vite to the Flask backend</li>
                      <li><strong>Production:</strong> Nginx routes API requests to the Flask application</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      This configuration eliminates the need for CORS configuration and simplifies deployment.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Security Considerations</h3>
                    <p className="mt-2 text-muted-foreground">
                      The system implements several security measures:
                    </p>
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li><strong>Admin Authentication:</strong> Token-based authentication for administrative actions</li>
                      <li><strong>Input Validation:</strong> All user inputs are validated server-side</li>
                      <li><strong>File Type Restrictions:</strong> Only allowed document types can be uploaded</li>
                      <li><strong>Rate Limiting:</strong> API endpoints are protected from excessive requests</li>
                      <li><strong>Secure Headers:</strong> Nginx is configured with secure headers</li>
                    </ul>
                  </section>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
