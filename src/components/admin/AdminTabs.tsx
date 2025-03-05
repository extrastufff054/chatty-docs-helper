
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, Thermometer } from "lucide-react";
import DocumentManagementPanel from "./DocumentManagementPanel";
import TemperaturePanel from "./TemperaturePanel";
import SystemPromptWrapper from "@/components/SystemPromptWrapper";

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminToken: string;
  documents: any[];
  isLoadingDocuments: boolean;
  handleDeleteDocument: (documentId: string) => Promise<void>;
  availableModels: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  fetchDocuments: () => Promise<void>;
  globalTemperature: number;
  setGlobalTemperature: (temp: number) => void;
}

const AdminTabs = ({
  activeTab,
  setActiveTab,
  adminToken,
  documents,
  isLoadingDocuments,
  handleDeleteDocument,
  availableModels,
  selectedModel,
  setSelectedModel,
  fetchDocuments,
  globalTemperature,
  setGlobalTemperature
}: AdminTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="documents" className="flex gap-2 items-center">
          <FileText className="h-4 w-4" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex gap-2 items-center">
          <Thermometer className="h-4 w-4" />
          Temperature
        </TabsTrigger>
        <TabsTrigger value="advanced" className="flex gap-2 items-center">
          <Settings className="h-4 w-4" />
          System Prompts
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="documents" className="space-y-4">
        <DocumentManagementPanel 
          adminToken={adminToken}
          documents={documents}
          isLoadingDocuments={isLoadingDocuments}
          handleDeleteDocument={handleDeleteDocument}
          availableModels={availableModels}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          fetchDocuments={fetchDocuments}
        />
      </TabsContent>
      
      <TabsContent value="settings" className="animate-fade-in">
        <TemperaturePanel 
          globalTemperature={globalTemperature} 
          setGlobalTemperature={setGlobalTemperature} 
        />
      </TabsContent>
      
      <TabsContent value="advanced" className="animate-fade-in">
        <SystemPromptWrapper adminToken={adminToken} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
