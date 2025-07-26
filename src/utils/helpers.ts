import { Project, KnowledgeSource, ChatSession, ChatMessage } from '@/types/chat';

/**
 * Generates a unique ID for chat messages
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Simulates a delay to mimic API response time
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock responses for the chatbot
 */
export const mockResponses: string[] = [
  "I&apos;m a smart document-aware assistant. I can help you analyze documents, answer questions, and assist with various tasks. What would you like to know?",
  "That&apos;s an interesting question! Based on the context and any uploaded files, let me provide you with a comprehensive answer.",
  "I understand your query. Let me analyze the available information and provide you with relevant insights.",
  "Thanks for your message! I can help you with document analysis, summarization, translation, and much more. What specific task can I assist you with?",
  "I&apos;m here to help with your document-related questions. Feel free to upload files for me to analyze or ask me anything!",
  "That&apos;s a great question! I can process various file types including PDF, DOCX, and TXT files to provide you with accurate information.",
  "I&apos;m designed to understand context from your uploaded documents and provide intelligent responses. How can I help you today?",
  "I can help you extract key information, summarize content, translate text, and perform various document analysis tasks.",
  "Based on your selected project and knowledge source, I can provide more targeted and relevant responses to your queries.",
  "I&apos;m continuously learning to provide better document analysis and contextual responses. Your feedback helps me improve!"
];

/**
 * Gets a random response from the mock responses
 */
export function getRandomResponse(): string {
  const index = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[index];
}

/**
 * Mock projects data
 */
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Customer Support System',
    description: 'AI-powered customer support and documentation system'
  },
  {
    id: 'project-2',
    name: 'Legal Document Analysis',
    description: 'Legal document review and compliance checking'
  },
  {
    id: 'project-3',
    name: 'Research Assistant',
    description: 'Academic research and literature review assistant'
  },
  {
    id: 'project-4',
    name: 'Content Management',
    description: 'Content creation and management workflows'
  },
  {
    id: 'project-5',
    name: 'Technical Documentation',
    description: 'Technical writing and documentation assistance'
  }
];

/**
 * Mock knowledge sources data
 */
export const mockKnowledgeSources: KnowledgeSource[] = [
  {
    id: 'kb-1',
    name: 'Internal Knowledge Base',
    type: 'database',
    description: 'Company internal documentation and procedures'
  },
  {
    id: 'kb-2',
    name: 'GitHub Repository',
    type: 'repository',
    description: 'Source code and technical documentation'
  },
  {
    id: 'kb-3',
    name: 'Legal Database',
    type: 'database',
    description: 'Legal precedents and regulatory information'
  },
  {
    id: 'kb-4',
    name: 'Research Papers',
    type: 'document',
    description: 'Academic papers and research publications'
  },
  {
    id: 'kb-5',
    name: 'Product Documentation',
    type: 'document',
    description: 'Product manuals and user guides'
  }
];

/**
 * Creates a new chat session
 */
export function createNewSession(): ChatSession {
  const id = generateId();
  return {
    id,
    title: `Chat ${id.slice(0, 8)}`,
    messages: [],
    timestamp: Date.now()
  };
}

/**
 * Generates a summary for a chat session based on its messages
 */
export function generateSessionSummary(messages: ChatMessage[]): string {
  if (messages.length === 0) return 'Empty conversation';
  
  const userMessages = messages.filter(msg => msg.role === 'user');
  if (userMessages.length === 0) return 'No user messages';
  
  const firstMessage = userMessages[0].content;
  return firstMessage.length > 50 ? firstMessage.slice(0, 50) + '...' : firstMessage;
}