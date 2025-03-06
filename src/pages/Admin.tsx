
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, FileText, Settings, AlertCircle } from "lucide-react";
import { getOllamaModels } from "@/lib/documentProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLogin from "@/components/admin/AdminLogin";
import DocumentUpload from "@/components/admin/DocumentUpload";
import DocumentsList from "@/components/admin/DocumentsList";
import SystemPromptWrapper from "@/components/SystemPromptWrapper";
import { fetchAdminToken, fetchAdminDocuments, deleteDocument } from "@/lib/adminApiClient";

/**
 * Admin Panel
 * 
 * Provides document management for the chatbot system including:
 * - Document upload and deletion
 * - System prompt management
 * - Authentication
 */
const Admin = () => {
  // Authentication state
  const [adminToken, setAdminToken] = useState<string>("");
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  
  // Document management state
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  
  // Error state
  const [hasConnectionError, setHasConnectionError] = useState<boolean>(false);
  const [connectionErrorMessage, setConnectionErrorMessage] = useState<string>("");
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("documents");
  
  const { toast } = useToast();

  // Fetch admin token for first-time setup
  useEffect(() => {
    const getAdminToken = async () => {
      try {
        setHasConnectionError(false);
        const token = await fetchAdminToken();
        if (token) {
          // Only set this if no token has been entered yet
          if (!adminToken) {
            setAdminToken(token);
          }
        }
      } catch (error) {
        console.error("Error fetching admin token:", error);
        setHasConnectionError(true);
        setConnectionErrorMessage("Could not connect to the backend server. Please ensure it's running.");
      }
    };

    getAdminToken();
  }, [adminToken]);

  // Fetch available Ollama models
  useEffect(() => {
    if (!isTokenValid) return;
    
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
  }, [toast, isTokenValid]);

  // Fetch documents when token is valid
  useEffect(() => {
    if (!isTokenValid) return;
    
    fetchDocuments();
  }, [isTokenValid]);

  /**
   * Fetch all documents from the server
   */
  const fetchDocuments = async () => {
    if (!adminToken) return;
    
    setIsLoadingDocuments(true);
    try {
      const docs = await fetchAdminDocuments(adminToken);
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error fetching documents",
        description: "Failed to retrieve uploaded documents.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  /**
   * Delete a document from the server
   */
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(adminToken, documentId);
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      });
      
      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error deleting document",
        description: "Failed to delete the document.",
        variant: "destructive",
      });
    }
  };

  // If there's a connection error, show a helpful message
  if (hasConnectionError) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="mr-2" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{connectionErrorMessage}</p>
            <p>Please check:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The backend server is running on port 5000</li>
              <li>No firewall is blocking the connection</li>
              <li>You're using the correct URL</li>
            </ul>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If token is not valid, show login screen
  if (!isTokenValid) {
    return (
      <AdminLogin 
        adminToken={adminToken} 
        setAdminToken={setAdminToken}
        isTokenValid={isTokenValid}
        setIsTokenValid={setIsTokenValid}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 transition-colors duration-300">
      <div className="flex justify-between items-center animate-fade-in">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
            alt="I4C Logo" 
            className="app-logo h-20 w-auto mr-2"
          />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Indian Cybercrime Coordination Centre
          </h1>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={() => window.location.href = "/"} className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="documents" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Form */}
            <DocumentUpload 
              adminToken={adminToken}
              availableModels={availableModels}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              fetchDocuments={fetchDocuments}
            />
            
            {/* Documents Table */}
            <DocumentsList 
              documents={documents}
              isLoadingDocuments={isLoadingDocuments}
              adminToken={adminToken}
              handleDeleteDocument={handleDeleteDocument}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="animate-fade-in">
          <SystemPromptWrapper adminToken={adminToken} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
