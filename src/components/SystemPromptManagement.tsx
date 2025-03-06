import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/config/apiConfig";
import PromptList from "./admin/prompts/PromptList";
import CreatePromptForm from "./admin/prompts/CreatePromptForm";

interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  temperature: number;
  description: string;
}

interface SystemPromptManagementProps {
  adminToken: string;
}

/**
 * System Prompt Management Component
 * 
 * Provides functionality to manage system prompts for the AI
 */
const SystemPromptManagement = ({ adminToken }: SystemPromptManagementProps) => {
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [newPrompt, setNewPrompt] = useState<{
    name: string;
    prompt: string;
    temperature: number;
    description: string;
  }>({
    name: "",
    prompt: "",
    temperature: 0,
    description: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();
  const ADMIN_API_BASE_URL = `${API_BASE_URL}/admin`;

  useEffect(() => {
    fetchSystemPrompts();
  }, []);

  const fetchSystemPrompts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/system-prompts`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch system prompts");
      }
      
      const data = await response.json();
      setSystemPrompts(data.prompts || []);
    } catch (error) {
      console.error("Error fetching system prompts:", error);
      toast({
        title: "Error fetching system prompts",
        description: "Failed to retrieve system prompts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePrompt = async () => {
    if (!newPrompt.name || !newPrompt.prompt) {
      toast({
        title: "Missing information",
        description: "Please provide a name and prompt template.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/system-prompts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create system prompt");
      }
      
      await response.json();
      
      toast({
        title: "System prompt created",
        description: "The system prompt has been created successfully.",
      });
      
      setNewPrompt({
        name: "",
        prompt: "",
        temperature: 0,
        description: "",
      });
      setIsDialogOpen(false);
      fetchSystemPrompts();
    } catch (error) {
      console.error("Error creating system prompt:", error);
      toast({
        title: "Error creating system prompt",
        description: "Failed to create the system prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePrompt = async () => {
    if (!editingPrompt || !editingPrompt.name || !editingPrompt.prompt) {
      toast({
        title: "Missing information",
        description: "Please provide a name and prompt template.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEditing(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/system-prompts/${editingPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingPrompt.name,
          prompt: editingPrompt.prompt,
          temperature: editingPrompt.temperature,
          description: editingPrompt.description,
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update system prompt");
      }
      
      await response.json();
      
      toast({
        title: "System prompt updated",
        description: "The system prompt has been updated successfully.",
      });
      
      setEditingPrompt(null);
      fetchSystemPrompts();
    } catch (error) {
      console.error("Error updating system prompt:", error);
      toast({
        title: "Error updating system prompt",
        description: "Failed to update the system prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      if (promptId === 'default' || promptId === 'concise') {
        toast({
          title: "Cannot delete default prompts",
          description: "The default system prompts cannot be deleted.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(`${ADMIN_API_BASE_URL}/system-prompts/${promptId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete system prompt");
      }
      
      toast({
        title: "System prompt deleted",
        description: "The system prompt has been deleted successfully.",
      });
      
      fetchSystemPrompts();
    } catch (error) {
      console.error("Error deleting system prompt:", error);
      toast({
        title: "Error deleting system prompt",
        description: "Failed to delete the system prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="list">Saved Prompts</TabsTrigger>
        <TabsTrigger value="create">Create Prompt</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">System Prompts</h2>
        </div>
        
        <PromptList
          systemPrompts={systemPrompts}
          isLoading={isLoading}
          editingPrompt={editingPrompt}
          setEditingPrompt={setEditingPrompt}
          isEditing={isEditing}
          handleUpdatePrompt={handleUpdatePrompt}
          handleDeletePrompt={handleDeletePrompt}
        />
      </TabsContent>
      
      <TabsContent value="create">
        <CreatePromptForm
          newPrompt={newPrompt}
          setNewPrompt={setNewPrompt}
          handleCreatePrompt={handleCreatePrompt}
          isCreating={isCreating}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SystemPromptManagement;
