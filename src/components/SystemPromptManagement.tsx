
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash, Edit, Save, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { API_BASE_URL } from "@/lib/apiClient";

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
  const [useCustomTemperature, setUseCustomTemperature] = useState(false);
  const [adminApiBaseUrl, setAdminApiBaseUrl] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    // Dynamically determine the admin API base URL
    const apiBaseUrl = API_BASE_URL;
    setAdminApiBaseUrl(`${apiBaseUrl}/admin`);
    
    fetchSystemPrompts();
  }, []);

  const fetchSystemPrompts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${adminApiBaseUrl}/system-prompts`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Check if the response is not JSON (HTML error page)
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        console.error('Received non-JSON response:', await response.text());
        throw new Error(`Received non-JSON response with content type: ${contentType}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch system prompts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setSystemPrompts(data.prompts || []);
    } catch (error) {
      console.error("Error fetching system prompts:", error);
      toast({
        title: "Error fetching system prompts",
        description: `Failed to retrieve system prompts: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      console.log(`Sending POST request to: ${adminApiBaseUrl}/system-prompts`);
      
      const response = await fetch(`${adminApiBaseUrl}/system-prompts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt)
      });
      
      // Check if the response is not JSON (HTML error page)
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Received non-JSON response:', errorText);
        throw new Error(`Server returned ${response.status} with non-JSON response`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create system prompt: ${response.status} ${response.statusText} - ${errorData.error || ''}`);
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
        description: `Failed to create the system prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      const response = await fetch(`${adminApiBaseUrl}/system-prompts/${editingPrompt.id}`, {
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
      
      // Check if the response is not JSON (HTML error page)
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        console.error('Received non-JSON response:', await response.text());
        throw new Error(`Received non-JSON response with content type: ${contentType}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to update system prompt: ${response.status} ${response.statusText}`);
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
        description: `Failed to update the system prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      
      const response = await fetch(`${adminApiBaseUrl}/system-prompts/${promptId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      // Check if the response is not JSON (HTML error page)
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        console.error('Received non-JSON response:', await response.text());
        throw new Error(`Received non-JSON response with content type: ${contentType}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to delete system prompt: ${response.status} ${response.statusText}`);
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
        description: `Failed to delete the system prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const isDefaultPrompt = (promptId: string) => {
    return promptId === 'default' || promptId === 'concise';
  };

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="list">Prompt Library</TabsTrigger>
        <TabsTrigger value="create">Create New Prompt</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">System Prompts</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : systemPrompts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {systemPrompts.map((prompt) => (
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editingPrompt.name}
                          onChange={(e) => setEditingPrompt({...editingPrompt, name: e.target.value})}
                          placeholder="Prompt name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                          value={editingPrompt.description}
                          onChange={(e) => setEditingPrompt({...editingPrompt, description: e.target.value})}
                          placeholder="Brief description"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Temperature</label>
                          <span className="text-sm">{editingPrompt.temperature.toFixed(1)}</span>
                        </div>
                        <Slider
                          value={[editingPrompt.temperature]}
                          min={0}
                          max={1}
                          step={0.1}
                          onValueChange={(value) => setEditingPrompt({...editingPrompt, temperature: value[0]})}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Lower values (0.0) for more precise responses, higher values (1.0) for more creative responses.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prompt Template</label>
                        <Textarea
                          value={editingPrompt.prompt}
                          onChange={(e) => setEditingPrompt({...editingPrompt, prompt: e.target.value})}
                          placeholder="Enter the prompt template..."
                          className="min-h-[150px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use {'{context}'} for document content and {'{question}'} for user query.
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingPrompt(null)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleUpdatePrompt}
                          disabled={isEditing}
                        >
                          {isEditing ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-1" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </div>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No system prompts found. Add some to customize AI responses.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New System Prompt</CardTitle>
            <CardDescription>
              Define how the AI should respond to questions about documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newPrompt.name}
                onChange={(e) => setNewPrompt({...newPrompt, name: e.target.value})}
                placeholder="E.g., Technical Analysis, Academic Summary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newPrompt.description}
                onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
                placeholder="Brief description of this prompt style"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Temperature</label>
                <span className="text-sm">{newPrompt.temperature.toFixed(1)}</span>
              </div>
              <Slider
                value={[newPrompt.temperature]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => setNewPrompt({...newPrompt, temperature: value[0]})}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Temperature 0.0 is recommended for precise responses. Higher values introduce randomness and creativity.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt Template</label>
              <Textarea
                value={newPrompt.prompt}
                onChange={(e) => setNewPrompt({...newPrompt, prompt: e.target.value})}
                placeholder="Enter your system prompt template..."
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Use {'{context}'} to reference document content and {'{question}'} to reference the user's query.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCreatePrompt} 
              className="w-full hover-scale"
              disabled={isCreating || !newPrompt.name || !newPrompt.prompt}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create System Prompt
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SystemPromptManagement;
