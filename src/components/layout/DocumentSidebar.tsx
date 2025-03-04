
import { FileText, FileUp } from "lucide-react";
import { SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Document } from "@/api/documents";

interface DocumentSidebarProps {
  documents: Document[];
  selectedDocument: Document | null;
  isLoadingDocuments: boolean;
  onDocumentSelect: (document: Document) => void;
}

const DocumentSidebar = ({
  documents,
  selectedDocument,
  isLoadingDocuments,
  onDocumentSelect
}: DocumentSidebarProps) => {
  return (
    <SidebarContent className="animate-slide-in-left">
      <SidebarGroup>
        <SidebarGroupLabel className="font-medium">Documents</SidebarGroupLabel>
        <SidebarGroupContent>
          {isLoadingDocuments ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="relative h-16 w-16">
                <div className="absolute animate-float">
                  <FileUp className="h-12 w-12 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Loading documents...</p>
            </div>
          ) : documents.length > 0 ? (
            <SidebarMenu>
              {documents.map(doc => (
                <SidebarMenuItem key={doc.id} className="transition-all">
                  <SidebarMenuButton asChild onClick={() => onDocumentSelect(doc)}>
                    <div className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all ${
                      selectedDocument?.id === doc.id ? 'bg-accent/70' : ''
                    }`}>
                      <FileText className="h-4 w-4 transition-transform" />
                      <span className="truncate">{doc.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          ) : (
            <div className="text-sm text-muted-foreground p-4 text-center">
              No documents available
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>

      {selectedDocument && (
        <SidebarGroup>
          <SidebarGroupLabel className="font-medium">Current Document</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-3 bg-accent/30 rounded-md">
              <h3 className="text-sm font-medium mb-1">{selectedDocument.title}</h3>
              {selectedDocument.description && (
                <p className="text-xs text-muted-foreground">{selectedDocument.description}</p>
              )}
              <div className="mt-2 text-xs flex items-center">
                <span className="text-muted-foreground">Model:</span>
                <span className="ml-1 text-primary font-medium">{selectedDocument.model}</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
  );
};

export default DocumentSidebar;
