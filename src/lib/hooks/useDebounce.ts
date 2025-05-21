"use client";

import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce em valores.
 * Útil para inputs de pesquisa e outras operações que precisam ser atrasadas.
 * 
 * @param value O valor a ser debounced
 * @param delay O tempo de delay em milissegundos
 * @returns O valor após o período de delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 