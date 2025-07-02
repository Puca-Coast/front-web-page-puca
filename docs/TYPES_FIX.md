# Resolução de Problemas de Tipagem

Este documento fornece soluções para resolver problemas de tipagem no projeto.

## Erros Comuns

### Cannot find module 'react' or its corresponding type declarations

Este erro ocorre quando o TypeScript não consegue encontrar as definições de tipo para módulos como React, Next.js, etc.

## Soluções

### 1. Instalar Tipagens Manualmente

Execute o script criado no package.json para instalar as dependências de tipos necessárias:

```bash
yarn install-types
# ou
npm run install-types
```

Este comando instalará:
- @types/react
- @types/react-dom
- @types/node

### 2. Ignorar Erros Temporariamente

Se as soluções acima não resolverem o problema imediatamente, você pode executar o projeto mesmo com os erros, pois eles não afetam o funcionamento real da aplicação:

```bash
# Ignorar erros de tipagem durante o desenvolvimento
yarn dev --ts-ignore
```

### 3. Utilizando Declarações Personalizadas

Este projeto já inclui um arquivo de declarações de tipo personalizado em `src/types/declarations.d.ts` que fornece tipagem básica para os módulos utilizados.

### 4. Resolvendo o Erro de Prioridade nas Imagens

O erro "Image has both 'priority' and 'loading=lazy' properties" foi corrigido removendo a propriedade `loading="lazy"` das imagens do carrossel, mantendo apenas a propriedade `priority` para as primeiras imagens.

## Contato

Se os problemas persistirem, consulte a documentação oficial:

- [TypeScript + React](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js com TypeScript](https://nextjs.org/docs/basic-features/typescript)
- [Swiper API](https://swiperjs.com/swiper-api) 