
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useDropzone } from 'react-dropzone';
import { FileText, FileUp, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Maximum file size in bytes (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface DropzoneAreaProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  setTitle: (title: string) => void;
  title: string;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  isUploading: boolean;
}

/**
 * Dropzone Area Component
 * 
 * Provides a file upload area with drag and drop functionality
 */
const DropzoneArea = ({ 
  uploadedFile, 
  setUploadedFile, 
  setTitle, 
  title,
  errorMessage,
  setErrorMessage,
  isUploading
}: DropzoneAreaProps) => {
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
    <div className="space-y-2">
      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive" className="animate-shake">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
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
  );
};

export default DropzoneArea;
