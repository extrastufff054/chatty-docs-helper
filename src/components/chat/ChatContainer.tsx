
import { useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import { Message } from "@/types/chat";

interface ChatContainerProps {
  messages: Message[];
  streamingContent: string;
}

const ChatContainer = ({ messages, streamingContent }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-auto mb-4 pr-2 scrollbar-track rounded-md">
      <div className="space-y-4 p-2">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            role={message.role} 
            content={message.content} 
          />
        ))}
        
        {streamingContent && (
          <ChatMessage 
            role="assistant" 
            content={streamingContent} 
            isStreaming={true} 
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
