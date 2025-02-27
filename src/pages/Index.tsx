
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Send, FileText, List, Download, Folder, FolderOpen } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { processQuery, getOllamaModels } from "@/lib/documentProcessor";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  model: string;
  created_at: string;
}

const API_BASE_URL = "http://localhost:5000/api";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qaChain, setQaChain] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch available Ollama models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await getOllamaModels();
        setAvailableModels(models);
        
        if (models.length > 0) {
          setSelectedModel(models[0]);
        } else {
          toast({
            title: "No models found",
            description: "Ensure Ollama is running and models are installed.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        toast({
          title: "Error fetching models",
          description: "Please ensure Ollama is installed and running.",
          variant: "destructive",
        });
      }
    };

    fetchModels();
  }, [toast]);

  // Fetch available documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/documents`);
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        
        const data = await response.json();
        setDocuments(data.documents || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error fetching documents",
          description: "Failed to retrieve available documents.",
          variant: "destructive",
        });
      }
    };

    fetchDocuments();
  }, [toast]);

  // Scroll to bottom of chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Handle document selection
  const handleDocumentSelect = async (document: Document) => {
    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select an Ollama model first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setSelectedDocument(document);
    
    try {
      const response = await fetch(`${API_BASE_URL}/select-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: document.id,
          model: selectedModel,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to select document");
      }
      
      const data = await response.json();
      setSessionId(data.session_id);
      
      toast({
        title: "Document selected",
        description: `${document.title} has been selected for querying.`,
      });
      
      // Reset chat
      setMessages([]);
      setQaChain({ sessionId: data.session_id });
    } catch (error: any) {
      console.error("Error selecting document:", error);
      toast({
        title: "Error selecting document",
        description: error.message || "Failed to select the document.",
        variant: "destructive",
      });
      setSelectedDocument(null);
      setSessionId(null);
      setQaChain(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    if (!qaChain || !sessionId) {
      toast({
        title: "No document selected",
        description: "Please select a document from the sidebar first.",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = { role: "user", content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      // Start streaming response immediately
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          query: prompt
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process the query");
      }
      
      const data = await response.json();
      
      // If tokens are available, stream them to the UI
      if (data.tokens && Array.isArray(data.tokens)) {
        let accumulatedText = "";
        
        // Process tokens one by one with a slight delay to simulate typing
        for (const token of data.tokens) {
          accumulatedText += token;
          setStreamingContent(accumulatedText);
          
          // Small delay to make streaming visible (adjust as needed)
          await new Promise(resolve => setTimeout(resolve, 15));
        }
        
        // After streaming is complete, add the full message
        const assistantMessage: Message = { role: "assistant", content: accumulatedText };
        setMessages(prev => [...prev, assistantMessage]);
        setStreamingContent("");
      } else {
        // Fallback if tokens aren't available
        const assistantMessage: Message = { role: "assistant", content: data.answer || "No answer found." };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      toast({
        title: "Error processing query",
        description: error.message || "Failed to process your query.",
        variant: "destructive",
      });
      console.error("Error:", error);
      
      // Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: error.message || "An error occurred while processing your query."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Document Sidebar */}
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Documents</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {documents.length > 0 ? (
                    documents.map(doc => (
                      <SidebarMenuItem key={doc.id}>
                        <SidebarMenuButton asChild onClick={() => handleDocumentSelect(doc)}>
                          <div className="flex items-center space-x-2 cursor-pointer">
                            {selectedDocument?.id === doc.id ? (
                              <FolderOpen className="h-4 w-4" />
                            ) : (
                              <Folder className="h-4 w-4" />
                            )}
                            <span>{doc.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground p-2">
                      No documents available
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold">PDF Chatbot</h1>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => window.open("/documentation", "_blank")}>
                    <List className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Documentation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <p className="text-muted-foreground mb-6">Local Ollama Models Only</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Settings Card */}
            <Card className="p-4 md:col-span-1 h-fit">
              <h2 className="font-semibold mb-4">Settings</h2>
              
              {/* Model Selection */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Choose Ollama Model</h3>
                <RadioGroup 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                  className="flex flex-col space-y-1"
                >
                  {availableModels.length > 0 ? (
                    availableModels.map(model => (
                      <div key={model} className="flex items-center space-x-2">
                        <RadioGroupItem value={model} id={model} />
                        <Label htmlFor={model}>{model}</Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No models available</p>
                  )}
                </RadioGroup>
              </div>
              
              <Separator className="my-4" />
              
              {/* Selected Document */}
              <div>
                <h3 className="text-sm font-medium mb-2">Selected Document</h3>
                {selectedDocument ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{selectedDocument.title}</span>
                    </div>
                    {selectedDocument.description && (
                      <p className="text-xs text-muted-foreground">{selectedDocument.description}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No document selected</p>
                )}
                
                {isProcessing && (
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Processing document...</span>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Chat Container */}
            <div className="md:col-span-3 flex flex-col h-[70vh]">
              {/* Chat Messages */}
              <div className="flex-1 overflow-auto mb-4 pr-2">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="max-w-md space-y-2">
                      <h3 className="text-lg font-medium">Welcome to PDF Chatbot</h3>
                      <p className="text-muted-foreground">
                        Select a document from the sidebar and choose an Ollama model to get started.
                        Then ask any questions about the document.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <ChatMessage 
                        key={index} 
                        role={message.role} 
                        content={message.content} 
                      />
                    ))}
                    
                    {/* Streaming message if any */}
                    {streamingContent && (
                      <ChatMessage 
                        role="assistant" 
                        content={streamingContent} 
                        isStreaming={true} 
                      />
                    )}
                    
                    {/* Invisible element to scroll to */}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <Input
                  placeholder="Type your question here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading || !qaChain}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !qaChain || !prompt.trim()}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
              
              {/* Status when no document is selected */}
              {!qaChain && !isProcessing && (
                <p className="text-sm text-muted-foreground mt-2">
                  Select a document from the sidebar to start chatting
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
