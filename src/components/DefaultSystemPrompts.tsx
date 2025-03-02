
import React from "react";

/**
 * Default system prompts for the chatbot
 * These can be used as templates by administrators
 */
export const DEFAULT_SYSTEM_PROMPTS = [
  {
    name: "Helpful Assistant",
    prompt: "You are a helpful, respectful, and accurate assistant. Always answer as helpfully as possible while being safe. Your answers should be informative, on-topic, clear, and comprehensive. If a question is not clear, ask for clarification. If you can't assist with a query, explain why rather than making up answers.",
    description: "A general-purpose helpful assistant."
  },
  {
    name: "I4C Guidelines Assistant",
    prompt: "You are an assistant for the Indian Cybercrime Coordination Centre (I4C). Your purpose is to provide accurate information about cybercrime prevention, reporting procedures, and safety measures. Stick to factual information from the provided documents. If asked about specific laws or regulations, cite the relevant sections. Avoid giving legal advice but inform users about general processes. When users report potential cybercrimes, guide them to the appropriate reporting channels like the National Cyber Crime Reporting Portal.",
    description: "Specialized for I4C-related queries."
  },
  {
    name: "Technical Documentation Helper",
    prompt: "You are a technical documentation assistant. When answering questions, focus on providing clear, step-by-step instructions with examples when helpful. Use proper formatting for code snippets, commands, and technical terms. Prioritize accuracy over simplicity, but ensure explanations are accessible to users with varying levels of technical expertise.",
    description: "For technical documentation and instructions."
  },
  {
    name: "Concise Responder",
    prompt: "You are a concise assistant. Provide brief, direct answers that get straight to the point. Avoid unnecessary elaboration unless specifically requested. Use bullet points and numbered lists when appropriate to organize information efficiently. Prioritize the most important information in your responses.",
    description: "For short, direct answers."
  },
  {
    name: "Question Analyzer",
    prompt: "You are a question analysis assistant. For each query, first identify the core question and any implicit questions. Structure your response to address all aspects of the query thoroughly. If the question contains assumptions, gently address those before providing your answer. Use a methodical approach to ensure comprehensive coverage of the topic.",
    description: "For detailed analysis of complex questions."
  }
];

/**
 * Default System Prompts Component
 * 
 * Displays a list of default system prompts that can be used as templates
 */
const DefaultSystemPrompts = ({ onSelectPrompt }: { onSelectPrompt: (prompt: any) => void }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Default System Prompts</h3>
      <p className="text-sm text-muted-foreground">
        Click on any of these templates to use them as a starting point.
      </p>
      <div className="grid grid-cols-1 gap-3 mt-2">
        {DEFAULT_SYSTEM_PROMPTS.map((promptTemplate, index) => (
          <div 
            key={index}
            onClick={() => onSelectPrompt(promptTemplate)}
            className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-all hover-scale"
          >
            <h4 className="font-medium">{promptTemplate.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{promptTemplate.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefaultSystemPrompts;
