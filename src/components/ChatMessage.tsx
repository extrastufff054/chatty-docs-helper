
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
          "rounded-lg px-4 py-2 max-w-[85%]",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <Loader2 className="h-4 w-4 inline ml-1 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
