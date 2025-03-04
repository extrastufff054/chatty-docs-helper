
import { MessageSquare, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatSession } from "@/types/chat";

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSwitchChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, e?: React.MouseEvent) => void;
  onNewChat: () => void;
  selectedDocument: any | null;
}

const ChatHistory = ({
  chatSessions,
  activeChatId,
  onSwitchChat,
  onDeleteChat,
  onNewChat,
  selectedDocument
}: ChatHistoryProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Chat History</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewChat}
          disabled={!selectedDocument}
          className="hover-scale"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Chat
        </Button>
      </div>
      
      <div className="space-y-2">
        {chatSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chats yet</p>
          </div>
        ) : (
          chatSessions.map(chat => (
            <div 
              key={chat.id} 
              className={`p-3 rounded-md cursor-pointer transition-all hover:bg-accent/50 ${
                activeChatId === chat.id ? 'bg-accent/70' : ''
              }`}
              onClick={() => onSwitchChat(chat.id)}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm line-clamp-1">{chat.title}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={(e) => onDeleteChat(chat.id, e)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="outline" className="text-xs font-normal truncate max-w-[120px]">
                  {chat.documentTitle}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(chat.lastMessageAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
