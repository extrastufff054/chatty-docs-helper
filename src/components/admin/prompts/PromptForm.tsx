
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2, PlusCircle, Save, X, Thermometer } from "lucide-react";

interface PromptFormProps {
  isCreating: boolean;
  prompt: {
    id?: string;
    name: string;
    prompt: string;
    temperature: number;
    description: string;
  };
  setPrompt: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => Promise<void>;
  onCancel?: () => void;
  submitButtonText: string;
  submitButtonIcon: React.ReactNode;
}

/**
 * Prompt Form Component
 * 
 * Reusable form for creating and editing system prompts
 */
const PromptForm: React.FC<PromptFormProps> = ({
  isCreating,
  prompt,
  setPrompt,
  onSubmit,
  onCancel,
  submitButtonText,
  submitButtonIcon
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={prompt.name}
          onChange={(e) => setPrompt({...prompt, name: e.target.value})}
          placeholder="E.g., Technical Analysis, Academic Summary"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          value={prompt.description}
          onChange={(e) => setPrompt({...prompt, description: e.target.value})}
          placeholder="Brief description of this prompt style"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium flex items-center gap-1">
            <Thermometer className="h-4 w-4" />
            Temperature
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm">{prompt.temperature.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              {prompt.temperature < 0.3 ? "(More precise)" : prompt.temperature > 0.7 ? "(More creative)" : "(Balanced)"}
            </span>
          </div>
        </div>
        <Slider
          value={[prompt.temperature]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={(value) => setPrompt({...prompt, temperature: value[0]})}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Lower values (0.0) for more precise responses, higher values (1.0) for more creative responses.
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Prompt Template</label>
        <Textarea
          value={prompt.prompt}
          onChange={(e) => setPrompt({...prompt, prompt: e.target.value})}
          placeholder="Enter your system prompt template..."
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          Use {'{context}'} to reference document content and {'{question}'} to reference the user's query.
        </p>
      </div>
      
      {onCancel && (
        <div className="flex space-x-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={onSubmit}
            disabled={isCreating || !prompt.name || !prompt.prompt}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              submitButtonIcon
            )}
            {submitButtonText}
          </Button>
        </div>
      )}
      
      {!onCancel && (
        <Button 
          onClick={onSubmit} 
          className="w-full hover-scale"
          disabled={isCreating || !prompt.name || !prompt.prompt}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              {submitButtonIcon || <PlusCircle className="mr-2 h-4 w-4" />}
              {submitButtonText}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PromptForm;
