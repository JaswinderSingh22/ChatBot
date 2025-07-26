"use client";

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import WorkflowsPanel from './components/WorkflowsPanel';
import FileUpload from './components/FileUpload';
import UserMenu from './components/UserMenu';
import ThemeToggle from './components/ThemeToggle';
import NotificationBell from './components/NotificationBell';
import { 
  ChatMessage as ChatMessageType, 
  ChatState, 
  ChatSession, 
  UploadedFile
} from '@/types/chat';
import { 
  generateId, 
  delay, 
  getRandomResponse, 
  createNewSession,
  mockProjects,
  mockKnowledgeSources 
} from '@/utils/helpers';

const STORAGE_KEY = 'chat_app_state';

// Suggested prompts for users
const SUGGESTED_PROMPTS = [
  "What can you help me with?",
  "Analyze the uploaded document",
  "Summarize the key points",
  "Extract important dates and deadlines",
  "What are the main action items?",
  "Translate this content",
];

export default function Home() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentSessionId: '',
    sessions: [],
    selectedProject: mockProjects[0].id,
    selectedKnowledgeSource: mockKnowledgeSources[0].id,
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [sidebarView, setSidebarView] = useState<'history' | 'workflows'>('workflows');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setChatState(prevState => ({
          ...prevState,
          ...parsedState,
          isLoading: false, // Reset loading state
        }));
      } catch (error) {
        console.error('Failed to parse saved state:', error);
        // Initialize with a new session if parsing fails
        const newSession = createNewSession();
        setChatState(prevState => ({
          ...prevState,
          currentSessionId: newSession.id,
          sessions: [newSession],
        }));
      }
    } else {
      // Initialize with a new session
      const newSession = createNewSession();
      setChatState(prevState => ({
        ...prevState,
        currentSessionId: newSession.id,
        sessions: [newSession],
      }));
    }
  }, []);

  // Save chat state to localStorage whenever it changes
  useEffect(() => {
    if (chatState.currentSessionId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...chatState,
        isLoading: false, // Don&apos;t persist loading state
      }));
    }
  }, [chatState]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const getCurrentSession = (): ChatSession | undefined => {
    return chatState.sessions.find(session => session.id === chatState.currentSessionId);
  };

  const updateCurrentSession = (updates: Partial<ChatSession>) => {
    setChatState(prevState => ({
      ...prevState,
      sessions: prevState.sessions.map(session =>
        session.id === prevState.currentSessionId
          ? { ...session, ...updates }
          : session
      ),
    }));
  };

  const handleSendMessage = async (content: string) => {
    const currentSession = getCurrentSession();
    if (!currentSession) return;

    // Add user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    const updatedMessages = [...chatState.messages, userMessage];

    setChatState(prevState => ({
      ...prevState,
      messages: updatedMessages,
      isLoading: true,
    }));

    updateCurrentSession({
      messages: updatedMessages,
      timestamp: Date.now(),
    });

    // Simulate API delay
    await delay(1000 + Math.random() * 1000);

    // Generate contextual response
    let responseContent = getRandomResponse();
    
    // Add context based on uploaded files
    if (uploadedFiles.length > 0) {
      const fileNames = uploadedFiles.map(f => f.name).join(', ');
      responseContent = `I can see you've uploaded: ${fileNames}. ${responseContent} I can analyze these files and help you with document-related tasks like summarization, extraction, or translation.`;
    }

    // Add context based on selected project and knowledge source
    const selectedProject = mockProjects.find(p => p.id === chatState.selectedProject);
    const selectedKnowledgeSource = mockKnowledgeSources.find(ks => ks.id === chatState.selectedKnowledgeSource);
    
    if (selectedProject && selectedKnowledgeSource) {
      responseContent += ` I&apos;m currently working within the "${selectedProject.name}" project context and using "${selectedKnowledgeSource.name}" as the knowledge source.`;
    }

    // Add bot response
    const botMessage: ChatMessageType = {
      id: generateId(),
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now(),
    };

    const finalMessages = [...updatedMessages, botMessage];

    setChatState(prevState => ({
      ...prevState,
      messages: finalMessages,
      isLoading: false,
    }));

    updateCurrentSession({
      messages: finalMessages,
      timestamp: Date.now(),
    });

    // Clear uploaded files after sending
    setUploadedFiles([]);
  };

  const handleNewChat = () => {
    const newSession = createNewSession();
    setChatState(prevState => ({
      ...prevState,
      currentSessionId: newSession.id,
      sessions: [...prevState.sessions, newSession],
      messages: [],
    }));
    setUploadedFiles([]);
  };

  const handleSessionSelect = (sessionId: string) => {
    const session = chatState.sessions.find(s => s.id === sessionId);
    if (session) {
      setChatState(prevState => ({
        ...prevState,
        currentSessionId: sessionId,
        messages: session.messages,
      }));
      setUploadedFiles([]);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setChatState(prevState => {
      const updatedSessions = prevState.sessions.filter(s => s.id !== sessionId);
      
      // If we&apos;re deleting the current session, switch to another one or create new
      let newCurrentSessionId = prevState.currentSessionId;
      let newMessages = prevState.messages;
      
      if (sessionId === prevState.currentSessionId) {
        if (updatedSessions.length > 0) {
          const latestSession = updatedSessions.sort((a, b) => b.timestamp - a.timestamp)[0];
          newCurrentSessionId = latestSession.id;
          newMessages = latestSession.messages;
        } else {
          const newSession = createNewSession();
          updatedSessions.push(newSession);
          newCurrentSessionId = newSession.id;
          newMessages = [];
        }
      }
      
      return {
        ...prevState,
        sessions: updatedSessions,
        currentSessionId: newCurrentSessionId,
        messages: newMessages,
      };
    });
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleWorkflowSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Compact Top Header */}
      <header className="glass border-b border-white/20 dark:border-slate-700/50 backdrop-blur-xl">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <UserMenu userName="Jaswinder Singh" />
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Smart Document Chat
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </div>
          
          {/* Compact Controls Bar */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Project Selector */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project:</span>
              </div>
              <select
                value={chatState.selectedProject}
                onChange={(e) => setChatState(prev => ({ ...prev, selectedProject: e.target.value }))}
                className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-lg focus-ring text-sm font-medium backdrop-blur-sm min-w-[180px]"
              >
                {mockProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            {/* Knowledge Source Selector */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Source:</span>
              </div>
              <select
                value={chatState.selectedKnowledgeSource}
                onChange={(e) => setChatState(prev => ({ ...prev, selectedKnowledgeSource: e.target.value }))}
                className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-lg focus-ring text-sm font-medium backdrop-blur-sm min-w-[160px]"
              >
                {mockKnowledgeSources.map(source => (
                  <option key={source.id} value={source.id}>{source.name}</option>
                ))}
              </select>
            </div>

            {/* Compact File Upload */}
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Files:</span>
              </div>
              <FileUpload
                onFilesUploaded={handleFilesUploaded}
                uploadedFiles={uploadedFiles}
                onRemoveFile={handleRemoveFile}
                compact={true}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Left Sidebar */}
        <aside className="w-80 glass border-r border-white/20 dark:border-slate-700/50 flex flex-col backdrop-blur-xl">
          {/* Enhanced Sidebar Navigation */}
          <div className="flex p-1 m-4 bg-gray-100/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setSidebarView('workflows')}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                sidebarView === 'workflows'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Workflows</span>
              </div>
            </button>
            <button
              onClick={() => setSidebarView('history')}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                sidebarView === 'history'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>History</span>
              </div>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            {sidebarView === 'workflows' ? (
              <WorkflowsPanel
                onWorkflowSelect={handleWorkflowSelect}
                isLoading={chatState.isLoading}
              />
            ) : (
              <ChatHistory
                sessions={chatState.sessions}
                currentSessionId={chatState.currentSessionId}
                onSessionSelect={handleSessionSelect}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
              />
            )}
          </div>
        </aside>

        {/* Enhanced Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatState.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-lg animate-fade-in">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-gentle">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse-slow"></div>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                    Welcome to Smart Document Chat!
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    I&apos;m your AI assistant for document analysis and intelligent conversations. 
                    Upload files, select workflows, or just start chatting!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="card p-4 text-center">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Upload Files</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">PDF, DOCX, or TXT</p>
                    </div>
                    <div className="card p-4 text-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Quick Workflows</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">Common tasks</p>
                    </div>
                    <div className="card p-4 text-center">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Switch Context</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">Projects & sources</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {chatState.messages.map(message => (
                  <div key={message.id} className="animate-slide-in">
                    <ChatMessage 
                      message={message} 
                      onEdit={handleSendMessage}
                    />
                  </div>
                ))}
                {chatState.isLoading && (
                  <div className="flex justify-start animate-slide-in">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="message-bubble assistant bg-white/80 dark:bg-slate-800/80 p-4 max-w-xs">
                        <div className="typing-indicator">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">AI is thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 glass border-t border-white/20 dark:border-slate-700/50 backdrop-blur-xl">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={chatState.isLoading}
            />
          </div>
        </main>

        {/* Enhanced Right Sidebar - Suggested Prompts */}
        <aside className="hidden lg:block w-72 glass border-l border-white/20 dark:border-slate-700/50 overflow-y-auto backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">Suggested Prompts</h2>
            </div>
            <div className="space-y-3">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  disabled={chatState.isLoading}
                  className="w-full text-left p-4 card hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:bg-purple-500 transition-colors"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                      {prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}