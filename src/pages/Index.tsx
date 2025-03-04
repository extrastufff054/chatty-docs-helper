
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { X, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import DocumentSidebar from "@/components/layout/DocumentSidebar";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatInput from "@/components/chat/ChatInput";
import ChatHistory from "@/components/chat/ChatHistory";
import EmptyChat from "@/components/chat/EmptyChat";
import { Document, fetchDocuments, selectDocument } from "@/api/documents";
import { SystemPrompt, fetchSystemPrompts } from "@/api/systemPrompts";
import { processQuery } from "@/api/queries";
import { ChatSession, Message } from "@/types/chat";
import { generateChatId, getChatTitle } from "@/utils/chat";

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
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
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

  const handleSendMessage = async (message: string) => {
    if (!qaChain || !sessionId) {
      toast({
        title: "No document selected",
        description: "Please select a document from the sidebar first.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: message };
    
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
    
    setIsLoading(true);
    setStreamingContent("");

    try {
      const data = await processQuery(sessionId, message);
      
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full transition-colors duration-300">
        <Sidebar side="left" className="border-r border-border/40">
          <DocumentSidebar
            documents={documents}
            selectedDocument={selectedDocument}
            isLoadingDocuments={isLoadingDocuments}
            onDocumentSelect={handleDocumentSelect}
          />
        </Sidebar>

        <div className="flex flex-col flex-1 p-4 md:p-6">
          <Header
            selectedDocument={selectedDocument}
            onNewChat={handleNewChat}
            showRightSidebar={showRightSidebar}
            setShowRightSidebar={setShowRightSidebar}
            isHistorySheetOpen={isHistorySheetOpen}
            setIsHistorySheetOpen={setIsHistorySheetOpen}
            chatSessions={chatSessions}
            activeChatId={activeChatId}
            onSwitchChat={handleSwitchChat}
            onDeleteChat={handleDeleteChat}
            isMobile={isMobile}
          />
          
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
              {messages.length === 0 ? (
                <EmptyChat 
                  selectedDocument={selectedDocument}
                  onNewChat={handleNewChat}
                  documentsAvailable={documents.length > 0}
                />
              ) : (
                <ChatContainer 
                  messages={messages}
                  streamingContent={streamingContent}
                />
              )}
              
              <div className="sticky bottom-0 pb-2 pt-1 bg-background">
                <ChatInput
                  isLoading={isLoading}
                  isDisabled={!qaChain}
                  onSendMessage={handleSendMessage}
                />
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
                
                <ChatHistory 
                  chatSessions={chatSessions}
                  activeChatId={activeChatId}
                  onSwitchChat={handleSwitchChat}
                  onDeleteChat={handleDeleteChat}
                  onNewChat={handleNewChat}
                  selectedDocument={selectedDocument}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
