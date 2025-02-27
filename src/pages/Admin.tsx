
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDropzone } from 'react-dropzone';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Trash, FileText, ArrowLeft } from "lucide-react";
import { getOllamaModels } from "@/lib/documentProcessor";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  model: string;
  created_at: string;
}

const API_BASE_URL = "http://localhost:5000/api";
const ADMIN_API_BASE_URL = "http://localhost:5000/admin";

const Admin = () => {
  const [adminToken, setAdminToken] = useState<string>("");
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  
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
        // Set default title to filename without extension
        if (!title) {
          const filename = acceptedFiles[0].name;
          const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
          setTitle(nameWithoutExtension || filename);
        }
        
        toast({
          title: "File selected",
          description: `${acceptedFiles[0].name} has been selected for upload.`,
        });
      }
    }
  });

  // Fetch admin token for first-time setup
  useEffect(() => {
    const fetchAdminToken = async () => {
      try {
        const response = await fetch(`${ADMIN_API_BASE_URL}/token`);
        if (response.ok) {
          const data = await response.json();
          if (data.admin_token) {
            // Only set this if no token has been entered yet
            if (!adminToken) {
              setAdminToken(data.admin_token);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching admin token:", error);
      }
    };

    fetchAdminToken();
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

  const fetchDocuments = async () => {
    if (!adminToken) return;
    
    setIsLoadingDocuments(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/documents`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      
      const data = await response.json();
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

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    
    setIsChecking(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/documents`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (response.ok) {
        setIsTokenValid(true);
        toast({
          title: "Token validated",
          description: "Admin access granted.",
        });
        
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        setIsTokenValid(false);
        toast({
          title: "Invalid token",
          description: "The provided admin token is invalid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating token:", error);
      toast({
        title: "Error validating token",
        description: "Failed to validate the admin token.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile || !selectedModel || !title) {
      toast({
        title: "Missing information",
        description: "Please provide a file, title, and select a model.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('model', selectedModel);
      
      const response = await fetch(`${ADMIN_API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload document");
      }
      
      const data = await response.json();
      
      toast({
        title: "Document uploaded",
        description: "The document has been uploaded and processed successfully.",
      });
      
      // Reset form
      setUploadedFile(null);
      setTitle("");
      setDescription("");
      
      // Refresh documents list
      fetchDocuments();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error uploading document",
        description: error.message || "Failed to upload and process the document.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/document/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
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

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-[400px] glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Authentication</CardTitle>
            <CardDescription>
              Enter the admin token to access the document management interface.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleTokenSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="token">Admin Token</Label>
                  <Input
                    id="token"
                    placeholder="Enter your admin token"
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    required
                    className="transition-colors"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => window.location.href = "/"} className="hover-scale">
                Back to Home
              </Button>
              <Button type="submit" disabled={isChecking || !adminToken} className="hover-scale">
                {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 transition-colors duration-300">
      <div className="flex justify-between items-center animate-fade-in">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Document Management</h1>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={() => window.location.href = "/"} className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <Card className="glass-card animate-slide-in-left">
          <CardHeader>
            <CardTitle className="text-xl">Upload Document</CardTitle>
            <CardDescription>
              Upload a PDF document for users to query
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpload}>
            <CardContent className="space-y-5">
              {/* PDF Upload */}
              <div className="space-y-2">
                <Label>PDF Document</Label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer hover-scale ${
                    isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                    <p className="text-base text-muted-foreground font-medium">
                      {isDragActive
                        ? "Drop the PDF here ..."
                        : "Drag & drop a PDF file here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      or click to select
                    </p>
                  </div>
                </div>
                
                {uploadedFile && (
                  <div className="mt-3 flex items-center p-3 bg-accent/50 rounded-md animate-scale-in">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm truncate">{uploadedFile.name}</span>
                  </div>
                )}
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Document title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="transition-colors"
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the document"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none transition-colors"
                />
              </div>
              
              {/* Model Selection */}
              <div className="space-y-2">
                <Label>Model</Label>
                <RadioGroup 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                  className="flex flex-col space-y-1"
                >
                  {availableModels.length > 0 ? (
                    availableModels.map(model => (
                      <div key={model} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <RadioGroupItem value={model} id={`model-${model}`} />
                        <Label htmlFor={`model-${model}`} className="cursor-pointer">{model}</Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No models available</p>
                  )}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full hover-scale"
                disabled={isUploading || !uploadedFile || !selectedModel || !title}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Documents Table */}
        <Card className="glass-card animate-slide-in-right">
          <CardHeader>
            <CardTitle className="text-xl">Uploaded Documents</CardTitle>
            <CardDescription>
              Manage your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDocuments ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : documents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableCaption>List of uploaded documents</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id} className="hover-scale">
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell>{doc.model}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full transition-all hover:bg-destructive/10">
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card animate-scale-in">
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{doc.title}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="hover-scale"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                No documents uploaded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
