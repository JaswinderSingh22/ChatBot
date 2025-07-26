import { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

export default function Avatar({ name, size = 'md', src }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Determine size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };
  
  // Show image if provided and no error, otherwise show initials
  return (
    <div 
      className={`rounded-full flex items-center justify-center font-semibold ${sizeClasses[size]} ${
        !src || imageError ? 'bg-blue-500 text-white' : ''
      }`}
    >
      {src && !imageError ? (
        <Image 
          src={src} 
          alt={`${name}&apos;s avatar`} 
          width={48}
          height={48}
          className="h-full w-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}