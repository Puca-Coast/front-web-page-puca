#!/bin/bash

# 🚀 Deploy Script para Netlify - Correção de Dependências
echo "🚀 Preparando deploy para Netlify..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    log_error "Execute este script no diretório root do frontend"
    exit 1
fi

# 1. Limpar arquivos do Yarn
log_info "Limpando arquivos do Yarn..."
rm -f yarn.lock
rm -f .pnp.cjs
rm -f .pnp.loader.mjs
rm -rf .yarn

# 2. Limpar cache
log_info "Limpando cache..."
rm -rf .next
rm -rf node_modules

# 3. Reinstalar dependências com npm
log_info "Instalando dependências com npm..."
npm install --legacy-peer-deps

# 4. Fazer build de teste
log_info "Executando build de teste..."
npm run build

if [ $? -ne 0 ]; then
    log_error "Build falhou! Verifique os erros acima."
    exit 1
fi

log_success "Build concluído com sucesso!"

# 5. Commit das mudanças
log_info "Preparando commit..."
git add -A
git status

log_info "Digite a mensagem de commit (ou pressione Enter para usar a padrão):"
read -r commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="fix: resolve Netlify deployment issues with npm"
fi

git commit -m "$commit_msg"

# 6. Push para o repositório
log_info "Fazendo push para o repositório..."
git push origin main

if [ $? -eq 0 ]; then
    log_success "Push concluído!"
    log_info "O Netlify iniciará o deploy automaticamente."
    log_info "Acompanhe em: https://app.netlify.com"
else
    log_error "Erro ao fazer push. Verifique sua conexão e permissões."
    exit 1
fi

# 7. Instruções finais
echo ""
log_info "📋 Checklist pós-deploy:"
echo "[ ] Verificar o log de build no Netlify"
echo "[ ] Confirmar que não há erros de dependências"
echo "[ ] Testar o site em produção"
echo "[ ] Verificar que as imagens carregam corretamente"

log_success "Script concluído!" 