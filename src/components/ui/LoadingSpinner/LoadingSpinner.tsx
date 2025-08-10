import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'gray' | 'black' | 'white' | 'primary';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const colorClasses = {
  gray: 'border-gray-400 border-t-transparent',
  black: 'border-black border-t-transparent', 
  white: 'border-white border-t-transparent',
  primary: 'border-blue-500 border-t-transparent'
};

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'gray', 
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <div 
      className={`animate-spin border-2 rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Carregando..."
    />
  );
}