
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, FileText, Settings } from "lucide-react";
import { getOllamaModels } from "@/lib/documentProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/admin/AdminLogin";
import DocumentUpload from "@/components/admin/DocumentUpload";
import DocumentsList from "@/components/admin/DocumentsList";
import SystemPromptWrapper from "@/components/SystemPromptWrapper";
import { API_BASE_URL } from "@/lib/apiClient";

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
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("documents");
  
  const { toast } = useToast();

  // Fetch admin token for first-time setup
  useEffect(() => {
    const fetchAdminToken = async () => {
      try {
        console.log('Fetching admin token from:', `${API_BASE_URL}/admin/token`);
        const response = await fetch(`${API_BASE_URL}/admin/token`);
        if (response.ok) {
          const data = await response.json();
          if (data.admin_token) {
            // Only set this if no token has been entered yet
            if (!adminToken) {
              setAdminToken(data.admin_token);
              console.log('Admin token retrieved successfully');
            }
          }
        } else {
          console.error('Failed to fetch admin token:', response.status);
        }
      } catch (error) {
        console.error("Error fetching admin token:", error);
      }
    };

    fetchAdminToken();
  }, [adminToken]);

  // Fetch available models
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
            description: "Ensure models are installed on the server.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        toast({
          title: "Error fetching models",
          description: "Please ensure the server is running.",
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
      console.log('Fetching documents from:', `${API_BASE_URL}/admin/documents`);
      console.log('Using admin token:', adminToken.substring(0, 3) + '...');
      
      const response = await fetch(`${API_BASE_URL}/admin/documents`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch documents:', response.status, errorText);
        throw new Error("Failed to fetch documents");
      }
      
      const data = await response.json();
      console.log('Documents fetched successfully:', data);
      setDocuments(data.documents || []);
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
      console.log('Deleting document:', documentId);
      const response = await fetch(`${API_BASE_URL}/admin/document/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete document:', response.status, errorText);
        throw new Error("Failed to delete document");
      }
      
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
