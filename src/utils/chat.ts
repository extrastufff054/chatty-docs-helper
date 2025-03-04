
import { Message } from '@/types/chat';

export const generateChatId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const getChatTitle = (messages: Message[]): string => {
  if (messages.length === 0) return "New Chat";
  
  const firstUserMessage = messages.find(m => m.role === "user");
  if (!firstUserMessage) return "New Chat";
  
  const title = firstUserMessage.content.substring(0, 30);
  return title.length < firstUserMessage.content.length ? `${title}...` : title;
};
