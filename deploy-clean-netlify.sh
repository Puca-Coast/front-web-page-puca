#!/bin/bash

# 🚀 Script de Deploy Limpo para Netlify - PUCA Coast
# Força limpeza completa de cache e dependências

echo "🧹 Iniciando limpeza completa para deploy no Netlify..."

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado. Execute este script no diretório do projeto."
    exit 1
fi

# 2. Limpeza total - remover tudo
echo "🗑️  Removendo cache e dependências..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf .next
rm -rf .netlify
rm -rf out

# 3. Limpar cache npm
echo "🧽 Limpando cache npm..."
npm cache clean --force

# 4. Reinstalar dependências com flags específicas
echo "📦 Reinstalando dependências..."
npm install --legacy-peer-deps --no-audit --no-fund

# 5. Verificar dependências críticas
echo "🔍 Verificando dependências críticas..."
CRITICAL_DEPS=(
    "autoprefixer"
    "lightningcss"
    "postcss"
    "@tailwindcss/postcss"
    "tailwindcss"
    "next"
    "react"
    "react-dom"
)

for dep in "${CRITICAL_DEPS[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        echo "✅ $dep: instalado"
    else
        echo "❌ $dep: FALTANDO - tentando instalar..."
        npm install "$dep" --legacy-peer-deps
    fi
done

# 6. Testar build local
echo "🔨 Testando build local..."
if npm run build; then
    echo "✅ Build local: SUCESSO"
else
    echo "❌ Build local: FALHOU"
    echo "Verifique os erros acima antes de fazer deploy."
    exit 1
fi

# 7. Verificar arquivos essenciais
echo "📋 Verificando arquivos essenciais..."
ESSENTIAL_FILES=(
    "package.json"
    "next.config.mjs"
    "tailwind.config.ts"
    "postcss.config.js"
    "netlify.toml"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: encontrado"
    else
        echo "❌ $file: FALTANDO"
        exit 1
    fi
done

# 8. Mostrar informações do ambiente
echo ""
echo "📊 INFORMAÇÕES DO AMBIENTE:"
echo "=========================="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Next.js: $(npm list next --depth=0 2>/dev/null | grep next || echo 'não encontrado')"
echo "Tailwind CSS: $(npm list tailwindcss --depth=0 2>/dev/null | grep tailwindcss || echo 'não encontrado')"
echo ""

# 9. Preparar commit
echo "📝 Preparando commit para deploy..."
git add -A

# Verificar se há mudanças
if [ -n "$(git status --porcelain)" ]; then
    git commit -m "fix: clean deploy - resolve all Netlify issues

- Remove output: export configuration
- Update build command with npm ci
- Force clean installation
- Fix autoprefixer and lightningcss issues
- Clear all cache and dependencies

Deploy Status: Ready for production"
    
    echo "✅ Commit criado com sucesso"
else
    echo "ℹ️  Nenhuma alteração detectada para commit"
fi

# 10. Instruções finais
echo ""
echo "🚀 DEPLOY LIMPO PREPARADO!"
echo "========================="
echo ""
echo "✅ Cache limpo"
echo "✅ Dependências reinstaladas"
echo "✅ Build local testado"
echo "✅ Configurações verificadas"
echo ""
echo "Para fazer deploy no Netlify:"
echo "1. git push origin main"
echo "2. No Netlify Dashboard: Site Settings > Build & Deploy > Clear cache and deploy site"
echo ""

# Perguntar se deve fazer push
read -p "Deseja fazer push agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Fazendo push para o repositório..."
    git push origin main
    echo ""
    echo "✅ Deploy iniciado!"
    echo "📱 Monitore o progresso no Netlify Dashboard"
    echo "🔗 Logs: https://app.netlify.com/sites/[seu-site]/deploys"
else
    echo "ℹ️  Push cancelado. Execute 'git push origin main' quando estiver pronto."
fi

echo ""
echo "🎉 Script concluído!"
echo "📚 Consulte NETLIFY_FINAL_FIX.md para mais detalhes" 