
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useDropzone } from 'react-dropzone';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Send, FileText, HelpCircle } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { initializeQAChain, processQuery, getOllamaModels } from "@/lib/documentProcessor";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qaChain, setQaChain] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Dropzone for file upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        toast({
          title: "File uploaded",
          description: `${acceptedFiles[0].name} has been uploaded successfully.`,
        });
      }
    }
  });

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

  // Scroll to bottom of chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Initialize QA chain when file is uploaded and model is selected
  useEffect(() => {
    const initialize = async () => {
      if (uploadedFile && selectedModel) {
        setIsProcessing(true);
        try {
          const chain = await initializeQAChain(uploadedFile, selectedModel);
          setQaChain(chain);
          toast({
            title: "Document processed",
            description: "Your document has been processed successfully.",
          });
        } catch (error: any) {
          console.error("Error initializing QA chain:", error);
          toast({
            title: "Error processing document",
            description: error.message || "Failed to process the document.",
            variant: "destructive",
          });
          setQaChain(null);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    initialize();
  }, [uploadedFile, selectedModel, toast]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    if (!qaChain) {
      toast({
        title: "No document loaded",
        description: "Please upload a PDF file and select a model first.",
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

    let responseText = "";
    
    try {
      // Process the query and stream the response
      await processQuery(prompt, qaChain, (token) => {
        responseText += token;
        setStreamingContent(responseText);
      });
      
      // After streaming is complete, add the full message
      const assistantMessage: Message = { role: "assistant", content: responseText };
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent("");
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
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Custom PDF Chatbot</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => window.open("/documentation", "_blank")}>
                <HelpCircle className="h-5 w-5" />
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
        {/* Sidebar */}
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
          
          {/* File Upload */}
          <div>
            <h3 className="text-sm font-medium mb-2">Upload PDF</h3>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-md p-4 transition-colors cursor-pointer hover:bg-muted ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the PDF here ..."
                    : "Drag & drop a PDF file here, or click to select"}
                </p>
              </div>
            </div>
            
            {uploadedFile && (
              <div className="mt-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span className="text-sm truncate">{uploadedFile.name}</span>
              </div>
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
                    Upload a PDF document and select an Ollama model to get started.
                    Then ask any questions about your document.
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
          
          {/* Status when no document is loaded */}
          {!qaChain && !isProcessing && (
            <p className="text-sm text-muted-foreground mt-2">
              Upload a PDF and select a model to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
