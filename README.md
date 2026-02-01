<div align="center">

# 🚀 Camila Services Dashboard

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)

[![Lint](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/workflows/%F0%9F%94%8D%20Lint/badge.svg)](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/actions/workflows/lint.yml)
[![Test](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/workflows/%F0%9F%A7%AA%20Test/badge.svg)](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/actions/workflows/test.yml)
[![Build](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/workflows/%F0%9F%8F%97%EF%B8%8F%20Build%20%26%20Package/badge.svg)](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/actions/workflows/build.yml)
[![Security](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/workflows/%F0%9F%94%92%20Security%20Audit/badge.svg)](https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard/actions/workflows/security.yml)

*A modern, polyglot API dashboard showcasing REST, GraphQL, gRPC, and RSocket integrations*

[Features](#-features) •
[Quick Start](#-quick-start) •
[Architecture](#-architecture) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

---

## 📋 Overview

Camila Services Dashboard is a comprehensive monorepo showcasing modern API communication patterns through a React-based web application. This project demonstrates production-ready integration with multiple API protocols, authentication flows, and performance optimization techniques.

### What's Inside

- **camila-product-react-ui**: Full-featured React SPA with multi-protocol API support
- **envoy.yaml**: Envoy proxy configuration for gRPC-Web gateway

## ✨ Features

### 🎯 Core Capabilities

- **Multi-Protocol API Support**: REST, GraphQL, gRPC-Web, and RSocket
- **Authentication**: OAuth2/OIDC integration with Keycloak
- **Internationalization**: Multi-language support (i18n)
- **Real-time Updates**: WebSocket and RSocket streaming
- **Data Visualization**: Interactive charts with Chart.js
- **Performance Optimized**: Code splitting, lazy loading, memoization

### 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript 5, Vite 6
- **Routing**: React Router 7
- **State Management**: React Context + Custom Hooks
- **API Clients**: Axios, GraphQL Request, gRPC-Web, RSocket
- **Testing**: Vitest, Playwright, Testing Library
- **Code Quality**: ESLint 9, TypeScript strict mode
- **Containerization**: Docker, Docker Compose, Nginx

## 🚀 Quick Start

### Prerequisites

```bash
# Required
node >= 20.x
npm >= 10.x

# Optional (for containerized deployment)
docker >= 24.x
docker-compose >= 2.x
```

### Installation

```bash
# Clone the repository
git clone https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard.git
cd camila-services-dashboard

# Install dependencies for React UI
cd camila-product-react-ui
npm install

# Copy environment configuration
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server (http://localhost:3030)
npm run dev

# Run tests
npm run test          # Unit tests with watch mode
npm run test:e2e      # End-to-end tests
npm run test:all      # All tests

# Code quality
npm run lint          # Check linting
npm run lint:fix      # Fix linting issues
```

### Docker Deployment

```bash
# Build and run with Docker Compose
npm run docker:up

# Or build manually
docker build -t camila-product-react-ui:1.0.0 .
docker run -p 80:80 camila-product-react-ui:1.0.0

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

## 🏗️ Architecture

### Monorepo Structure

```
camila-services-dashboard/
├── camila-product-react-ui/    # React SPA application
│   ├── src/
│   │   ├── api/                # API clients (REST, GraphQL, gRPC, RSocket)
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # Context providers
│   │   ├── i18n/               # Internationalization
│   │   ├── proto/              # Protocol Buffer definitions
│   │   └── types/              # TypeScript type definitions
│   ├── e2e/                    # Playwright E2E tests
│   ├── public/                 # Static assets
│   ├── Dockerfile              # Multi-stage Docker build
│   └── nginx.conf              # Production web server config
├── envoy.yaml/                 # Envoy proxy for gRPC-Web
├── CODE_OF_CONDUCT.md          # Community guidelines
├── CONTRIBUTING.md             # Contribution guide
├── LICENSE.md                  # GPL v3 license
└── TERMS_OF_SERVICE.md         # Terms of service
```

### API Communication Patterns

| Protocol | Use Case | Implementation |
|----------|----------|----------------|
| **REST** | Standard CRUD operations | Axios with interceptors |
| **GraphQL** | Flexible data queries | graphql-request |
| **gRPC-Web** | High-performance RPC | grpc-web + Envoy proxy |
| **RSocket** | Bidirectional streaming | rsocket-websocket-client |

### Authentication Flow

```
User → React App → Keycloak (OAuth2/OIDC) → Token → API Requests
                   ↓
            oidc-client-ts (PKCE)
```

## 📚 Documentation

### Key Documents

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards
- [Terms of Service](TERMS_OF_SERVICE.md) - Usage terms
- [React UI Documentation](camila-product-react-ui/README.md) - Detailed UI guide

### Configuration

#### Environment Variables

Key variables for `.env.local`:

```bash
# Authentication
VITE_AUTH_ENABLED=true
VITE_AUTH_AUTHORITY=http://localhost:9191/realms/camila-realm
VITE_AUTH_CLIENT_ID=camila-client

# API Endpoints
VITE_API_BASE_URL=http://localhost:8090/product-dev/api
VITE_GRAPHQL_ENDPOINT=http://localhost:8090/product-dev/api/graphql
VITE_GRPC_ENDPOINT=http://localhost:8765
VITE_RSOCKET_URL=ws://localhost:7000/product-dev/api/rsocket

# App Config
VITE_PORT=3030
VITE_DEFAULT_LANGUAGE=en-US
```

See [.env.example](camila-product-react-ui/.env.example) for full configuration.

## 🧪 Testing Strategy

### Test Coverage

```bash
# Unit & Integration Tests (Vitest + Testing Library)
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # Coverage report
npm run test:ui           # Visual test UI

# End-to-End Tests (Playwright)
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive mode
npm run test:e2e:debug    # Debug mode

# CI Pipeline
npm run test:ci           # Optimized for CI/CD
```

### Test Philosophy

- **Unit Tests**: Component logic, hooks, utilities
- **Integration Tests**: API clients, context providers
- **E2E Tests**: Critical user flows, multi-protocol scenarios

## 🐳 Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Docker Production

The Docker image uses multi-stage builds for optimal size:

1. **Builder Stage**: Node.js Alpine (build React app)
2. **Runtime Stage**: Nginx Alpine (serve static files)

```dockerfile
# Optimized features:
- Multi-stage build (reduces image size ~85%)
- Nginx with gzip compression
- Runtime environment variable injection
- Security headers configured
- Health check endpoint
```

### Container Orchestration

```bash
# Docker Compose (recommended for local/dev)
docker-compose up -d

# Kubernetes (production)
# See kubernetes/ directory for manifests (if applicable)
```

## 🔧 Development Tools

### IDE Configuration

Recommended VSCode extensions:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- React/JSX snippets
- Docker
- GitLens

### Code Quality Checks

```bash
# Pre-commit validation (recommended setup)
npm run lint:fix && npm run test:run
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add missing tests
refactor: improve code structure
style: format code
chore: update dependencies
```

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see [LICENSE.md](LICENSE.md) for details.

## 🙏 Acknowledgments

- React team for the excellent framework
- Vite team for the blazing-fast build tool
- gRPC and Envoy communities
- All contributors and supporters

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/JuanPabloJimenezEsclusa/camila-services/issues) | [GitLab Issues](https://gitlab.com/side-projects9205424/camila-services/issues)
- **Email**: juan.pablo.jimenez.esclusa@gmail.com
- **Discussions**: Use GitHub/GitLab discussions for questions

---

<div align="center">

**[⬆ Back to Top](#-camila-services-dashboard)**

Made with ❤️ by the Camila Services team

</div>
