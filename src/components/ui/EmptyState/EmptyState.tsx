import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-32 ${className}`}>
      <div className="text-center max-w-md">
        {icon && (
          <div className="flex justify-center mb-6 text-gray-400">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 mb-6">
            {description}
          </p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-md"
          >
            {action.text}
          </button>
        )}
      </div>
    </div>
  );
}