
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import PromptForm from "./PromptForm";

interface CreatePromptFormProps {
  newPrompt: {
    name: string;
    prompt: string;
    temperature: number;
    description: string;
  };
  setNewPrompt: React.Dispatch<React.SetStateAction<any>>;
  handleCreatePrompt: () => Promise<void>;
  isCreating: boolean;
}

/**
 * Create Prompt Form Component
 * 
 * Form specifically for creating new system prompts
 */
const CreatePromptForm: React.FC<CreatePromptFormProps> = ({
  newPrompt,
  setNewPrompt,
  handleCreatePrompt,
  isCreating
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New System Prompt</CardTitle>
        <CardDescription>
          Define how the AI should respond to questions about documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PromptForm
          isCreating={isCreating}
          prompt={newPrompt}
          setPrompt={setNewPrompt}
          onSubmit={handleCreatePrompt}
          submitButtonText="Create System Prompt"
          submitButtonIcon={<PlusCircle className="mr-2 h-4 w-4" />}
        />
      </CardContent>
      <CardFooter>
        {/* Footer is intentionally empty as the submit button is part of the PromptForm */}
      </CardFooter>
    </Card>
  );
};

export default CreatePromptForm;
