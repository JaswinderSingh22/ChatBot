export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  files?: UploadedFile[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
  summary?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  currentSessionId: string;
  sessions: ChatSession[];
  selectedProject: string;
  selectedKnowledgeSource: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'database' | 'repository' | 'document';
  description: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}