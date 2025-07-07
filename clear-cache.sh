#!/bin/bash

# Script para limpar cache e otimizar assets
# Uso: ./clear-cache.sh

echo "🧹 Limpando cache do Next.js..."

# Limpar cache do Next.js
rm -rf .next/cache
rm -rf .next/static
rm -rf .next/build-manifest.json
rm -rf .next/export-marker.json

echo "🗑️ Removendo node_modules..."
rm -rf node_modules

echo "📦 Reinstalando dependências..."
npm install

echo "🔧 Verificando integridade dos assets..."
if [ ! -f "public/assets/Logo2.png" ]; then
    echo "⚠️ Logo2.png não encontrado em public/assets/"
else
    echo "✅ Logo2.png encontrado"
fi

if [ ! -f "public/assets/logo.png" ]; then
    echo "⚠️ logo.png não encontrado em public/assets/"
else
    echo "✅ logo.png encontrado"
fi

if [ ! -f "public/assets/logo_mini.png" ]; then
    echo "⚠️ logo_mini.png não encontrado em public/assets/"
else
    echo "✅ logo_mini.png encontrado"
fi

echo "🏗️ Fazendo build limpo..."
npm run build

echo "✅ Cache limpo e build otimizado!"
echo "🚀 Pronto para deploy!"

# Listar assets para verificação
echo "📋 Assets disponíveis:"
ls -la public/assets/ | grep -E '\.(png|jpg|svg)$' 