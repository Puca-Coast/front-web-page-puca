#!/bin/bash

# Script para remover pastas antigas após confirmação da migração

echo "Este script irá remover as pastas antigas do projeto após confirmar que tudo foi migrado."
echo "ATENÇÃO: Esta operação não pode ser desfeita!"
echo ""
read -p "Você deseja continuar? (s/n): " confirma

if [ "$confirma" != "s" ]; then
    echo "Operação cancelada."
    exit 0
fi

echo ""
echo "Removendo pastas antigas..."

# Remover pasta app
if [ -d "app" ]; then
    echo "Removendo app/"
    rm -rf app/
fi

# Remover pasta components
if [ -d "components" ]; then
    echo "Removendo components/"
    rm -rf components/
fi

echo ""
echo "Limpeza concluída! O projeto agora está usando apenas a nova estrutura." 