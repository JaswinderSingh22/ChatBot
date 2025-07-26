import { ChatMessage as ChatMessageType } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import Avatar from './Avatar';
import { useState } from 'react';

interface ChatMessageProps {
  message: ChatMessageType;
  onEdit?: (content: string) => void;
}

export default function ChatMessage({ message, onEdit }: ChatMessageProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  const isUser = message.role === 'user';
  const time = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };
  
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mr-3 flex-shrink-0 self-end mb-1">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      )}
      <div 
        className={`max-w-[75%] message-bubble group ${
          isUser 
            ? 'user bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
            : 'assistant bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 shadow-lg backdrop-blur-sm'
        } p-5 relative`}
      >
        {/* File attachments for user messages */}
        {isUser && message.files && message.files.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs text-blue-100 font-semibold flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span>Attached files:</span>
            </p>
            {message.files.map((file) => (
              <div key={file.id} className="flex items-center space-x-2 text-xs text-blue-100 bg-blue-600/30 rounded-lg p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus-ring resize-none"
              rows={4}
              placeholder="Edit your message..."
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveEdit}
                className="btn-primary px-4 py-2 text-sm font-medium rounded-lg"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn-secondary px-4 py-2 text-sm font-medium rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Enhanced styling for markdown elements
                h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-current">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-current">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-2 text-current">{children}</h3>,
                p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-current">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-current">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-current">{children}</ol>,
                li: ({ children }) => <li className="text-current">{children}</li>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className={`px-2 py-1 rounded-md text-sm font-mono ${
                      isUser 
                        ? 'bg-blue-600/30 text-blue-100' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {children}
                    </code>
                  ) : (
                    <pre className={`p-4 rounded-lg overflow-x-auto my-3 ${
                      isUser 
                        ? 'bg-blue-600/30 text-blue-100' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <code className="text-sm font-mono text-current">{children}</code>
                    </pre>
                  );
                },
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`hover:underline font-medium ${
                      isUser 
                        ? 'text-blue-100 hover:text-white' 
                        : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                    }`}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Enhanced action buttons */}
        {!isEditing && (
          <div className={`flex items-center justify-between mt-4 pt-3 ${
            isUser 
              ? 'border-t border-blue-400/30' 
              : 'border-t border-gray-200 dark:border-gray-600'
          }`}>
            <div className="flex items-center space-x-1">
              {/* Copy button for all messages */}
              <button
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isUser 
                    ? 'text-blue-100 hover:text-white hover:bg-blue-600/30' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Copy message"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {/* Edit button for user messages */}
              {isUser && onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110 text-blue-100 hover:text-white hover:bg-blue-600/30"
                  title="Edit message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {/* Feedback buttons for assistant messages */}
              {!isUser && (
                <>
                  <button
                    onClick={() => handleFeedback('up')}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      feedback === 'up' 
                        ? 'text-green-500 bg-green-100 dark:bg-green-900/30' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                    title="Good response"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleFeedback('down')}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      feedback === 'down' 
                        ? 'text-red-500 bg-red-100 dark:bg-red-900/30' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
                    }`}
                    title="Poor response"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            <div className={`text-xs font-medium ${
              isUser 
                ? 'text-blue-100/80' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {time}
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div className="ml-3 flex-shrink-0 self-end mb-1">
          <Avatar name="Jaswinder Singh" size="sm" />
        </div>
      )}
    </div>
  );
}