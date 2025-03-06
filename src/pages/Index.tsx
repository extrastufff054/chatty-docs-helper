import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, List, Send, Loader2, FileUp, ChevronUp, ChevronDown, MessageSquare, Plus, X, RefreshCcw, Trash } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { API_BASE_URL } from "@/config/apiConfig";
import { fetchDocuments, fetchSystemPrompts, selectDocument, processQuery } from "@/lib/apiClient";

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

interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  temperature: number;
  description: string;
}

interface ChatSession {
  id: string;
  title: string;
  documentId: string;
  documentTitle: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
  systemPromptId: string;
}

const generateChatId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const getChatTitle = (messages: Message[]) => {
  if (messages.length === 0) return "New Chat";
  
  const firstUserMessage = messages.find(m => m.role === "user");
  if (!firstUserMessage) return "New Chat";
  
  const title = firstUserMessage.content.substring(0, 30);
  return title.length < firstUserMessage.content.length ? `${title}...` : title;
};

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qaChain, setQaChain] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const activeChat = chatSessions.find(chat => chat.id === activeChatId) || null;
  const messages = activeChat?.messages || [];

  const createNewChat = (documentId: string, documentTitle: string) => {
    const newChatId = generateChatId();
    const newChat: ChatSession = {
      id: newChatId,
      title: "New Chat",
      documentId,
      documentTitle,
      messages: [],
      createdAt: new Date(),
      lastMessageAt: new Date(),
      systemPromptId: "default"
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    return newChatId;
  };

  useEffect(() => {
    if (activeChatId && messages.length > 0) {
      setChatSessions(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            title: getChatTitle(messages),
            lastMessageAt: new Date()
          };
        }
        return chat;
      }));
    }
  }, [messages, activeChatId]);

  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  useEffect(() => {
    const savedChats = localStorage.getItem('chatSessions');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        const chats = parsedChats.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          lastMessageAt: new Date(chat.lastMessageAt)
        }));
        setChatSessions(chats);
        
        if (chats.length > 0) {
          setActiveChatId(chats[0].id);
        }
      } catch (error) {
        console.error("Error loading saved chats:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        if (headerRef.current) {
          headerRef.current.classList.add('fixed-header');
          document.body.style.paddingTop = `${headerRef.current.offsetHeight}px`;
        }
      } else {
        if (headerRef.current) {
          headerRef.current.classList.remove('fixed-header');
          document.body.style.paddingTop = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const getDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
        
        if (docs.length > 0 && !selectedDocument && !activeChatId) {
          handleDocumentSelect(docs[0]);
        }
      } catch (error: any) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error fetching documents",
          description: error.message || "Failed to retrieve available documents.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    getDocuments();
  }, [toast]);

  useEffect(() => {
    const getSystemPrompts = async () => {
      try {
        const prompts = await fetchSystemPrompts();
        setSystemPrompts(prompts);
      } catch (error) {
        console.error("Error fetching system prompts:", error);
      }
    };

    getSystemPrompts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleDocumentSelect = async (document: Document) => {
    setIsProcessing(true);
    setSelectedDocument(document);
    
    const chatId = createNewChat(document.id, document.title);
    
    try {
      const data = await selectDocument(document.id, document.model);
      
      setSessionId(data.session_id);
      
      toast({
        title: "Document selected",
        description: `${document.title} has been selected for querying.`,
      });
      
      setQaChain({ sessionId: data.session_id });
      
      if (isMobile) {
        setIsHistorySheetOpen(false);
      }
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
      
      setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
      setActiveChatId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = async () => {
    if (!selectedDocument) {
      toast({
        title: "No document selected",
        description: "Please select a document first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    const chatId = createNewChat(selectedDocument.id, selectedDocument.title);
    
    try {
      const data = await selectDocument(selectedDocument.id, selectedDocument.model);
      
      setSessionId(data.session_id);
      
      toast({
        title: "New chat created",
        description: "You can now start a new conversation.",
      });
      
      setQaChain({ sessionId: data.session_id });
      
      if (isMobile) {
        setIsHistorySheetOpen(false);
      }
    } catch (error: any) {
      console.error("Error initializing new chat:", error);
      toast({
        title: "Error creating new chat",
        description: error.message || "Failed to initialize new chat.",
        variant: "destructive",
      });
      
      setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSwitchChat = async (chatId: string) => {
    const chat = chatSessions.find(c => c.id === chatId);
    if (!chat) return;
    
    setActiveChatId(chatId);
    
    const document = documents.find(d => d.id === chat.documentId);
    if (!document) {
      toast({
        title: "Document not found",
        description: "The document for this chat is no longer available.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedDocument(document);
    
    setIsProcessing(true);
    try {
      const data = await selectDocument(document.id, document.model);
      
      setSessionId(data.session_id);
      setQaChain({ sessionId: data.session_id });
      
      if (isMobile) {
        setIsHistorySheetOpen(false);
        setShowRightSidebar(false);
      }
    } catch (error: any) {
      console.error("Error loading chat:", error);
      toast({
        title: "Error loading chat",
        description: error.message || "Failed to load chat session.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteChat = (chatId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    
    if (activeChatId === chatId) {
      const remainingChats = chatSessions.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        handleSwitchChat(remainingChats[0].id);
      } else if (selectedDocument) {
        handleNewChat();
      } else {
        setActiveChatId(null);
      }
    }
    
    toast({
      title: "Chat deleted",
      description: "The chat session has been removed.",
    });
  };

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

    const userMessage: Message = { role: "user", content: prompt };
    
    if (activeChatId) {
      setChatSessions(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
            lastMessageAt: new Date()
          };
        }
        return chat;
      }));
    }
    
    setPrompt("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const data = await processQuery(sessionId, prompt);
      
      if (data.tokens && Array.isArray(data.tokens)) {
        let accumulatedText = "";
        
        for (const token of data.tokens) {
          accumulatedText += token;
          setStreamingContent(accumulatedText);
          
          await new Promise(resolve => setTimeout(resolve, 15));
        }
        
        const assistantMessage: Message = { role: "assistant", content: accumulatedText };
        
        if (activeChatId) {
          setChatSessions(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                lastMessageAt: new Date()
              };
            }
            return chat;
          }));
        }
        
        setStreamingContent("");
      } else {
        const assistantMessage: Message = { role: "assistant", content: data.answer || "No answer found." };
        
        if (activeChatId) {
          setChatSessions(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                lastMessageAt: new Date()
              };
            }
            return chat;
          }));
        }
      }
    } catch (error: any) {
      toast({
        title: "Error processing query",
        description: error.message || "Failed to process your query.",
        variant: "destructive",
      });
      console.error("Error:", error);
      
      const errorMessage: Message = {
        role: "assistant",
        content: error.message || "An error occurred while processing your query."
      };
      
      if (activeChatId) {
        setChatSessions(prev => prev.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
              lastMessageAt: new Date()
            };
          }
          return chat;
        }));
      }
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderChatHistory = () => (
    <div className="space-y-2">
      {chatSessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No chats yet</p>
        </div>
      ) : (
        chatSessions.map(chat => (
          <div 
            key={chat.id} 
            className={`p-3 rounded-md cursor-pointer transition-all hover:bg-accent/50 ${
              activeChatId === chat.id ? 'bg-accent/70' : ''
            }`}
            onClick={() => handleSwitchChat(chat.id)}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm line-clamp-1">{chat.title}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={(e) => handleDeleteChat(chat.id, e)}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <Badge variant="outline" className="text-xs font-normal truncate max-w-[120px]">
                {chat.documentTitle}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(chat.lastMessageAt)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full transition-colors duration-300">
        <Sidebar side="left" className="border-r border-border/40">
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
          <div 
            ref={headerRef} 
            className="flex items-center justify-between mb-6 md:mb-8 animate-fade-in py-2 px-4 transition-all z-50 w-full bg-background"
          >
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover-scale">
                <Button variant="ghost" size="icon" className="rounded-full transition-all">
                  <List className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <img 
                  src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
                  alt="I4C Logo" 
                  className="h-8 w-auto md:h-10"
                />
                <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center md:text-left">
                  Indian Cybercrime Coordination Centre
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNewChat}
                className="hover-scale hidden md:flex"
                disabled={!selectedDocument}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Chat
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className="hover-scale rounded-full hidden md:flex"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              
              {isMobile && (
                <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover-scale rounded-full"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[85vw] p-4 overflow-y-auto">
                    <SheetHeader className="mb-4">
                      <SheetTitle>Chat History</SheetTitle>
                      <SheetDescription>
                        <div className="flex justify-between items-center mt-2">
                          <span>Your previous conversations</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleNewChat}
                            disabled={!selectedDocument}
                            className="hover-scale"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            New Chat
                          </Button>
                        </div>
                      </SheetDescription>
                    </SheetHeader>
                    {renderChatHistory()}
                  </SheetContent>
                </Sheet>
              )}
              
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

          <div className="flex flex-1 gap-4 mt-4">
            <div className="flex flex-col flex-1 animate-slide-in-right">
              <div className="flex-1 overflow-auto mb-4 pr-2 scrollbar-track rounded-md">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-8 animate-fade-in">
                    <div className="max-w-md space-y-4">
                      <div className="rounded-full bg-primary/10 p-3 inline-block">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium">Welcome to I4C Chatbot</h3>
                      <p className="text-muted-foreground">
                        {selectedDocument ? (
                          `You're now chatting with "${selectedDocument.title}". Ask any questions about the document.`
                        ) : (
                          documents.length > 0 ? 
                            "Select a document from the sidebar to start chatting." : 
                            "No documents available. Please ask an admin to upload documents."
                        )}
                      </p>
                      {selectedDocument && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleNewChat}
                          className="hover-scale"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New Chat
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    {activeChat?.messages.map((message, index) => (
                      <ChatMessage 
                        key={index} 
                        role={message.role} 
                        content={message.content} 
                      />
                    ))}
                    
                    {streamingContent && (
                      <ChatMessage 
                        role="assistant" 
                        content={streamingContent} 
                        isStreaming={true} 
                      />
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
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
            
            {showRightSidebar && !isMobile && (
              <div className="w-80 bg-background border-l border-border/40 p-3 overflow-y-auto animate-slide-in-right hidden md:block">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Chat History</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full" 
                      onClick={handleNewChat}
                      disabled={!selectedDocument}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full" 
                      onClick={() => setShowRightSidebar(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {renderChatHistory()}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
