
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, List, Send, Loader2, FileUp } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getOllamaModels } from "@/lib/documentProcessor";
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch available documents
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const response = await fetch(`${API_BASE_URL}/documents`);
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        
        const data = await response.json();
        setDocuments(data.documents || []);
        
        // Auto-select the first document if available
        if (data.documents && data.documents.length > 0 && !selectedDocument) {
          handleDocumentSelect(data.documents[0]);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error fetching documents",
          description: "Failed to retrieve available documents.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDocuments(false);
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
          model: document.model,
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
      <div className="min-h-screen flex w-full transition-colors duration-300">
        {/* Document Sidebar */}
        <Sidebar className="border-r border-border/40">
          <SidebarContent className="animate-slide-in-left">
            <SidebarGroup>
              <SidebarGroupLabel className="font-medium">Documents</SidebarGroupLabel>
              <SidebarGroupContent>
                {isLoadingDocuments ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="relative h-16 w-16">
                      <div className="absolute animate-float">
                        <FileUp className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Loading documents...</p>
                  </div>
                ) : documents.length > 0 ? (
                  <SidebarMenu>
                    {documents.map(doc => (
                      <SidebarMenuItem key={doc.id} className="transition-all">
                        <SidebarMenuButton asChild onClick={() => handleDocumentSelect(doc)}>
                          <div className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all ${
                            selectedDocument?.id === doc.id ? 'bg-accent/70' : ''
                          }`}>
                            <FileText className="h-4 w-4 transition-transform" />
                            <span className="truncate">{doc.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                ) : (
                  <div className="text-sm text-muted-foreground p-4 text-center">
                    No documents available
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>

            {selectedDocument && (
              <SidebarGroup>
                <SidebarGroupLabel className="font-medium">Current Document</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="p-3 bg-accent/30 rounded-md">
                    <h3 className="text-sm font-medium mb-1">{selectedDocument.title}</h3>
                    {selectedDocument.description && (
                      <p className="text-xs text-muted-foreground">{selectedDocument.description}</p>
                    )}
                    <div className="mt-2 text-xs flex items-center">
                      <span className="text-muted-foreground">Model:</span>
                      <span className="ml-1 text-primary font-medium">{selectedDocument.model}</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6 md:mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover-scale">
                <Button variant="ghost" size="icon" className="rounded-full transition-all">
                  <List className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                PDF Chatbot
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => window.open("/documentation", "_blank")} className="hover-scale rounded-full">
                      <FileText className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open Documentation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Processing Animation */}
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="relative h-20 w-20">
                <div className="absolute animate-float">
                  <FileText className="h-16 w-16 text-primary" />
                </div>
              </div>
              <p className="mt-4 text-primary font-medium">Processing document...</p>
            </div>
          )}

          <div className="flex flex-col flex-1">
            {/* Chat Container */}
            <div className="flex flex-col flex-1 animate-slide-in-right">
              {/* Chat Messages */}
              <div className="flex-1 overflow-auto mb-4 pr-2 scrollbar-track rounded-md">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-8 animate-fade-in">
                    <div className="max-w-md space-y-4">
                      <div className="rounded-full bg-primary/10 p-3 inline-block">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium">Welcome to PDF Chatbot</h3>
                      <p className="text-muted-foreground">
                        {selectedDocument ? (
                          `You're now chatting with "${selectedDocument.title}". Ask any questions about the document.`
                        ) : (
                          documents.length > 0 ? 
                            "Select a document from the sidebar to start chatting." : 
                            "No documents available. Please ask an admin to upload documents."
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
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
              <div className="sticky bottom-0 pb-2 pt-1 bg-background">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2 bg-card/50 p-2 rounded-lg backdrop-blur-sm border border-border/30">
                  <Input
                    placeholder="Type your question here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading || !qaChain}
                    className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !qaChain || !prompt.trim()}
                    className="shrink-0 rounded-full transition-all hover:scale-105"
                    variant="default"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
