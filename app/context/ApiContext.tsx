'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface ApiContextType {
  apiBaseUrl: string;
  apiHeaders: HeadersInit;
}

const ApiContext = createContext<ApiContextType>({
  apiBaseUrl: '',
  apiHeaders: {},
});

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  // Obtendo a URL base da API da variável de ambiente
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://puca-api.vercel.app';
  
  // Headers padrão para requisições
  const apiHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  return (
    <ApiContext.Provider value={{ apiBaseUrl, apiHeaders }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext); 