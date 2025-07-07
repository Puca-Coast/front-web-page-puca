#!/bin/bash

# 🚀 Deploy Fix Script - Correção de Imagens Cloudinary
echo "🚀 Iniciando correção de imagens Cloudinary..."

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

# 1. Limpar cache
log_info "Limpando cache e arquivos temporários..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .yarn/.cache

# 2. Instalar dependências
log_info "Instalando dependências..."
npm install

# 3. Verificar variáveis de ambiente
log_info "Verificando variáveis de ambiente..."
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    log_warning "Criando arquivo .env.local com valores padrão..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=https://puca-api.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgsigv8cf
EOF
fi

# 4. Build de produção
log_info "Executando build de produção..."
npm run build

if [ $? -ne 0 ]; then
    log_error "Build falhou! Verifique os erros acima."
    exit 1
fi

log_success "Build concluído com sucesso!"

# 5. Testar localmente
log_info "Deseja testar localmente antes do deploy? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    log_info "Iniciando servidor local..."
    npm run start &
    SERVER_PID=$!
    
    log_info "Servidor rodando em http://localhost:3000"
    log_info "Pressione qualquer tecla para parar o servidor e continuar..."
    read -n 1 -s
    
    kill $SERVER_PID
fi

# 6. Deploy
log_info "Pronto para deploy no Netlify!"
log_info "Execute os seguintes comandos:"
echo ""
echo "git add ."
echo "git commit -m \"fix: resolve Cloudinary 500 errors in production\""
echo "git push origin main"
echo ""
log_success "Após o push, o Netlify fará o deploy automaticamente!"

# 7. Checklist pós-deploy
echo ""
log_info "📋 Checklist pós-deploy:"
echo "[ ] Verificar se as imagens carregam sem erro 500"
echo "[ ] Testar em diferentes navegadores"
echo "[ ] Verificar console para erros"
echo "[ ] Confirmar que o fallback funciona"
echo "[ ] Testar performance das imagens"

log_success "Script concluído!" 