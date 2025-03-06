
import React from "react";

interface UploadProgressBarProps {
  uploadProgress: number;
  isUploading: boolean;
}

/**
 * Upload Progress Bar Component
 * 
 * Displays a progress bar for file uploads
 */
const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ 
  uploadProgress, 
  isUploading 
}) => {
  if (!isUploading || uploadProgress <= 0) return null;
  
  return (
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
  );
};

export default UploadProgressBar;
