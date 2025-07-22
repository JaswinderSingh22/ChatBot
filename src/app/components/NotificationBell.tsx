"use client";

import { useState } from 'react';

export default function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
    if (hasNotifications) {
      setHasNotifications(false);
    }
  };
  
  return (
    <div className="relative">
      <button 
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
        onClick={handleClick}
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {hasNotifications && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="p-3 border-b dark:border-gray-700">
            <h3 className="text-sm font-medium">Notifications</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {hasNotifications ? (
              <div className="p-4 border-b dark:border-gray-700">
                <p className="text-sm">Welcome to the Chat Assistant! Start a conversation below.</p>
                <p className="text-xs text-gray-500 mt-1">Just now</p>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            )}
          </div>
          <div className="p-2 border-t dark:border-gray-700">
            <button 
              className="w-full text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-center"
              onClick={() => setIsOpen(false)}
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}