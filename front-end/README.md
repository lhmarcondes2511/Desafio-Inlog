# 🚗 Vehicle Management App

Aplicação React para gerenciamento de veículos com mapa e geolocalização.

## 📋 Funcionalidades

- ✅ **Lista de Veículos**: Visualiza todos os veículos cadastrados
- ✅ **Mapa Interativo**: Mostra a localização dos veículos no mapa
- ✅ **Ordenação por Proximidade**: Lista ordenada pela distância do usuário
- ✅ **Cadastro de Veículos**: Formulário para adicionar novos veículos
- ✅ **Geolocalização**: Usa a localização atual do usuário
- ✅ **API Fake**: Simulação de API com MirageJS
- ✅ **Docker**: Containerização da aplicação

## 🚀 Como executar

### Opção 1: Desenvolvimento normal
```bash
# Instalar dependências
npm install

# Executar aplicação
npm start
```

### Opção 2: Com Docker (mais fácil)
```bash
# Executar com Docker Compose
docker-compose up --build
```

Acesse: http://localhost:3000

## 📦 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Navigation.tsx   # Menu de navegação
│   └── VehicleMap.tsx   # Componente do mapa
├── contexts/            # Contextos React
│   └── VehicleContext.tsx # Gerenciamento de estado
├── pages/               # Páginas da aplicação
│   ├── VehicleList.tsx  # Lista de veículos
│   └── VehicleRegister.tsx # Cadastro de veículos
├── services/            # Serviços e APIs
│   ├── api.ts          # Funções da API
│   └── mirage.ts       # Configuração da API fake
└── types/               # Tipos TypeScript
    └── Vehicle.ts      # Interface do veículo
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **React Router** - Navegação entre páginas
- **React Hook Form** - Gerenciamento de formulários
- **MirageJS** - API fake para desenvolvimento
- **Axios** - Cliente HTTP
- **CSS3** - Estilização
- **Docker** - Containerização

## 📱 Páginas

### 1. Lista de Veículos (`/`)
- Exibe todos os veículos cadastrados
- Ordena por proximidade da localização do usuário
- Mostra mapa com pins dos veículos
- Informações: identificador, placa, rastreador, coordenadas, distância

### 2. Cadastro de Veículos (`/register`)
- Formulário para cadastrar novos veículos
- Campos: identificador, placa, número do rastreador, coordenadas
- Validação de dados
- Opção de usar localização atual
- Campo opcional para imagem (bônus)

## 🗺️ Estrutura de Dados

```typescript
interface Vehicle {
  id?: string;
  identifier: string;           // Ex: "Vehicle 1"
  license_plate: string;        // Ex: "AAA-9A99"
  tracker_serial_number: string; // Ex: "A0000000"
  coordinates: {
    latitude: number;           // Ex: -25.43247
    longitude: number;          // Ex: -49.27845
  };
  image?: string;              // URL da imagem (opcional)
  created_at?: string;         // Data de criação
}
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm test -- --coverage
```

## 🐳 Docker

### Comandos básicos:
```bash
# Construir imagem
docker build -t vehicle-app .

# Executar container
docker run -p 3000:3000 vehicle-app

# Usar Docker Compose
docker-compose up --build
```

Veja [DOCKER.md](DOCKER.md) para mais detalhes.

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://localhost:3000
```

### API Fake (MirageJS)
A aplicação usa MirageJS para simular uma API real:
- Gera 10 veículos de exemplo automaticamente
- Endpoints: GET, POST, PUT, DELETE `/api/vehicles`
- Dados persistem apenas durante a sessão

## 🌟 Funcionalidades Bônus Implementadas

- ✅ **Campo de imagem** no cadastro de veículos
- ✅ **Containerização Docker** completa
- ✅ **Geolocalização automática** do usuário
- ✅ **Cálculo de distância** entre usuário e veículos
- ✅ **Interface responsiva** para mobile
- ✅ **Validação de formulários** com mensagens de erro
- ✅ **Loading states** e tratamento de erros

## 🎯 Próximos Passos (Melhorias Futuras)

- [ ] Integração com mapa real (Leaflet/Google Maps)
- [ ] Busca e filtros de veículos
- [ ] Upload de imagens
- [ ] Autenticação de usuários
- [ ] API backend real
- [ ] Testes E2E com Cypress
- [ ] PWA (Progressive Web App)

## 👥 Desenvolvido por

Lucas Marcondes - Desafio Técnico Inlog

---

**Nota**: Esta aplicação foi desenvolvida como parte do desafio técnico para a vaga de FullStack Developer na Inlog. Demonstra conhecimentos em React, TypeScript, gerenciamento de estado, APIs, geolocalização e Docker.
