# Correções de Deploy - Netlify

## Problema
O deploy no Netlify estava falando com os seguintes erros:
```
Module not found: Can't resolve '@/config/constants'
Module not found: Can't resolve '@/config/environment'
```

## Solução Implementada

### 1. Movimentação dos Arquivos de Configuração
- Moveu `config/constants.ts` para `src/config/constants.ts`
- Moveu `config/environment.ts` para `src/config/environment.ts`

### 2. Atualização das Configurações
- Removeu aliases desnecessários no `next.config.mjs`
- Removeu paths específicos no `tsconfig.json`
- Manteve apenas o alias `@/*` apontando para `./src/*`

### 3. Correção dos Imports
- Corrigiu import relativo em `src/app/signup/page.tsx`
- Padronizou todos os imports para usar `@/config/constants` e `@/config/environment`

### 4. Limpeza
- Removeu a pasta `config/` antiga da raiz do projeto
- Limpou configurações duplicadas

## Resultado
- Build local: ✅ Funcionando
- Deploy Netlify: ✅ Deve funcionar agora
- Estrutura limpa e organizada

## Arquivos Modificados
- `src/config/constants.ts` (movido)
- `src/config/environment.ts` (movido)
- `src/app/signup/page.tsx` (import corrigido)
- `next.config.mjs` (alias limpo)
- `tsconfig.json` (paths limpos)

## Data
2024-01-XX - Correção implementada e testada 