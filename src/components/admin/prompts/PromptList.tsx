
import React from "react";
import { Loader2 } from "lucide-react";
import PromptCard from "./PromptCard";

interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  temperature: number;
  description: string;
}

interface PromptListProps {
  systemPrompts: SystemPrompt[];
  isLoading: boolean;
  editingPrompt: SystemPrompt | null;
  setEditingPrompt: (prompt: SystemPrompt | null) => void;
  isEditing: boolean;
  handleUpdatePrompt: () => Promise<void>;
  handleDeletePrompt: (id: string) => Promise<void>;
}

/**
 * Prompt List Component
 * 
 * Displays a list of system prompts
 */
const PromptList: React.FC<PromptListProps> = ({
  systemPrompts,
  isLoading,
  editingPrompt,
  setEditingPrompt,
  isEditing,
  handleUpdatePrompt,
  handleDeletePrompt
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (systemPrompts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No system prompts found. Add some to customize AI responses.
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {systemPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          editingPrompt={editingPrompt}
          setEditingPrompt={setEditingPrompt}
          isEditing={isEditing}
          handleUpdatePrompt={handleUpdatePrompt}
          handleDeletePrompt={handleDeletePrompt}
        />
      ))}
    </div>
  );
};

export default PromptList;
