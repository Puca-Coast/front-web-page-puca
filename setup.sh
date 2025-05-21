#!/bin/bash

echo "===== Configurando o ambiente de desenvolvimento do Puca Coast ====="
echo "Instalando dependências necessárias para resolver erros de linter..."

# Verificar se o Node.js está na versão adequada
NODE_VERSION=$(node -v)
echo "Versão atual do Node.js: $NODE_VERSION"
echo "Usando nvm para mudar para Node.js v21..."
nvm use 21

# Instalar dependências que estão faltando
echo "Instalando dependências..."
DEPENDENCIES=(
    "jwt-decode"
    "react-cookie" 
    "react-toastify"
)

for dep in "${DEPENDENCIES[@]}"; do
    echo "Instalando $dep..."
    yarn add $dep
done

# Instalar dependências de desenvolvimento
echo "Instalando dependências de desenvolvimento..."
DEV_DEPENDENCIES=(
    "@types/node" 
    "@types/react" 
    "@types/react-dom"
    "@types/react-cookie"
)

for dev_dep in "${DEV_DEPENDENCIES[@]}"; do
    echo "Instalando $dev_dep..."
    yarn add -D $dev_dep
done

echo "===== Verificando a estrutura do projeto ====="

# Verificar se as pastas principais existem
mkdir -p app/services/api
mkdir -p app/hooks
mkdir -p app/utils
mkdir -p app/context

echo "===== Configuração concluída! ====="
echo "Execute 'yarn dev' para iniciar o servidor de desenvolvimento." 