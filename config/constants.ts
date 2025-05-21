/**
 * Constantes da aplicação
 * 
 * Este arquivo centraliza todas as constantes utilizadas na aplicação,
 * facilitando a manutenção e evitando valores mágicos espalhados pelo código.
 */

// Regex para validação
export const REGEX = {
  EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PHONE: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
  PASSWORD_STRENGTH: {
    WEAK: /^.{1,7}$/,
    MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
  }
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Por favor, insira um email válido',
  INVALID_PASSWORD: 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais',
  PASSWORDS_DONT_MATCH: 'As senhas não correspondem',
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_PHONE: 'Por favor, insira um número de telefone válido',
  SESSION_EXPIRED: 'Sua sessão expirou. Por favor, faça login novamente',
  UNAUTHORIZED: 'Acesso não autorizado',
  NETWORK_ERROR: 'Erro de conexão. Por favor, verifique sua internet e tente novamente'
};

// Tamanhos de produtos
export const PRODUCT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

// Status de pedidos
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Métodos de pagamento
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  BANK_SLIP: 'bank_slip'
}; 