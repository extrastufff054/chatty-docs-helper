
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  isLoading: boolean;
  isDisabled: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ isLoading, isDisabled, onSendMessage }: ChatInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    onSendMessage(prompt);
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 bg-card/50 p-2 rounded-lg backdrop-blur-sm border border-border/30">
      <Input
        placeholder="Type your question here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading || isDisabled}
        className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4"
      />
      <Button 
        type="submit" 
        disabled={isLoading || isDisabled || !prompt.trim()}
        className="shrink-0 rounded-full transition-all hover:scale-105"
        variant="default"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default ChatInput;
