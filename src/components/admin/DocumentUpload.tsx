
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { uploadDocument } from "@/lib/documentProcessor";
import { Label } from "@/components/ui/label";
import DropzoneArea from "./DropzoneArea";
import UploadProgressBar from "./UploadProgressBar";
import ModelSelection from "./ModelSelection";

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

  return (
    <Card className="glass-card animate-slide-in-left">
      <CardHeader>
        <CardTitle className="text-xl">Upload Document</CardTitle>
        <CardDescription>
          Upload PDF, Word, or Excel files (max 20MB)
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleUpload}>
        <CardContent className="space-y-5">
          {/* Document Upload */}
          <div className="space-y-2">
            <Label>Document File</Label>
            <DropzoneArea 
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              setTitle={setTitle}
              title={title}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              isUploading={isUploading}
            />
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
          <ModelSelection 
            availableModels={availableModels}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isUploading={isUploading}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <UploadProgressBar 
            uploadProgress={uploadProgress}
            isUploading={isUploading}
          />
          
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
