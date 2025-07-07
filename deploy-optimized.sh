#!/bin/bash

# 🚀 Deploy Script - PUCA Optimized
echo "🚀 Iniciando deploy otimizado do PUCA..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório root do frontend"
    exit 1
fi

# Função para log colorido
log_info() {
    echo -e "ℹ️  \033[0;34m$1\033[0m"
}

log_success() {
    echo -e "✅ \033[0;32m$1\033[0m"
}

log_warning() {
    echo -e "⚠️  \033[0;33m$1\033[0m"
}

log_error() {
    echo -e "❌ \033[0;31m$1\033[0m"
}

# Verificar dependências
log_info "Verificando dependências..."

if ! command -v npm &> /dev/null; then
    log_error "npm não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Limpar cache e otimizar
log_info "Limpando cache do Next.js..."
rm -rf .next/cache
rm -rf .next/static

# Verificar se o arquivo de ambiente está presente
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    log_warning "Arquivo .env não encontrado. Criando com valores padrão..."
    echo "NEXT_PUBLIC_API_BASE_URL=https://puca-api.vercel.app" > .env.local
fi

# Instalar dependências otimizadas
log_info "Instalando dependências..."
npm ci --prefer-offline --no-audit

# Executar build otimizado
log_info "Executando build de produção..."
npm run build

if [ $? -ne 0 ]; then
    log_error "Build falhou! Verifique os erros acima."
    exit 1
fi

log_success "Build concluído com sucesso!"

# Verificar se há problemas críticos
log_info "Verificando problemas críticos..."

# Verificar se os arquivos essenciais existem
ESSENTIAL_FILES=(
    ".next/static"
    ".next/server"
    "src/lib/cloudinary.ts"
    "src/components/ui/OptimizedImage/SimpleOptimizedImage.tsx"
    "netlify.toml"
    "next.config.mjs"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ ! -e "$file" ]; then
        log_error "Arquivo essencial não encontrado: $file"
        exit 1
    fi
done

log_success "Todos os arquivos essenciais estão presentes!"

# Resumo das correções implementadas
echo ""
echo "📊 RESUMO DAS CORREÇÕES IMPLEMENTADAS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Loader personalizado para Cloudinary configurado"
echo "✅ Componente SimpleOptimizedImage com fallbacks"
echo "✅ Configuração unoptimized para imagens externas"
echo "✅ Headers otimizados no netlify.toml"
echo "✅ Cache strategies implementadas"
echo "✅ API simplificada e robusta (puca-api)"
echo "✅ Build limpo sem erros críticos"
echo ""

# Instruções de deploy
echo "🎯 PRÓXIMOS PASSOS PARA DEPLOY:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Fazer commit das mudanças:"
echo "   git add ."
echo "   git commit -m \"fix: resolve Cloudinary image optimization issues\""
echo ""
echo "2. Fazer push para o repositório:"
echo "   git push origin main"
echo ""
echo "3. O Netlify detectará automaticamente e fará o deploy"
echo ""
echo "🔍 TESTES APÓS DEPLOY:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Verificar se https://pucacoast.netlify.app/lookbook carrega sem erros 500"
echo "• Testar carregamento de imagens do Cloudinary"
echo "• Confirmar fallbacks funcionando para imagens quebradas"
echo "• Validar performance no PageSpeed Insights"
echo ""

# Verificar se o git está configurado
if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        log_info "Preparando commit das mudanças..."
        echo ""
        echo "Status atual do git:"
        git status --short
        echo ""
        log_success "Deploy script concluído! Execute os comandos acima para fazer o deploy."
    else
        log_warning "Repositório git não encontrado. Inicialize o git primeiro."
    fi
else
    log_warning "Git não encontrado. Instale o git para versionamento."
fi

echo ""
log_success "🎉 Deploy script executado com sucesso!"
log_info "Acesse: https://pucacoast.netlify.app após o deploy para testar as correções" 