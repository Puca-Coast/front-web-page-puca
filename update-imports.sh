#!/bin/bash

# Script para atualizar importações para a nova estrutura de pastas

echo "Atualizando importações para a nova estrutura..."

# Encontrar todos os arquivos .ts, .tsx, .js e .jsx na pasta src e substituir os caminhos de importação
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read file; do
  echo "Processando $file..."

  # Substituir @/components/Home/ por @/components/features/home/
  sed -i 's|@/components/Home/|@/components/features/home/|g' "$file"

  # Substituir @/components/LookBook/ por @/components/features/lookbook/
  sed -i 's|@/components/LookBook/|@/components/features/lookbook/|g' "$file"

  # Substituir @/components/Shop/ por @/components/features/shop/
  sed -i 's|@/components/Shop/|@/components/features/shop/|g' "$file"

  # Substituir @/components/Cart/ por @/components/features/cart/
  sed -i 's|@/components/Cart/|@/components/features/cart/|g' "$file"

  # Substituir imports diretos dos componentes da raiz
  sed -i 's|@/components/Header|@/components/layout/Header|g' "$file"
  sed -i 's|@/components/Footer|@/components/layout/Footer|g' "$file"
  sed -i 's|@/components/CartButton|@/components/features/cart/CartButton|g' "$file"
  sed -i 's|@/components/shoppingCart|@/components/features/cart/shoppingCart|g' "$file"
  sed -i 's|@/components/WavyLoader|@/components/ui/WavyLoader|g' "$file"
  sed -i 's|@/components/userLogin|@/components/features/auth/Login|g' "$file"
  
  # Corrigir importações de contexto
  sed -i 's|@/app/context/CartContext|@/contexts/CartContext|g' "$file"

  # Corrigir importações de CSS
  sed -i 's|import "../styles/|import "@/styles/|g' "$file"
  sed -i 's|import "../../styles/|import "@/styles/|g' "$file"
  sed -i 's|import "./styles/|import "@/styles/|g' "$file"

  # Substituir imports de @/src/ para @/
  sed -i 's|@/src/|@/|g' "$file"
done

echo "Importações atualizadas com sucesso!" 