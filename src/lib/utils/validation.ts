/**
 * validation.ts - Utilitário para validação de dados
 * 
 * Este módulo implementa funções para validar diferentes tipos de dados,
 * como emails, senhas e formatos comuns utilizados no front-end.
 */

/**
 * Verifica se um email é válido
 */
export const isValidEmail = (email: string): boolean => {
  // Regex complexa para validação de emails conforme RFC 5322
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Verifica se uma senha cumpre os requisitos mínimos de segurança:
 * - Pelo menos 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos uma letra minúscula
 * - Pelo menos um número
 * - Pelo menos um caractere especial
 */
export const isValidPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

/**
 * Avalia a força da senha e retorna uma pontuação de 0 a 100
 */
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let score = 0;
  
  // Comprimento básico
  score += Math.min(password.length * 4, 40);
  
  // Complexidade de caracteres
  const upperCase = (password.match(/[A-Z]/g) || []).length;
  const lowerCase = (password.match(/[a-z]/g) || []).length;
  const numbers = (password.match(/[0-9]/g) || []).length;
  const symbols = (password.match(/[^A-Za-z0-9]/g) || []).length;
  
  // Pontuação por variedade
  if (upperCase > 0) score += 10;
  if (lowerCase > 0) score += 10;
  if (numbers > 0) score += 10;
  if (symbols > 0) score += 15;
  
  // Pontuação por distribuição
  const unique = new Set(password.split('')).size;
  score += Math.min(unique * 2, 15);
  
  return Math.min(score, 100);
};

/**
 * Verifica se um número de celular brasileiro é válido
 */
export const isValidBrazilianPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Verifica se um CPF é válido
 */
export const isValidCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação dos dígitos
  let sum = 0;
  let remainder;
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
}; 