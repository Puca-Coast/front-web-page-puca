#!/bin/bash

# Script para migrar arquivos da estrutura antiga para a nova

echo "Iniciando migração para a estrutura de arquivos moderna..."

# Criar diretórios necessários
mkdir -p src/app/public/about
mkdir -p src/app/public/collections
mkdir -p src/app/public/login
mkdir -p src/app/public/lookbook
mkdir -p src/app/public/privacy
mkdir -p src/app/public/product
mkdir -p src/app/public/shop
mkdir -p src/app/public/signup
mkdir -p src/app/auth/profile
mkdir -p src/app/auth/admin

# Migrar componentes
echo "Migrando componentes..."

# Header e Footer -> layout
mkdir -p src/components/layout
cp components/Header.tsx src/components/layout/ 2>/dev/null || echo "Header.tsx não encontrado"
cp components/Footer.tsx src/components/layout/ 2>/dev/null || echo "Footer.tsx não encontrado"

# Componentes do carrinho
mkdir -p src/components/features/cart
cp components/Cart/* src/components/features/cart/ 2>/dev/null || echo "Nenhum componente em Cart/"
cp components/CartButton.tsx src/components/features/cart/ 2>/dev/null || echo "CartButton.tsx não encontrado"
cp components/shoppingCart.tsx src/components/features/cart/ 2>/dev/null || echo "shoppingCart.tsx não encontrado"

# Componentes da Home
mkdir -p src/components/features/home
cp components/Home/* src/components/features/home/ 2>/dev/null || echo "Nenhum componente em Home/"

# Componentes do Lookbook
mkdir -p src/components/features/lookbook
cp components/LookBook/* src/components/features/lookbook/ 2>/dev/null || echo "Nenhum componente em LookBook/"

# Componentes da loja
mkdir -p src/components/features/shop
cp components/Shop/* src/components/features/shop/ 2>/dev/null || echo "Nenhum componente em Shop/"

# Componentes UI comuns
mkdir -p src/components/ui
cp components/WavyLoader.tsx src/components/ui/ 2>/dev/null || echo "WavyLoader.tsx não encontrado"

# Componentes de autenticação
mkdir -p src/components/features/auth
cp components/userLogin.tsx src/components/features/auth/Login.tsx 2>/dev/null || echo "userLogin.tsx não encontrado"

# Migrar páginas
echo "Migrando páginas..."
cp app/page.tsx src/app/ 2>/dev/null || echo "page.tsx não encontrado"
cp app/about/page.tsx src/app/public/about/ 2>/dev/null || echo "about/page.tsx não encontrado"
cp app/collections/page.tsx src/app/public/collections/ 2>/dev/null || echo "collections/page.tsx não encontrado"
cp app/login/page.tsx src/app/public/login/ 2>/dev/null || echo "login/page.tsx não encontrado"
cp app/lookbook/page.tsx src/app/public/lookbook/ 2>/dev/null || echo "lookbook/page.tsx não encontrado"
cp app/privacy/page.tsx src/app/public/privacy/ 2>/dev/null || echo "privacy/page.tsx não encontrado"
cp app/product/page.tsx src/app/public/product/ 2>/dev/null || echo "product/page.tsx não encontrado"
cp app/shop/page.tsx src/app/public/shop/ 2>/dev/null || echo "shop/page.tsx não encontrado"
cp app/signup/page.tsx src/app/public/signup/ 2>/dev/null || echo "signup/page.tsx não encontrado"
cp app/profile/page.tsx src/app/auth/profile/ 2>/dev/null || echo "profile/page.tsx não encontrado"

# Verificar se há arquivos na pasta admin
if [ -d "app/admin" ]; then
  cp app/admin/page.tsx src/app/auth/admin/ 2>/dev/null || echo "admin/page.tsx não encontrado"
fi

# Migrar serviços e hooks
echo "Migrando serviços e hooks..."
if [ -d "app/services" ]; then
  mkdir -p src/lib/services
  cp -r app/services/* src/lib/services/ 2>/dev/null || echo "Nenhum arquivo em services/"
fi

if [ -d "app/hooks" ]; then
  mkdir -p src/lib/hooks
  cp -r app/hooks/* src/lib/hooks/ 2>/dev/null || echo "Nenhum arquivo em hooks/"
fi

if [ -d "app/utils" ]; then
  mkdir -p src/lib/utils
  cp -r app/utils/* src/lib/utils/ 2>/dev/null || echo "Nenhum arquivo em utils/"
fi

if [ -d "app/context" ]; then
  mkdir -p src/contexts
  cp -r app/context/* src/contexts/ 2>/dev/null || echo "Nenhum arquivo em context/"
fi

echo "Migração concluída!"
echo "IMPORTANTE: Verifique os arquivos e suas importações, pois pode ser necessário atualizar os caminhos." 