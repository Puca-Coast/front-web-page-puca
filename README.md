# Puca Coast - E-commerce frontend

## Sobre o Projeto

Puca Coast é uma aplicação de e-commerce para uma marca de roupas, desenvolvida com Next.js, React e TypeScript. O projeto segue as melhores práticas de desenvolvimento web de 2025, com foco em segurança, arquitetura escalável e manutenibilidade.

## Estrutura do Projeto

A estrutura de pastas foi organizada seguindo padrões de mercado para maior escalabilidade e manutenibilidade:

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
└── config/                     # Configurações de projeto
```

## Características Implementadas

- **Arquitetura Moderna**: Serviços de API centralizados, hooks personalizados, isolamento de responsabilidades.
- **Segurança**: Middleware de proteção de rotas, cookies seguros, validação de dados.
- **Performance**: Hooks de debounce, otimização de requisições.
- **Manutenibilidade**: Código documentado, serviços especializados, padrões consistentes.
- **Organização por Features**: Componentes organizados por domínio de negócio (DDD).

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js v21 ou superior
- Yarn v4 ou superior

### Instalação

1. Clone o repositório:
   ```bash
   git clone [url-do-repositorio]
   cd front-web-page-puca
   ```

2. Execute o script de setup para instalar as dependências necessárias:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   yarn dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador para ver a aplicação.

## Endpoints de API

A aplicação se comunica com os seguintes endpoints da API:

### Autenticação
- **Login**: `POST /api/auth/login`
- **Registro**: `POST /api/auth/register`
- **Perfil**: `GET /api/auth/profile`
- **Admin**: `GET /api/auth/admin`

### Produtos
- **Listagem**: `GET /api/products`
- **Detalhes**: `GET /api/products/:id`
- **Busca**: `GET /api/products/search/name`
- **Criar**: `POST /api/products`
- **Atualizar**: `PUT /api/products/:id`
- **Excluir**: `DELETE /api/products/:id`

### Lookbook
- **Listagem**: `GET /api/lookbook/photos`
- **Adicionar**: `POST /api/lookbook/photos`
- **Atualizar**: `PUT /api/lookbook/photos/:id`
- **Excluir**: `DELETE /api/lookbook/photos/:id`

## Próximos Passos

Para mais informações sobre o que foi feito e o que ainda precisa ser implementado, consulte o arquivo [DOCUMENTATION.md](./DOCUMENTATION.md).

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
