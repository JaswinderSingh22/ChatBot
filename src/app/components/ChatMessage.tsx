import { ChatMessage as ChatMessageType } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import Avatar from './Avatar';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const time = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mr-2 flex-shrink-0 self-end mb-1">
          <Avatar name="AI Assistant" size="sm" />
        </div>
      )}
      <div 
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
        }`}
      >
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {time}
        </div>
      </div>
      {isUser && (
        <div className="ml-2 flex-shrink-0 self-end mb-1">
          <Avatar name="Jaswinder Singh" size="sm" />
        </div>
      )}
    </div>
  );
}