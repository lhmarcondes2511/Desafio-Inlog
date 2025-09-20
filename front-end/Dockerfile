# Dockerfile simples para a aplicação React

# Usar imagem oficial do Node.js
FROM node:18

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Fazer build da aplicação
RUN npm run build

# Instalar servidor simples para servir a aplicação
RUN npm install -g serve

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["serve", "-s", "build", "-l", "3000"]
