# PUCA - Guia de Desenvolvimento

**Configuração para rodar o projeto completo em desenvolvimento**

---

## 🚀 **Setup Inicial**

### 1. **Clone dos Repositórios**
```bash
git clone [repository-url] PUCA
cd PUCA
```

### 2. **Configuração da API (Backend)**
```bash
cd puca-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações do MongoDB

# Rodar em desenvolvimento
npm run dev
```
**✅ API rodará em:** `http://localhost:3000`

### 3. **Configuração do Frontend**
```bash
cd ../front-web-page-puca

# Instalar dependências
yarn install

# Rodar em desenvolvimento
yarn dev -p 3001
```
**✅ Frontend rodará em:** `http://localhost:3001`

---

## 🔧 **Configuração de Ambiente**

### **Variáveis de Ambiente Automáticas:**

**📄 `.env` (produção):**
```bash
NEXT_PUBLIC_API_BASE_URL="https://puca-api.vercel.app"
```

**📄 `.env.local` (desenvolvimento):**
```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

### **Como Funciona:**
- ✅ **Desenvolvimento:** Frontend usa API local (`localhost:3000`)
- ✅ **Produção:** Frontend usa API do Vercel
- ✅ **Automático:** Next.js detecta o ambiente e usa a URL correta

---

## 🌐 **Fluxo de Desenvolvimento**

### **1. Rodar API Local:**
```bash
cd puca-api
npm run dev
# API disponível em http://localhost:3000
```

### **2. Rodar Frontend:**
```bash
cd front-web-page-puca
yarn dev -p 3001
# Frontend disponível em http://localhost:3001
```

### **3. Verificar Conexão:**
- Frontend faz requisições para `http://localhost:3000`
- Sem erros de CORS
- Dados carregam normalmente

---

## 🔍 **Verificação de Saúde**

### **API Status:**
```bash
curl http://localhost:3000/api/health
# Resposta esperada: {"status":"OK","timestamp":"..."}
```

### **Frontend Console:**
- ✅ Sem erros de CORS
- ✅ Requisições para `localhost:3000`
- ✅ Dados carregando normalmente

---

## 📝 **Scripts Úteis**

### **API (puca-api):**
```bash
npm run dev      # Desenvolvimento com nodemon
npm start        # Produção
npm run lint     # Linting
```

### **Frontend (front-web-page-puca):**
```bash
yarn dev         # Desenvolvimento (porta padrão)
yarn dev -p 3001 # Desenvolvimento (porta específica)
yarn build       # Build para produção
yarn start       # Servir build de produção
```

---

## ⚠️ **Troubleshooting**

### **Erro: "Origin not allowed by CORS"**
- ✅ **Resolvido:** API já configurada para `localhost:3001`
- ✅ **Verificar:** Se API está rodando na porta 3000

### **Erro: "Connection refused"**
- ✅ **Verificar:** Se API está rodando (`npm run dev`)
- ✅ **Verificar:** Se MongoDB está conectado
- ✅ **Verificar:** Variáveis de ambiente corretas

### **Erro: "Load failed"**
- ✅ **Verificar:** Se `.env.local` existe e está correto
- ✅ **Verificar:** Se frontend usa URL local em dev

---

## 🏗️ **Estrutura de URLs**

### **Desenvolvimento:**
- **Frontend:** `http://localhost:3001`
- **API:** `http://localhost:3000`
- **Requests:** `localhost:3001` → `localhost:3000`

### **Produção:**
- **Frontend:** `https://pucacoast.netlify.app`  
- **API:** `https://puca-api.vercel.app`
- **Requests:** `netlify.app` → `vercel.app`

---

**✅ Agora o desenvolvimento funciona completamente offline com API local!** 