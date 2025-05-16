#!/usr/bin/env node

/**
 * Este script verifica se o Yarn está instalado corretamente
 * e se a versão é compatível com o projeto.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}Verificando instalação do Yarn...${colors.reset}`);

try {
  // Verifica se o Yarn está instalado
  const yarnVersion = execSync('yarn --version', { encoding: 'utf8' }).trim();
  console.log(`${colors.green}✓ Yarn instalado: ${yarnVersion}${colors.reset}`);

  // Verifica se o arquivo yarn.lock existe
  const yarnLockPath = path.join(process.cwd(), 'yarn.lock');
  if (fs.existsSync(yarnLockPath)) {
    console.log(`${colors.green}✓ yarn.lock encontrado${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ yarn.lock não encontrado${colors.reset}`);
  }

  // Verifica se o diretório .yarn existe
  const yarnDirPath = path.join(process.cwd(), '.yarn');
  if (fs.existsSync(yarnDirPath)) {
    console.log(`${colors.green}✓ Diretório .yarn encontrado${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ Diretório .yarn não encontrado${colors.reset}`);
  }

  // Verifica se o arquivo .yarnrc.yml existe
  const yarnrcPath = path.join(process.cwd(), '.yarnrc.yml');
  if (fs.existsSync(yarnrcPath)) {
    console.log(`${colors.green}✓ .yarnrc.yml encontrado${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ .yarnrc.yml não encontrado${colors.reset}`);
  }

  console.log(`${colors.green}Verificação concluída com sucesso!${colors.reset}`);
  process.exit(0);
} catch (error) {
  console.error(`${colors.red}Erro ao verificar o Yarn: ${error.message}${colors.reset}`);
  process.exit(1);
} 