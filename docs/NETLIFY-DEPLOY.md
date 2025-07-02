# Deploy no Netlify - Puca Coast

Este documento contém instruções para o deploy da aplicação Puca Coast no Netlify.

## Instruções de Deploy

### 1. Configuração do Netlify

1. Crie uma conta no [Netlify](https://www.netlify.com/) se ainda não tiver
2. Clique em "New site from Git"
3. Selecione o repositório do GitHub onde está o código da aplicação
4. Configure as seguintes opções:
   - **Build Command**: `yarn netlify-build`
   - **Publish Directory**: `.next`
   - **Node Version**: `21` (ou posterior)

### 2. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel do Netlify:

- `NEXT_PUBLIC_API_BASE_URL`: `https://puca-api.vercel.app` 
- `SITE_URL`: seu domínio no Netlify (ex: `https://puca-coast.netlify.app`)

### 3. Domínio Personalizado (Opcional)

Para adicionar um domínio personalizado:

1. No Dashboard do seu site, vá para "Domain settings"
2. Clique em "Add custom domain"
3. Siga as instruções para configurar o DNS do seu domínio

## Estrutura dos Arquivos de Configuração

- `netlify.toml`: Contém as configurações de build e redirecionamento
- `.env.production`: Variáveis de ambiente para produção
- `next-sitemap.config.js`: Configuração para geração automática de sitemap

## Limitações e Considerações

1. O deploy inicial pode demorar até 15 minutos
2. A primeira visita às páginas pode ser um pouco mais lenta devido ao cache frio
3. Para funções serverless complexas, pode ser necessário ajustar as configurações do plugin Next.js

## Solução de Problemas

Se encontrar problemas no deploy:

1. Verifique os logs de build no painel do Netlify
2. Certifique-se de que o plugin `@netlify/plugin-nextjs` está instalado
3. Verifique se o Node.js v21+ está sendo usado

---

Para mais informações, consulte a [documentação do Netlify para Next.js](https://www.netlify.com/with/nextjs/). 