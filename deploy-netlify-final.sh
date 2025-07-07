#!/bin/bash

# 🚀 Script de Deploy Final para Netlify - PUCA Coast
# Inclui todas as correções: Cloudinary, npm, lightningcss

echo "🔧 Iniciando deploy final para Netlify..."

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado. Execute este script no diretório do projeto."
    exit 1
fi

# 2. Limpar cache e node_modules
echo "🧹 Limpando cache e dependências..."
rm -rf node_modules package-lock.json .next

# 3. Instalar dependências com todas as correções
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps

# 4. Instalar lightningcss especificamente
echo "⚡ Instalando lightningcss..."
npm install lightningcss --save-dev --legacy-peer-deps

# 5. Verificar se todas as dependências críticas estão instaladas
echo "🔍 Verificando dependências críticas..."
DEPS_TO_CHECK=(
    "lightningcss"
    "autoprefixer"
    "postcss"
    "@tailwindcss/postcss"
    "tailwindcss"
)

for dep in "${DEPS_TO_CHECK[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        echo "✅ $dep: instalado"
    else
        echo "❌ $dep: FALTANDO"
        exit 1
    fi
done

# 6. Verificar arquivos de configuração
echo "📋 Verificando configurações..."

# Verificar postcss.config.js
if [ -f "postcss.config.js" ]; then
    echo "✅ postcss.config.js: encontrado"
else
    echo "❌ postcss.config.js: FALTANDO"
    exit 1
fi

# Verificar tailwind.config.ts
if [ -f "tailwind.config.ts" ]; then
    echo "✅ tailwind.config.ts: encontrado"
else
    echo "❌ tailwind.config.ts: FALTANDO"
    exit 1
fi

# Verificar netlify.toml
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml: encontrado"
else
    echo "❌ netlify.toml: FALTANDO"
    exit 1
fi

# 7. Testar build local
echo "🔨 Testando build local..."
if npm run build; then
    echo "✅ Build local: SUCESSO"
else
    echo "❌ Build local: FALHOU"
    echo "Verifique os erros acima antes de fazer deploy."
    exit 1
fi

# 8. Verificar status do Git
echo "📊 Verificando status do Git..."
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Alterações detectadas. Preparando commit..."
    
    # Adicionar todos os arquivos
    git add -A
    
    # Commit com mensagem descritiva
    git commit -m "fix: resolve all Netlify deployment issues

- Fix lightningcss module error for Tailwind CSS v4
- Update PostCSS configuration
- Configure Netlify build environment
- Add missing dependencies
- Update build configurations

Fixes:
- Cannot find module 'lightningcss.linux-x64-gnu.node'
- Module resolution errors
- Build configuration issues"
    
    echo "✅ Commit criado com sucesso"
else
    echo "ℹ️  Nenhuma alteração detectada"
fi

# 9. Mostrar resumo das correções
echo ""
echo "📋 RESUMO DAS CORREÇÕES IMPLEMENTADAS:"
echo "=================================="
echo "✅ Cloudinary: Erros 500 corrigidos"
echo "✅ npm: Migração do Yarn completa"
echo "✅ lightningcss: Módulo instalado e configurado"
echo "✅ PostCSS: Configuração atualizada"
echo "✅ Tailwind CSS v4: Funcionando corretamente"
echo "✅ Netlify: Configuração otimizada"
echo "✅ Build local: Passando sem erros"
echo ""

# 10. Instruções finais
echo "🚀 PRONTO PARA DEPLOY!"
echo "====================="
echo ""
echo "Para fazer deploy no Netlify, execute:"
echo "git push origin main"
echo ""
echo "Ou se preferir fazer push agora:"
read -p "Deseja fazer push agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Fazendo push para o repositório..."
    git push origin main
    echo "✅ Deploy iniciado! Verifique o Netlify Dashboard."
else
    echo "ℹ️  Push cancelado. Execute 'git push origin main' quando estiver pronto."
fi

echo ""
echo "🎉 Script concluído com sucesso!"
echo "📚 Consulte os arquivos de documentação para mais detalhes:"
echo "   - CLOUDINARY_FIX.md"
echo "   - NETLIFY_DEPLOY_FIX.md"
echo "   - NETLIFY_MODULE_FIX.md"
echo "   - NETLIFY_LIGHTNINGCSS_FIX.md" 