
import { cn } from "@/lib/utils";
import { Loader2, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
            {role === "assistant" ? (
              <ReactMarkdown 
                className="prose dark:prose-invert prose-sm max-w-none"
                components={{
                  // Allow all HTML in markdown to ensure personal info is shown
                  p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  a: ({node, ...props}) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  pre: ({node, ...props}) => <pre className="bg-secondary/30 p-2 rounded my-2 overflow-x-auto" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline 
                      ? <code className="bg-secondary/30 px-1 py-0.5 rounded text-xs" {...props} />
                      : <code {...props} />,
                  table: ({node, ...props}) => <table className="border-collapse my-2 text-sm" {...props} />,
                  th: ({node, ...props}) => <th className="border border-border p-2 bg-secondary/30" {...props} />,
                  td: ({node, ...props}) => <td className="border border-border p-2" {...props} />
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              content
            )}
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
