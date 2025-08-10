"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { useState } from 'react';
import { cacheTime, staleTime } from '../queryKeys';
import { handleComponentError } from '../utils/errorHandling';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Enhanced error handling for queries using standardized utilities
const handleQueryError = (error: unknown) => {
  // Don't show error toast for aborted queries
  if (error instanceof Error && error.name === 'AbortError') {
    return;
  }

  handleComponentError(error, 'React Query', { 
    showToast: true,
    logError: true,
    silent: false 
  });
};

// Enhanced error handling for mutations using standardized utilities
const handleMutationError = (error: unknown) => {
  handleComponentError(error, 'React Query Mutation', { 
    showToast: true,
    logError: true,
    silent: false 
  });
};

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleQueryError,
        }),
        mutationCache: new MutationCache({
          onError: handleMutationError,
        }),
        defaultOptions: {
          queries: {
            // Intelligent cache configuration
            staleTime: staleTime.PRODUCTS, // 10 minutes default
            gcTime: cacheTime.GC_TIME, // 2 hours garbage collection
            
            // Enhanced retry logic
            retry: (failureCount, error: any) => {
              // Never retry on authentication errors
              if (error?.status === 401 || error?.status === 403) {
                return false;
              }
              
              // Never retry on client errors (except timeout and rate limit)
              if (error?.status >= 400 && error?.status < 500 && 
                  error?.status !== 408 && error?.status !== 429) {
                return false;
              }
              
              // Retry up to 3 times for server errors and network issues
              return failureCount < 3;
            },
            
            // Exponential backoff with jitter
            retryDelay: (attemptIndex) => {
              const baseDelay = 1000 * Math.pow(2, attemptIndex);
              const jitter = Math.random() * 0.1 * baseDelay;
              return Math.min(baseDelay + jitter, 30000);
            },

            // Optimized refetch behavior
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false, // Rely on stale time instead
            refetchInterval: false,
            
            // Network configuration
            networkMode: 'online',
            
            // Structure preserved data during background updates
            structuralSharing: true,
          },
          
          mutations: {
            // Enhanced mutation configuration
            retry: (failureCount, error: any) => {
              // Never retry authentication errors
              if (error?.status === 401 || error?.status === 403) {
                return false;
              }
              
              // Retry once on server errors
              if (error?.status >= 500) {
                return failureCount < 1;
              }
              
              return false;
            },
            
            retryDelay: 1000,
            networkMode: 'online',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 