# Puca Coast - Front-end

## Utilitários Necessários

### Configuração do NVM

Primeiro, você precisa baixar e configurar o NVM. Se você estiver usando Windows, baixe o "nvm for windows". Se estiver usando Linux, baixe o "nvm for linux".

Depois de baixar o NVM, abra o terminal do Visual Studio Code e execute os seguintes comandos:

```bash
nvm install 21
nvm use 21
```

A partir daqui, seu Node.js será configurado para a versão mais atual.

### Instalação do Yarn
Você também precisará do Yarn. Se ainda não o tiver instalado, faça o download. Depois de baixar o Yarn, no terminal, tente executar o seguinte comando para baixar os pacotes:

```bash
yarn install
```

### Configurando Variáveis de Ambiente

1. Duplique o arquivo `.env.example` e renomeie para `.env.local`
2. Edite as variáveis conforme necessário (por padrão já estão configuradas para produção)

```
NEXT_PUBLIC_API_BASE_URL=https://puca-api.vercel.app
```

### Executando o Projeto
Depois de concluir as etapas acima, você pode iniciar o projeto com:

```bash
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Deploy no Netlify

Para fazer deploy no Netlify:

1. Configure o repositório no Netlify
2. Configure as variáveis de ambiente no painel do Netlify:
   - NEXT_PUBLIC_API_BASE_URL=https://puca-api.vercel.app
3. Configure o comando de build para: `yarn build`
4. Configure o diretório de publicação para: `.next`

## Solução de problemas

### Erros de CORS

Se encontrar erros de CORS durante o desenvolvimento:

1. Verifique se o servidor da API está configurado para aceitar solicitações do domínio que você está utilizando
2. Verifique se as variáveis de ambiente estão configuradas corretamente

### Mais informações

Para saber mais sobre Next.js:

- [Documentação do Next.js](https://nextjs.org/docs)
- [Tutorial interativo do Next.js](https://nextjs.org/learn)

Para saber mais sobre deploy:
- [Documentação de deploy do Next.js](https://nextjs.org/docs/deployment)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
