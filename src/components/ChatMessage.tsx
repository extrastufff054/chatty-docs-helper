
import { cn } from "@/lib/utils";
import { Loader2, User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const ChatMessage = ({ role, content, isStreaming = false }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[85%] flex gap-3 transition-all",
          role === "user"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-card dark:bg-secondary/50 shadow-sm border border-border/40"
        )}
      >
        {role === "assistant" && (
          <div className="flex-shrink-0 mt-1">
            <Bot className="h-5 w-5 text-primary" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
            {isStreaming && (
              <Loader2 className="h-4 w-4 inline ml-1 animate-spin text-primary" />
            )}
          </div>
        </div>
        
        {role === "user" && (
          <div className="flex-shrink-0 mt-1">
            <User className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
