
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PromptForm from "./PromptForm";
import { Save } from "lucide-react";

interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  temperature: number;
  description: string;
}

interface PromptCardProps {
  prompt: SystemPrompt;
  editingPrompt: SystemPrompt | null;
  setEditingPrompt: (prompt: SystemPrompt | null) => void;
  isEditing: boolean;
  handleUpdatePrompt: () => Promise<void>;
  handleDeletePrompt: (id: string) => Promise<void>;
}

/**
 * Prompt Card Component
 * 
 * Displays a system prompt with edit and delete functionality
 */
const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  editingPrompt,
  setEditingPrompt,
  isEditing,
  handleUpdatePrompt,
  handleDeletePrompt
}) => {
  const isDefaultPrompt = (promptId: string) => {
    return promptId === 'default' || promptId === 'concise';
  };

  return (
    <Card key={prompt.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{prompt.name}</CardTitle>
            <CardDescription>{prompt.description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            {isDefaultPrompt(prompt.id) && (
              <Badge variant="outline" className="bg-primary/10">Default</Badge>
            )}
            <Badge variant="outline" className="bg-secondary/20">
              Temp: {prompt.temperature.toFixed(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {editingPrompt && editingPrompt.id === prompt.id ? (
          <PromptForm
            isCreating={isEditing}
            prompt={editingPrompt}
            setPrompt={setEditingPrompt}
            onSubmit={handleUpdatePrompt}
            onCancel={() => setEditingPrompt(null)}
            submitButtonText="Save Changes"
            submitButtonIcon={<Save className="h-4 w-4 mr-1" />}
          />
        ) : (
          <div>
            <div className="bg-muted/50 p-3 rounded-md text-sm overflow-auto max-h-[150px]">
              <pre className="whitespace-pre-wrap font-mono text-xs">{prompt.prompt}</pre>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPrompt(prompt)}
                className="hover-scale"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
              {!isDefaultPrompt(prompt.id) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover-scale"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card animate-scale-in">
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the "{prompt.name}" prompt? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="hover-scale"
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptCard;
