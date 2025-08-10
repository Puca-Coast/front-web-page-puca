/**
 * Standardized Error Handling Utilities
 * 
 * Provides consistent error handling patterns across the application
 */

import { toast } from 'react-toastify';

// Standard error interface
export interface AppError extends Error {
  status?: number;
  code?: string;
  context?: string;
  recovery?: {
    action: string;
    handler: () => void;
  };
}

// Error type constants
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

// Error status categories
export const ErrorCategories = {
  CLIENT: (status: number) => status >= 400 && status < 500,
  SERVER: (status: number) => status >= 500,
  AUTH: (status: number) => status === 401 || status === 403,
  NOT_FOUND: (status: number) => status === 404,
} as const;

/**
 * Type guard for API errors
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof Error;
};

/**
 * Extract error information from various error types
 */
export const extractErrorInfo = (error: unknown) => {
  let status: number | undefined;
  let message: string = 'Algo deu errado. Tente novamente.';
  let code: string | undefined;

  if (error instanceof Error) {
    message = error.message;
    
    // Check for API error properties
    if ('status' in error) {
      status = (error as any).status;
    }
    if ('response' in error && (error as any).response?.status) {
      status = (error as any).response.status;
    }
    if ('code' in error) {
      code = (error as any).code;
    }
  }

  return { status, message, code };
};

/**
 * Categorize errors for consistent handling
 */
export const categorizeError = (status?: number, code?: string) => {
  if (!status && code === 'NETWORK_ERROR') {
    return ErrorTypes.NETWORK;
  }
  
  if (status) {
    if (ErrorCategories.AUTH(status)) return ErrorTypes.AUTH;
    if (ErrorCategories.NOT_FOUND(status)) return ErrorTypes.NOT_FOUND;
    if (ErrorCategories.SERVER(status)) return ErrorTypes.SERVER;
    if (ErrorCategories.CLIENT(status)) return ErrorTypes.VALIDATION;
  }

  return ErrorTypes.UNKNOWN;
};

/**
 * Get user-friendly error messages
 */
export const getErrorMessage = (type: string, status?: number) => {
  switch (type) {
    case ErrorTypes.NETWORK:
      return 'Problema de conexão. Verifique sua internet e tente novamente.';
    case ErrorTypes.AUTH:
      return 'Sessão expirada. Faça login novamente.';
    case ErrorTypes.NOT_FOUND:
      return 'Conteúdo não encontrado.';
    case ErrorTypes.SERVER:
      return 'Erro interno do servidor. Tente novamente em alguns minutos.';
    case ErrorTypes.VALIDATION:
      return 'Dados inválidos. Verifique as informações e tente novamente.';
    default:
      return 'Algo deu errado. Tente novamente.';
  }
};

/**
 * Standardized error handler for components
 */
export const handleComponentError = (
  error: unknown,
  context?: string,
  options: {
    showToast?: boolean;
    logError?: boolean;
    silent?: boolean;
  } = {}
) => {
  const { showToast = true, logError = true, silent = false } = options;
  
  const { status, message, code } = extractErrorInfo(error);
  const errorType = categorizeError(status, code);
  
  // Log error for debugging
  if (logError) {
    console.error(`Error in ${context || 'component'}:`, {
      error,
      status,
      code,
      type: errorType,
    });
  }

  // Don't show toast for auth errors (handled by auth context) or silent mode
  if (silent || errorType === ErrorTypes.AUTH) {
    return { status, message, code, type: errorType };
  }

  // Show user-friendly toast
  if (showToast) {
    const userMessage = getErrorMessage(errorType, status);
    toast.error(userMessage);
  }

  return { status, message, code, type: errorType };
};

/**
 * Enhanced error boundary error handler
 */
export const handleBoundaryError = (
  error: Error,
  errorInfo: { componentStack: string },
  level: 'page' | 'component' | 'critical' = 'component'
) => {
  const errorDetails = {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    level,
    timestamp: new Date().toISOString(),
  };

  // Log error for debugging
  console.group(`🚨 Error Boundary (${level})`);
  console.error('Error:', error);
  console.error('Component Stack:', errorInfo.componentStack);
  console.groupEnd();

  // Send to monitoring service (when available)
  if (typeof window !== 'undefined' && level === 'critical') {
    // Example: errorReportingService.captureException(error, { extra: errorDetails });
  }

  // Show appropriate user feedback
  if (level !== 'critical') {
    toast.error('Algo deu errado. Recarregue a página se o problema persistir.');
  }

  return errorDetails;
};

/**
 * Retry function with exponential backoff
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000,
  backoff: number = 2
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) {
      throw error;
    }

    const { status } = extractErrorInfo(error);
    
    // Don't retry client errors (except timeout and rate limit)
    if (status && ErrorCategories.CLIENT(status) && status !== 408 && status !== 429) {
      throw error;
    }

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return withRetry(fn, attempts - 1, delay * backoff, backoff);
  }
};

/**
 * Safe async function wrapper that handles errors gracefully
 */
export const safeAsync = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  fallbackValue?: R
) => {
  return async (...args: T): Promise<R | typeof fallbackValue> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleComponentError(error, fn.name || 'async function');
      return fallbackValue as R;
    }
  };
};