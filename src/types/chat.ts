
export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  documentId: string;
  documentTitle: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
  systemPromptId: string;
}
