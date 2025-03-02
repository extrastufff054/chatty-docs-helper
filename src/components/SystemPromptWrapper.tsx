
import React, { useState } from "react";
import SystemPromptManagement from "@/components/SystemPromptManagement";
import DefaultSystemPrompts from "@/components/DefaultSystemPrompts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * System Prompt Wrapper Component
 * 
 * Combines the system prompt management with default system prompts
 */
const SystemPromptWrapper = ({ adminToken }: { adminToken: string }) => {
  const [activeTab, setActiveTab] = useState("manage");
  
  // This function will be passed to DefaultSystemPrompts to handle template selection
  const handleSelectPrompt = (promptTemplate: any) => {
    // We can't directly modify SystemPromptManagement, but we can store the
    // selected template in localStorage for it to use
    localStorage.setItem("selectedPromptTemplate", JSON.stringify(promptTemplate));
    
    // Switch to management tab after selecting a template
    setActiveTab("manage");
    
    // Dispatch a custom event that SystemPromptManagement can listen for
    window.dispatchEvent(new CustomEvent("promptTemplateSelected"));
  };
  
  return (
    <Card className="animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="manage">Manage Prompts</TabsTrigger>
          <TabsTrigger value="templates">Default Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage">
          <CardContent className="pt-6">
            <SystemPromptManagement adminToken={adminToken} />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="templates">
          <CardContent className="pt-6">
            <DefaultSystemPrompts onSelectPrompt={handleSelectPrompt} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SystemPromptWrapper;
