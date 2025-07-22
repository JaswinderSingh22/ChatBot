"use client";

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import UserMenu from './components/UserMenu';
import ThemeToggle from './components/ThemeToggle';
import NotificationBell from './components/NotificationBell';
import { ChatMessage as ChatMessageType, ChatState } from '@/types/chat';
import { generateId, delay, getRandomResponse } from '@/utils/helpers';

const STORAGE_KEY = 'chat_history';

// Suggested prompts for users
const SUGGESTED_PROMPTS = [
  "What can you help me with?",
  "Tell me about yourself",
  "How does this chat work?",
  "What features do you have?",
];

export default function Home() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        setChatState(prevState => ({
          ...prevState,
          messages: parsedChat.messages || [],
        }));
      } catch (error) {
        console.error('Failed to parse saved chat:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages: chatState.messages,
    }));
  }, [chatState.messages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setChatState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, userMessage],
      isLoading: true,
    }));

    // Simulate API delay
    await delay(1000);

    // Add bot response
    const botMessage: ChatMessageType = {
      id: generateId(),
      role: 'assistant',
      content: getRandomResponse(),
      timestamp: Date.now(),
    };

    setChatState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, botMessage],
      isLoading: false,
    }));
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
        <UserMenu userName="Jaswinder Singh" />
        <h1 className="text-xl font-bold hidden sm:block">Chat Assistant</h1>
        <div className="flex items-center space-x-2">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {chatState.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p className="mb-4">👋 Welcome to the Chat Assistant!</p>
                  <p>Start a conversation by typing a message below.</p>
                </div>
              </div>
            ) : (
              chatState.messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={chatState.isLoading}
          />
        </main>

        {/* Suggested prompts sidebar */}
        <aside className="hidden md:block w-64 p-4 border-l dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
          <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Suggested Prompts</h2>
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPrompt(prompt)}
                disabled={chatState.isLoading}
                className="w-full text-left p-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}