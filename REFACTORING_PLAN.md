# 🏗️ PUCA Coast - Refactoring Plan

## Estrutura Atual vs Nova Estrutura

### Frontend (Next.js 15) - Nova Estrutura Recomendada

```
src/
├── app/                     # App Router (Next.js 15)
│   ├── (auth)/             # Route groups
│   │   ├── login/
│   │   └── signup/
│   ├── (shop)/             # Route groups  
│   │   ├── shop/
│   │   ├── product/
│   │   └── collections/
│   ├── (info)/             # Route groups
│   │   ├── about/
│   │   ├── contact/
│   │   └── privacy/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes (se necessário)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # Componentes organizados por tipo
│   ├── ui/                 # Componentes básicos reutilizáveis
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Card/
│   │   └── index.ts
│   ├── layout/             # Componentes de layout
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── index.ts
│   └── features/           # Componentes específicos por funcionalidade
│       ├── auth/
│       ├── shop/
│       ├── lookbook/
│       ├── cart/
│       └── admin/
├── lib/                    # Bibliotecas e configurações
│   ├── auth/
│   ├── payments/
│   ├── shipping/
│   ├── cloudinary/
│   └── database/
├── services/               # Serviços de API
│   ├── api/
│   ├── auth/
│   ├── products/
│   └── lookbook/
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useApi.ts
├── store/                  # Estado global (Zustand/Redux)
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── index.ts
├── types/                  # Definições de tipos TypeScript
│   ├── auth.ts
│   ├── product.ts
│   ├── api.ts
│   └── index.ts
├── utils/                  # Funções utilitárias
│   ├── validation.ts
│   ├── formatting.ts
│   ├── constants.ts
│   └── helpers.ts
├── styles/                 # Estilos globais
│   ├── globals.css
│   ├── components.css
│   └── variables.css
└── contexts/               # Context providers (se necessário)
    ├── AuthContext.tsx
    └── ThemeContext.tsx
```

### Backend (Express.js) - Nova Estrutura Recomendada

```
puca-api/
├── src/                    # Código fonte
│   ├── controllers/        # Controladores de rotas
│   │   ├── auth.controller.js
│   │   ├── products.controller.js
│   │   ├── lookbook.controller.js
│   │   └── payments.controller.js
│   ├── models/             # Modelos de dados
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── LookbookPhoto.js
│   ├── routes/             # Definição de rotas
│   │   ├── auth.routes.js
│   │   ├── products.routes.js
│   │   └── lookbook.routes.js
│   ├── services/           # Lógica de negócio
│   │   ├── auth.service.js
│   │   ├── cloudinary.service.js
│   │   └── payment.service.js
│   ├── middleware/         # Middlewares
│   │   ├── auth.middleware.js
│   │   ├── cors.middleware.js
│   │   └── validation.middleware.js
│   ├── config/             # Configurações
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── environment.js
│   ├── utils/              # Utilitários
│   │   ├── logger.js
│   │   ├── validation.js
│   │   └── helpers.js
│   └── app.js              # Configuração principal
├── tests/                  # Testes
├── docs/                   # Documentação
├── scripts/                # Scripts de deploy/setup
├── .env.example
├── package.json
└── vercel.json
```

## Prioridades de Refatoração

### ✅ Fase 1: Estrutura Base (Concluída)
- [x] Configuração básica do projeto
- [x] Estrutura de rotas Next.js 15
- [x] Configuração da API

### 🔄 Fase 2: Organização de Componentes (Em Progresso)
- [ ] Reorganizar componentes em UI/Layout/Features
- [ ] Criar index.ts para exports centralizados
- [ ] Implementar design system consistente

### 🔄 Fase 3: Serviços e Estado (Em Progresso)  
- [x] Modernizar httpClient
- [x] Reestruturar authService
- [ ] Implementar Zustand para estado global
- [ ] Organizar hooks customizados

### 📋 Fase 4: Backend (Próxima)
- [ ] Separar controllers, services e routes
- [ ] Implementar validação robusta
- [ ] Adicionar testes unitários
- [ ] Melhorar error handling

### 🎯 Fase 5: Performance e Produção
- [ ] Otimização de imagens
- [ ] Cache strategies
- [ ] Error monitoring
- [ ] Performance metrics

## Problemas Identificados em Produção

### 🖼️ Problema de Imagens (Crítico)
- **Erro**: Images do Cloudinary retornando 500 no Netlify
- **Causa**: Configuração incorreta do Next.js Image Optimization
- **Solução**: Configurar loader personalizado para Cloudinary

### 🔧 Melhorias Necessárias
1. **Error Boundary** - Implementar para capturar erros
2. **Loading States** - Melhorar UX durante carregamento
3. **Image Optimization** - Configurar corretamente para produção
4. **Bundle Optimization** - Reduzir tamanho do bundle
5. **SEO** - Implementar meta tags dinâmicas

## Benefícios da Nova Estrutura

1. **Escalabilidade**: Fácil adicionar novas features
2. **Manutenibilidade**: Código bem organizado e documentado
3. **Performance**: Bundle splitting e otimizações
4. **Developer Experience**: TypeScript strict, linting, testes
5. **Collaboration**: Estrutura clara para time de desenvolvimento

## Next Steps

1. Resolver problemas de imagem em produção
2. Implementar nova estrutura de componentes
3. Migrar para Zustand para estado global
4. Adicionar testes automatizados
5. Implementar CI/CD robusto 