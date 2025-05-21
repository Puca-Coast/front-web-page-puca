# Documentação do Projeto - Puca Coast

## Contexto do Projeto

Puca Coast é um e-commerce para uma marca de roupas, implementado como uma aplicação Next.js. O projeto consiste em uma interface de usuário que se comunica com uma API para gerenciamento de produtos, autenticação de usuários e gerenciamento de lookbooks.

## Estrutura do Projeto

```
front-web-page-puca/
├── src/                        # Pasta raiz para código-fonte
│   ├── app/                    # App router do Next.js
│   │   ├── (auth)/             # Grupo de rotas autenticadas
│   │   │   ├── profile/        # Rotas relacionadas ao perfil 
│   │   │   └── admin/          # Rotas de administração
│   │   ├── (public)/           # Grupo de rotas públicas
│   │   └── layout.tsx          # Layout raiz da aplicação
│   ├── components/             # Componentes React
│   │   ├── common/             # Componentes globais reutilizáveis
│   │   ├── features/           # Componentes organizados por feature
│   │   │   ├── auth/           # Componentes de autenticação
│   │   │   ├── cart/           # Componentes de carrinho
│   │   │   ├── products/       # Componentes de produtos
│   │   │   └── lookbook/       # Componentes de lookbook
│   │   ├── layout/             # Componentes de layout (Header, Footer)
│   │   └── ui/                 # Componentes de UI básicos 
│   ├── lib/                    # Código utilitário e de terceiros
│   │   ├── services/           # Serviços de API
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Funções utilitárias
│   │   └── types/              # Definições de tipos TypeScript
│   ├── contexts/               # Contextos React
│   ├── styles/                 # Estilos globais
│   └── middleware.ts           # Middleware para proteção de rotas
├── public/                     # Arquivos estáticos
├── config/                     # Configurações de projeto
│   ├── environment.ts          # Configurações de ambiente
│   └── constants.ts            # Constantes de aplicação
├── setup.sh                    # Script de configuração
└── DOCUMENTATION.md            # Documentação do projeto
```

## O Que Foi Feito

1. **Modernização da Arquitetura**:
   - Implementação de serviços de API centralizados (authService, productService, lookbookService)
   - Cliente HTTP centralizado com interceptors para tokens e tratamento de erros
   - Hooks personalizados para autenticação (useAuth) e debounce (useDebounce)
   - Utilitários para validação de dados e gerenciamento de cookies

2. **Melhorias de Segurança**:
   - Substituição de localStorage por cookies seguros (com opções SameSite, HttpOnly)
   - Middleware para proteção de rotas no servidor
   - HOCs para proteção de rotas no cliente (withAuth, withAdminAuth)

3. **Organização e Estruturação**:
   - Centralização das chamadas de API
   - Organização de código seguindo padrões de mercado
   - Tratamento adequado de estados e efeitos colaterais
   - Reorganização da estrutura de pastas seguindo os padrões modernos de desenvolvimento

4. **Centralização de Configurações**:
   - Arquivo de configuração de ambiente (environment.ts)
   - Arquivo de constantes (constants.ts)
   - Tipos centralizados (types/index.ts)

## O Que Ainda Precisa Ser Feito

1. **Instalação de Dependências**:
   - Resolver erros de linter instalando as dependências necessárias

2. **Integração com a API**:
   - Atualizar componentes para usar os novos serviços de API

3. **Testes**:
   - Implementar testes unitários para serviços e componentes
   - Implementar testes de integração para fluxos principais

4. **Acessibilidade**:
   - Melhorar aspectos de acessibilidade nos componentes
   - Implementar navegação por teclado consistente

5. **SEO**:
   - Otimizar metadados para SEO
   - Implementar sitemap e robots.txt

6. **Performance**:
   - Implementar code splitting
   - Otimizar carregamento de imagens
   - Implementar estratégias de caching

7. **Internacionalização**:
   - Preparar a aplicação para suporte a múltiplos idiomas

8. **Atualização de Importações**:
   - Atualizar todas as importações nos componentes para refletir a nova estrutura de pastas

## Prioridades Imediatas

1. Resolver erros de linter instalando dependências necessárias
2. Atualizar importações em todos os arquivos para refletir a nova estrutura
3. Atualizar o componente de login para usar o novo AuthService
4. Atualizar páginas de produto para usar o novo ProductService
5. Implementar tratamento adequado de erros na interface do usuário

## Padrões Adotados

1. **Estrutura de Pastas**:
   - Pasta `src` para isolar código-fonte
   - Componentes organizados por features (Domain-Driven Design)
   - Código utilitário centralizado em `lib`
   - Configurações centralizadas em `config`

2. **Serviços**:
   - Serviços específicos por domínio (auth, product, lookbook)
   - Método único de comunicação com a API via httpClient

3. **Componentes**:
   - Componentes específicos em pastas dedicadas
   - Componentes de páginas separados de componentes reutilizáveis

4. **Estado**:
   - Contextos para estado global
   - Estados locais para lógica específica de componentes
   - Hooks personalizados para lógica reutilizável

5. **Estilos**:
   - Uso de Tailwind CSS para estilos
   - Classes utilitárias para layout e design

6. **Segurança**:
   - Validação de dados de entrada
   - Proteção de rotas em múltiplas camadas
   - Uso de cookies seguros em vez de localStorage 