
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDropzone } from 'react-dropzone';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Trash, FileText, ArrowLeft, Settings, FolderUp, FileUp, Archive } from "lucide-react";
import { getOllamaModels, uploadMultipleFiles } from "@/lib/documentProcessor";
import { ThemeToggle } from "@/components/ThemeToggle";
import SystemPromptManagement from "@/components/SystemPromptManagement";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("documents");
  const [enableBatchMode, setEnableBatchMode] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const { toast } = useToast();

  // Configure Dropzone for file upload with support for folders and multiple files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    multiple: true,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...acceptedFiles]);
        
        // Set default title to number of files if multiple
        if (!title && acceptedFiles.length > 1) {
          setTitle(`Batch Upload (${acceptedFiles.length} files)`);
        } 
        // Set to filename if just one
        else if (!title && acceptedFiles.length === 1) {
          const filename = acceptedFiles[0].name;
          const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
          setTitle(nameWithoutExtension || filename);
        }
        
        const fileMessage = acceptedFiles.length === 1 
          ? `${acceptedFiles[0].name} has been selected`
          : `${acceptedFiles.length} files have been selected`;
        
        toast({
          title: "Files selected",
          description: fileMessage,
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

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0 || !selectedModel || !title) {
      toast({
        title: "Missing information",
        description: "Please provide at least one file, a title, and select a model.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      console.log("Starting upload with files:", uploadedFiles);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.1;
          return Math.min(95, newProgress); // Cap at 95% until we get the response
        });
      }, 300);
      
      // Use the uploadMultipleFiles function for all uploads
      const result = await uploadMultipleFiles(
        uploadedFiles,
        title,
        description,
        selectedModel,
        adminToken
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Upload complete",
        description: result.message || "Document(s) uploaded and processed successfully.",
      });
      
      // Reset form
      setUploadedFiles([]);
      setTitle("");
      setDescription("");
      setUploadProgress(0);
      
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

  // Helper to render file type icon
  const getFileIcon = (filename: string) => {
    if (filename.toLowerCase().endsWith('.zip')) {
      return <Archive className="h-4 w-4 mr-2 text-amber-500" />;
    } else if (filename.toLowerCase().endsWith('.pdf')) {
      return <FileText className="h-4 w-4 mr-2 text-primary" />;
    } else {
      return <FileUp className="h-4 w-4 mr-2 text-blue-500" />;
    }
  };

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-[400px] glass-card animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
                alt="I4C Logo" 
                className="h-20 w-auto"
              />
            </div>
            <CardTitle className="text-2xl">I4C Chatbot Admin</CardTitle>
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
            <Card className="glass-card animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-xl">Upload Documents</CardTitle>
                <CardDescription>
                  Upload PDF documents or ZIP archives for users to query
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpload}>
                <CardContent className="space-y-5">
                  {/* PDF Upload */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Document Files</Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="batch-mode" className="text-sm text-muted-foreground">Batch Processing</Label>
                        <Switch 
                          id="batch-mode" 
                          checked={enableBatchMode}
                          onCheckedChange={setEnableBatchMode}
                        />
                      </div>
                    </div>
                    <div 
                      {...getRootProps()} 
                      className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer hover-scale ${
                        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex gap-2 mb-4">
                          <FileUp className="h-8 w-8 text-muted-foreground" />
                          <FolderUp className="h-8 w-8 text-muted-foreground" />
                          <Archive className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-base text-muted-foreground font-medium">
                          {isDragActive
                            ? "Drop the files here ..."
                            : "Drag & drop files or folders here"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports multiple PDFs, ZIP archives, or folders
                        </p>
                      </div>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex flex-col space-y-2 animate-scale-in">
                        <p className="text-sm font-medium">Selected Files ({uploadedFiles.length})</p>
                        <div className="max-h-32 overflow-y-auto rounded-md border">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 hover:bg-accent/50 border-b last:border-b-0">
                              <div className="flex items-center space-x-2 truncate">
                                {file.name.toLowerCase().endsWith('.pdf') ? (
                                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                ) : file.name.toLowerCase().endsWith('.zip') ? (
                                  <Archive className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                ) : (
                                  <FileUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                )}
                                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveFile(index);
                                }}
                                className="h-6 w-6 rounded-full hover:bg-destructive/10"
                              >
                                <Trash className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setUploadedFiles([])}
                          className="self-end"
                        >
                          Clear All
                        </Button>
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
                    <Label>Model (Required)</Label>
                    <RadioGroup 
                      value={selectedModel} 
                      onValueChange={setSelectedModel}
                      className="flex flex-col space-y-1"
                      required
                    >
                      {availableModels.length > 0 ? (
                        availableModels.map(model => (
                          <div key={model} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
                            <RadioGroupItem value={model} id={`model-${model}`} />
                            <Label htmlFor={`model-${model}`} className="cursor-pointer">{model}</Label>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                          <p className="text-sm text-muted-foreground">Loading models...</p>
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {isUploading && uploadProgress > 0 && (
                    <div className="w-full">
                      <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {uploadProgress < 100 ? "Processing..." : "Complete"}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full hover-scale"
                    disabled={isUploading || uploadedFiles.length === 0 || !selectedModel || !title}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploadedFiles.length > 1 ? "Uploading Files..." : "Uploading..."}
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadedFiles.length > 1 ? `Upload ${uploadedFiles.length} Documents` : "Upload Document"}
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
                  <div className="rounded-md border overflow-x-auto">
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
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                {getFileIcon(doc.filename)}
                                <span className="truncate max-w-[200px]">{doc.title}</span>
                              </div>
                            </TableCell>
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
        </TabsContent>
        
        <TabsContent value="advanced" className="animate-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Advanced Settings</CardTitle>
              <CardDescription>
                Configure system prompts and response parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemPromptManagement adminToken={adminToken} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
