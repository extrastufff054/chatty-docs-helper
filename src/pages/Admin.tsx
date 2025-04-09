
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Users } from "lucide-react";
import { getOllamaModels } from "@/lib/documentProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUpload from "@/components/admin/DocumentUpload";
import DocumentsList from "@/components/admin/DocumentsList";
import SystemPromptWrapper from "@/components/SystemPromptWrapper";
import { fetchAdminToken, fetchAdminDocuments, deleteDocument } from "@/lib/adminApiClient";
import ConnectionErrorDisplay from "@/components/admin/ConnectionErrorDisplay";
import AdminHeader from "@/components/admin/AdminHeader";
import UserManagement from "@/components/admin/users/UserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Admin Panel
 * 
 * Provides document management for the chatbot system including:
 * - Document upload and deletion
 * - System prompt management
 * - Authentication
 * - User management
 */
const Admin = () => {
  // Authentication state
  const [adminToken, setAdminToken] = useState<string>("");
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
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

  // Fetch admin token for setup
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
    if (!isAuthenticated || !isAdmin) return;
    
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
  }, [toast, isAuthenticated, isAdmin]);

  // Fetch documents when authenticated
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    
    fetchDocuments();
  }, [isAuthenticated, isAdmin]);

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
    return <ConnectionErrorDisplay errorMessage={connectionErrorMessage} />;
  }

  // If not authenticated as admin, redirect to admin login
  if (!isAuthenticated || !isAdmin) {
    navigate("/admin-auth");
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-8 transition-colors duration-300">
      <AdminHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="documents" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="users" className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            Users
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
        
        <TabsContent value="users" className="animate-fade-in">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="advanced" className="animate-fade-in">
          <SystemPromptWrapper adminToken={adminToken} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
