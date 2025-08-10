/**
 * React Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a fallback UI instead of crashing the entire application.
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.group(`🚨 Error Boundary (${level})`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Send error to monitoring service (if you have one)
    if (typeof window !== 'undefined') {
      // Example: Sentry, LogRocket, or custom error reporting
      // errorReportingService.captureException(error, { extra: errorInfo });
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Show toast notification for non-critical errors
    if (level !== 'critical') {
      toast.error('Algo deu errado. Recarregue a página se o problema persistir.');
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (hasError) {
      // Custom fallback provided
      if (fallback) {
        return fallback;
      }

      // Different fallback UIs based on error level
      switch (level) {
        case 'critical':
          return <CriticalErrorFallback onReload={this.handleReload} />;
        case 'page':
          return <PageErrorFallback onRetry={this.handleRetry} onReload={this.handleReload} />;
        default:
          return <ComponentErrorFallback onRetry={this.handleRetry} />;
      }
    }

    return children;
  }
}

// Critical Error Fallback (full page crash)
const CriticalErrorFallback = ({ onReload }: { onReload: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Algo deu errado</h1>
      <p className="text-gray-600 mb-8">
        A aplicação encontrou um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
      </p>
      <div className="space-y-4">
        <button
          onClick={onReload}
          className="w-full bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
        >
          Recarregar Página
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  </div>
);

// Page Level Error Fallback
const PageErrorFallback = ({ 
  onRetry, 
  onReload 
}: { 
  onRetry: () => void; 
  onReload: () => void; 
}) => (
  <div className="flex items-center justify-center min-h-[60vh] p-4">
    <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
      <div className="mb-6">
        <svg
          className="mx-auto h-12 w-12 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Erro na página</h2>
      <p className="text-gray-600 mb-6">
        Esta página encontrou um problema. Tente novamente ou recarregue a página.
      </p>
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          Tentar Novamente
        </button>
        <button
          onClick={onReload}
          className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Recarregar Página
        </button>
      </div>
    </div>
  </div>
);

// Component Level Error Fallback
const ComponentErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
    <div className="flex items-center space-x-3">
      <svg
        className="h-6 w-6 text-yellow-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">
          Erro no componente. 
          <button
            onClick={onRetry}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Tentar novamente
          </button>
        </p>
      </div>
    </div>
  </div>
);

export default ErrorBoundary;