
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Thermometer } from "lucide-react";
import SystemPromptManagement from "@/components/SystemPromptManagement";
import DefaultSystemPrompts from "@/components/DefaultSystemPrompts";
import TemperatureSlider from "@/components/admin/settings/TemperatureSlider";
import { API_BASE_URL } from "@/config/apiConfig";

/**
 * System Prompt Wrapper Component
 * 
 * Combines the system prompt management with default system prompts and settings
 */
const SystemPromptWrapper = ({ adminToken }: { adminToken: string }) => {
  const [activeTab, setActiveTab] = useState("settings");
  
  // This function will be passed to DefaultSystemPrompts to handle template selection
  const handleSelectPrompt = (promptTemplate: any) => {
    // We can't directly modify SystemPromptManagement, but we can store the
    // selected template in localStorage for it to use
    localStorage.setItem("selectedPromptTemplate", JSON.stringify(promptTemplate));
    
    // Switch to management tab after selecting a template
    setActiveTab("prompts");
    
    // Dispatch a custom event that SystemPromptManagement can listen for
    window.dispatchEvent(new CustomEvent("promptTemplateSelected"));
  };
  
  return (
    <Card className="animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Prompts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <CardContent className="pt-6">
            <TemperatureSlider adminToken={adminToken} defaultTemperature={0} />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="prompts">
          <CardContent className="pt-6">
            <SystemPromptManagement adminToken={adminToken} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SystemPromptWrapper;
