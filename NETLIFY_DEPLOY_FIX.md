# 🔧 Correção de Deploy no Netlify - Problemas de Dependências

## 🐛 Problema Identificado

O deploy no Netlify estava falhando com os seguintes erros:
1. Conflito entre Yarn e npm (múltiplos lockfiles)
2. Yarn 4.7.0 tentando modificar o lockfile em produção
3. Dependências peer não satisfeitas
4. Arquivos PnP do Yarn causando conflitos

## ✅ Solução Implementada

### 1. **Migração de Yarn para npm**
- Removido `packageManager` do package.json
- Removido yarn.lock e arquivos .pnp.*
- Configurado .npmrc com `legacy-peer-deps=true`

### 2. **Configuração do Netlify**
```toml
# netlify.toml
[build.environment]
  NPM_FLAGS = "--legacy-peer-deps"
```

### 3. **Limpeza de Arquivos**
- Removidos: yarn.lock, .pnp.cjs, .pnp.loader.mjs
- Removido diretório .yarn/
- Mantido apenas package-lock.json

### 4. **Correções no next.config.mjs**
- Removido `swcMinify` (obsoleto no Next.js 15)
- Mantido `unoptimized: true` para imagens

## 🚀 Como Fazer Deploy

### Opção 1 - Script Automatizado
```bash
cd front-web-page-puca
./deploy-netlify.sh
```

### Opção 2 - Manual
```bash
# Limpar arquivos do Yarn
rm -f yarn.lock .pnp.* 
rm -rf .yarn

# Limpar cache
rm -rf .next node_modules

# Instalar com npm
npm install --legacy-peer-deps

# Build de teste
npm run build

# Commit e push
git add -A
git commit -m "fix: migrate from Yarn to npm for Netlify deployment"
git push origin main
```

## 📝 Mudanças Principais

### Arquivos Modificados:
- `package.json` - Removido packageManager
- `.npmrc` - Adicionado legacy-peer-deps
- `netlify.toml` - Adicionado NPM_FLAGS
- `next.config.mjs` - Removido swcMinify
- `.gitignore` - Atualizado para ignorar arquivos corretos

### Arquivos Removidos:
- `yarn.lock`
- `.pnp.cjs`
- `.pnp.loader.mjs`
- Diretório `.yarn/`

## 🧪 Verificação

### Local
```bash
npm run build
# Deve compilar sem erros
```

### Produção (Netlify)
1. Verificar logs de build no Netlify
2. Confirmar que usa npm ao invés de Yarn
3. Verificar que não há erros de lockfile

## 🔍 Troubleshooting

### Se ainda houver erros:

1. **Clear Build Cache no Netlify:**
   - Site Settings > Build & Deploy > Clear cache and retry deploy

2. **Verificar Node Version:**
   - Adicionar arquivo `.nvmrc` com versão do Node
   ```
   18.20.5
   ```

3. **Forçar npm no Netlify:**
   ```toml
   [build]
     command = "npm install --legacy-peer-deps && npm run build"
   ```

## 📚 Referências

- [Netlify Build Troubleshooting](https://docs.netlify.com/configure-builds/troubleshooting-tips/)
- [npm vs Yarn on Netlify](https://answers.netlify.com/t/how-to-fix-module-not-found-error-when-deploying-nextjs-app-to-netlify/56648)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/) 