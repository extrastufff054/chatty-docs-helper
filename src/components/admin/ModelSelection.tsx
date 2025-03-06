
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

interface ModelSelectionProps {
  availableModels: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isUploading: boolean;
}

/**
 * Model Selection Component
 * 
 * Displays a list of AI models for document processing
 */
const ModelSelection: React.FC<ModelSelectionProps> = ({
  availableModels,
  selectedModel,
  setSelectedModel,
  isUploading
}) => {
  return (
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
  );
};

export default ModelSelection;
