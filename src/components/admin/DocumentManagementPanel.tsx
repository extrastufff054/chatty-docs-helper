
import DocumentUpload from "@/components/admin/DocumentUpload";
import DocumentsList from "@/components/admin/DocumentsList";

interface DocumentManagementPanelProps {
  adminToken: string;
  documents: any[];
  isLoadingDocuments: boolean;
  handleDeleteDocument: (documentId: string) => Promise<void>;
  availableModels: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  fetchDocuments: () => Promise<void>;
}

const DocumentManagementPanel = ({ 
  adminToken, 
  documents, 
  isLoadingDocuments, 
  handleDeleteDocument,
  availableModels,
  selectedModel,
  setSelectedModel,
  fetchDocuments
}: DocumentManagementPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Upload Form */}
      <DocumentUpload 
        adminToken={adminToken}
        availableModels={availableModels}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        fetchDocuments={fetchDocuments}
      />
      
      {/* Documents Table */}
      <DocumentsList 
        documents={documents}
        isLoadingDocuments={isLoadingDocuments}
        adminToken={adminToken}
        handleDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};

export default DocumentManagementPanel;
