
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDropzone } from 'react-dropzone';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Trash, FileText, FileUp, AlertCircle } from "lucide-react";
import { uploadDocument } from "@/lib/documentProcessor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Maximum file size in bytes (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface DocumentUploadProps {
  adminToken: string;
  availableModels: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  fetchDocuments: () => void;
}

/**
 * Document Upload Component
 * 
 * Provides a form for uploading documents with metadata
 */
const DocumentUpload = ({ 
  adminToken, 
  availableModels, 
  selectedModel, 
  setSelectedModel,
  fetchDocuments 
}: DocumentUploadProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Track if upload has been canceled
  const uploadCancelRef = useRef<boolean>(false);
  
  const { toast } = useToast();

  // Configure Dropzone for file upload with expanded file types and size validation
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    onDrop: acceptedFiles => {
      setErrorMessage("");
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        
        // Set filename as title if title is empty
        if (!title) {
          const filename = file.name;
          const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
          setTitle(nameWithoutExtension || filename);
        }
        
        toast({
          title: "File selected",
          description: `${file.name} (${formatFileSize(file.size)}) has been selected`,
        });
      }
    },
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setErrorMessage(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
        toast({
          title: "File too large",
          description: `Maximum file size is ${formatFileSize(MAX_FILE_SIZE)}.`,
          variant: "destructive",
        });
      } else {
        setErrorMessage(`Invalid file: ${rejection.errors[0].message}`);
      }
    }
  });

  // Format file size in KB, MB, etc.
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setErrorMessage("");
  };

  // Cancel the current upload
  const handleCancelUpload = useCallback(() => {
    uploadCancelRef.current = true;
    setIsUploading(false);
    setUploadProgress(0);
    toast({
      title: "Upload canceled",
      description: "Document upload has been canceled.",
    });
  }, [toast]);

  const simulateProgress = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      if (uploadCancelRef.current) {
        clearInterval(interval);
        return;
      }
      
      if (progress < 90) {
        // Slower progress as we get closer to 90%
        const increment = progress < 30 ? 5 : 
                        progress < 60 ? 3 : 
                        progress < 80 ? 1 : 0.5;
        progress += increment;
        setUploadProgress(progress);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile || !selectedModel || !title) {
      toast({
        title: "Missing information",
        description: "Please provide a file, a title, and select a model.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage("");
    uploadCancelRef.current = false;
    
    // Start progress simulation
    const stopProgressSimulation = simulateProgress();
    
    try {
      // Use the uploadDocument function
      const result = await uploadDocument(
        uploadedFile,
        title,
        description,
        selectedModel,
        adminToken
      );
      
      if (uploadCancelRef.current) {
        return;
      }
      
      // Complete the progress
      setUploadProgress(100);
      
      toast({
        title: "Upload complete",
        description: result.message || "Document uploaded and processed successfully.",
      });
      
      // Reset form
      setUploadedFile(null);
      setTitle("");
      setDescription("");
      setUploadProgress(0);
      
      // Refresh documents list
      fetchDocuments();
    } catch (error: any) {
      if (uploadCancelRef.current) {
        return;
      }
      
      console.error("Error uploading document:", error);
      setErrorMessage(error.message || "Failed to upload and process the document.");
      toast({
        title: "Error uploading document",
        description: error.message || "Failed to upload and process the document.",
        variant: "destructive",
      });
    } finally {
      stopProgressSimulation();
      if (!uploadCancelRef.current) {
        setIsUploading(false);
      }
      uploadCancelRef.current = false;
    }
  };

  // Get file type label for display
  const getFileTypeLabel = (file: File | null) => {
    if (!file) return '';
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'docx': return 'Word';
      case 'xlsx': 
      case 'xls': return 'Excel';
      default: return extension?.toUpperCase() || '';
    }
  };

  return (
    <Card className="glass-card animate-slide-in-left">
      <CardHeader>
        <CardTitle className="text-xl">Upload Document</CardTitle>
        <CardDescription>
          Upload PDF, Word, or Excel files (max {formatFileSize(MAX_FILE_SIZE)})
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleUpload}>
        <CardContent className="space-y-5">
          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {/* Document Upload */}
          <div className="space-y-2">
            <Label>Document File</Label>
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
                </div>
                <p className="text-base text-muted-foreground font-medium">
                  {isDragActive
                    ? "Drop the file here ..."
                    : "Drag & drop a file here"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports PDF, Word (DOCX), and Excel (XLSX/XLS) files up to {formatFileSize(MAX_FILE_SIZE)}
                </p>
              </div>
            </div>
            
            {uploadedFile && (
              <div className="mt-3 flex flex-col space-y-2 animate-scale-in">
                <p className="text-sm font-medium">Selected File</p>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-2 hover:bg-accent/50">
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm truncate max-w-[200px]">{uploadedFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </span>
                      <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                        {getFileTypeLabel(uploadedFile)}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFile();
                      }}
                      className="h-6 w-6 rounded-full hover:bg-destructive/10"
                      disabled={isUploading}
                    >
                      <Trash className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
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
              disabled={isUploading}
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
              disabled={isUploading}
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
              disabled={isUploading}
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
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  {uploadProgress < 100 ? "Processing..." : "Complete"}
                </p>
                <p className="text-xs font-medium">{Math.round(uploadProgress)}%</p>
              </div>
            </div>
          )}
          
          <div className="flex w-full gap-2">
            {isUploading ? (
              <>
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelUpload}
                >
                  Cancel Upload
                </Button>
                <Button 
                  type="button" 
                  className="flex-1"
                  disabled={true}
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </Button>
              </>
            ) : (
              <Button 
                type="submit" 
                className="w-full hover-scale"
                disabled={isUploading || !uploadedFile || !selectedModel || !title}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DocumentUpload;
