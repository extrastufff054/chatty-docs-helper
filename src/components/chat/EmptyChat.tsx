
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyChatProps {
  selectedDocument: any | null;
  onNewChat: () => void;
  documentsAvailable: boolean;
}

const EmptyChat = ({ selectedDocument, onNewChat, documentsAvailable }: EmptyChatProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-md space-y-4">
        <div className="rounded-full bg-primary/10 p-3 inline-block">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium">Welcome to I4C Chatbot</h3>
        <p className="text-muted-foreground">
          {selectedDocument ? (
            `You're now chatting with "${selectedDocument.title}". Ask any questions about the document.`
          ) : (
            documentsAvailable ? 
              "Select a document from the sidebar to start chatting." : 
              "No documents available. Please ask an admin to upload documents."
          )}
        </p>
        {selectedDocument && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNewChat}
            className="hover-scale"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyChat;
