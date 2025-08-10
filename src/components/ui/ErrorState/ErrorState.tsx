import React from 'react';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export default function ErrorState({
  message = 'Algo deu errado. Tente novamente.',
  onRetry,
  retryText = 'Tentar Novamente',
  className = '',
  variant = 'default'
}: ErrorStateProps) {
  const containerClass = variant === 'compact' 
    ? 'flex flex-col items-center justify-center py-8'
    : 'flex flex-col items-center justify-center py-32';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-200 rounded-lg max-w-md">
        <p className="text-red-500 text-lg mb-6 text-center">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-md w-full"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}