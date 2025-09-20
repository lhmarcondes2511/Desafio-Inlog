# 🐳 Docker - Guia Simples

Como usar Docker para executar a aplicação de veículos.

## 📋 O que você precisa

- Docker instalado no seu computador

## 🚀 Como usar (3 passos simples)

### 1. Construir a aplicação
```bash
docker build -t vehicle-app .
```

### 2. Executar a aplicação
```bash
docker run -p 3000:3000 vehicle-app
```

### 3. Acessar no navegador
Abra: http://localhost:3000

## 🛠️ Usando Docker Compose (ainda mais fácil)

### 1. Executar tudo de uma vez
```bash
docker-compose up --build
```

### 2. Acessar no navegador
Abra: http://localhost:3000

### 3. Para parar
```bash
docker-compose down
```

## 📝 Comandos úteis

```bash
# Ver containers rodando
docker ps

# Ver logs da aplicação
docker logs vehicle-management-app

# Parar um container
docker stop vehicle-management-app

# Remover container
docker rm vehicle-management-app

# Remover imagem
docker rmi vehicle-app
```

## 🚨 Se algo der errado

### Porta já está em uso?
Mude a porta no comando:
```bash
docker run -p 8080:3000 vehicle-app
```
Então acesse: http://localhost:8080

### Container não inicia?
Veja os logs:
```bash
docker logs vehicle-management-app
```

### Quer reconstruir tudo?
```bash
docker-compose down
docker-compose up --build --force-recreate
```
