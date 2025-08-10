import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

export interface LoadingIndicatorProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'gray' | 'black' | 'white' | 'primary';
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export default function LoadingIndicator({
  text = 'Carregando...',
  size = 'md',
  color = 'gray',
  className = '',
  variant = 'horizontal'
}: LoadingIndicatorProps) {
  const containerClass = variant === 'horizontal' 
    ? 'flex items-center space-x-2'
    : 'flex flex-col items-center space-y-2';

  return (
    <div className={`${containerClass} ${className}`}>
      <LoadingSpinner size={size} color={color} />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}