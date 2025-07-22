import { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';

interface UserMenuProps {
  userName: string;
  userImage?: string;
}

export default function UserMenu({ userName, userImage }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="flex items-center space-x-3 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <Avatar name={userName} src={userImage} />
          <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></span>
        </div>
        <div className="hidden sm:block text-left">
          <span className="font-medium block">{userName}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <svg 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <a 
              href="#" 
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
            >
              Profile
            </a>
            <a 
              href="#" 
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
            >
              Settings
            </a>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
              onClick={() => {
                setIsOnline(!isOnline);
              }}
            >
              <span>Status: {isOnline ? 'Online' : 'Offline'}</span>
              <span className={`inline-block h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            </button>
            <a 
              href="#" 
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem('chat_history');
                window.location.reload();
              }}
            >
              Clear Chat History
            </a>
            <a 
              href="#" 
              className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}