<div align="center">

# ⚛️ Camila Product React UI

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0.18-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58.1-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)

*Enterprise-grade React SPA demonstrating polyglot API integration and modern frontend architecture*

[Features](#-features) •
[Getting Started](#-getting-started) •
[Architecture](#-architecture) •
[API Integration](#-api-integration) •
[Testing](#-testing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Integration](#-api-integration)
- [Authentication](#-authentication)
- [Internationalization](#-internationalization)
- [Testing](#-testing)
- [Performance](#-performance)
- [Docker Deployment](#-docker-deployment)
- [Development Guide](#-development-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🎯 Overview

Camila Product React UI is a production-ready single-page application built with React 18 and TypeScript. It showcases advanced patterns for integrating multiple API protocols (REST, GraphQL, gRPC-Web, RSocket) in a single application, with enterprise features like authentication, internationalization, and comprehensive testing.

### Key Highlights

✅ **Type-Safe**: Full TypeScript coverage with strict mode enabled  
✅ **Multi-Protocol**: REST, GraphQL, gRPC-Web, and RSocket support  
✅ **Production-Ready**: Docker deployment with Nginx, environment injection  
✅ **Well-Tested**: Unit, integration, and E2E tests with 80%+ coverage  
✅ **Performance**: Code splitting, lazy loading, optimized bundle size  
✅ **Accessible**: WCAG 2.1 AA compliant, semantic HTML, ARIA labels  

## ✨ Features

### 🚀 Core Features

- **Product Management Dashboard**: Display and manage products with weighted scoring
- **Multiple API Protocols**: Switch between REST, GraphQL, gRPC, and RSocket at runtime
- **Real-time Updates**: WebSocket and RSocket streaming for live data
- **Advanced Filtering**: Dynamic weight configuration for product scoring
- **Data Visualization**: Interactive charts (heatmaps, bar charts, line charts)
- **Search & Pagination**: Efficient data browsing with server-side pagination

### 🔐 Security & Auth

- **OAuth2/OIDC**: Integration with Keycloak using PKCE flow
- **Token Management**: Automatic refresh and secure storage
- **Protected Routes**: Route guards for authenticated content
- **Auth Toggle**: Disable authentication for development/testing

### 🌍 User Experience

- **Internationalization**: English and Spanish language support
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Dark/Light Themes**: (Ready for implementation)
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages and fallbacks
- **Accessibility**: Keyboard navigation, screen reader support

### 🛠️ Developer Experience

- **Hot Module Replacement**: Instant feedback with Vite HMR
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Enforced code quality and best practices
- **Testing**: Comprehensive test suite with Vitest + Playwright
- **Docker Support**: Containerized development and production builds

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
node >= 20.x (LTS recommended)
npm >= 10.x
docker >= 24.x (optional, for containerized deployment)
```

### Quick Start

```bash
# 1. Navigate to the project directory
cd camila-product-react-ui

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:3030
```

### Environment Configuration

Create a `.env.local` file with the following configuration:

```bash
# Authentication (OAuth2/OIDC)
VITE_AUTH_ENABLED=true
VITE_AUTH_AUTHORITY=http://localhost:9191/realms/camila-realm
VITE_AUTH_CLIENT_ID=camila-client
VITE_AUTH_CLIENT_SECRET=your-client-secret

# API Endpoints
VITE_API_BASE_URL=http://localhost:8090/product-dev/api
VITE_GRAPHQL_ENDPOINT=http://localhost:8090/product-dev/api/graphql
VITE_GRPC_ENDPOINT=http://localhost:8765
VITE_RSOCKET_URL=ws://localhost:7000/product-dev/api/rsocket

# Application
VITE_PORT=3030
VITE_DEFAULT_LANGUAGE=en-US
VITE_API_VERSION=1.0.0
```

See [`.env.example`](.env.example) for full documentation.

## 📁 Project Structure

```
camila-product-react-ui/
├── src/
│   ├── api/                      # API clients for different protocols
│   │   ├── restClient.ts         # Axios-based REST client
│   │   ├── graphqlClient.ts      # GraphQL client with request/response types
│   │   ├── grpcClient.ts         # gRPC-Web client with Protocol Buffers
│   │   ├── rsocketClient.ts      # RSocket client for reactive streams
│   │   └── __tests__/            # API client tests
│   │
│   ├── components/               # React components
│   │   ├── Header.tsx            # App header with auth controls
│   │   ├── Footer.tsx            # App footer
│   │   ├── ProductCard.tsx       # Product display card
│   │   ├── ChartGallery.tsx      # Chart visualizations
│   │   ├── ApiSelector.tsx       # API protocol selector
│   │   ├── WeightForm.tsx        # Product weight configuration
│   │   ├── PrivateRoute.tsx      # Route protection component
│   │   └── __tests__/            # Component tests
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useProducts.ts        # Product data fetching hook
│   │   └── useAuth.ts            # Authentication hook
│   │
│   ├── context/                  # React Context providers
│   │   └── AuthContext.tsx       # Authentication state management
│   │
│   ├── i18n/                     # Internationalization setup
│   │   ├── config.ts             # i18next configuration
│   │   └── locales/              # Translation files
│   │       ├── en-US.json        # English translations
│   │       └── es-ES.json        # Spanish translations
│   │
│   ├── proto/                    # Protocol Buffer definitions
│   │   └── product.proto         # gRPC service definitions
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── api.ts                # API-related types
│   │   ├── product.ts            # Product domain types
│   │   └── auth.ts               # Authentication types
│   │
│   ├── utils/                    # Utility functions
│   │   ├── debounce.ts           # Performance utilities
│   │   └── formatters.ts         # Data formatters
│   │
│   ├── styles/                   # Global styles
│   │   └── index.css             # CSS styles
│   │
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── vite-env.d.ts             # Vite type declarations
│
├── e2e/                          # End-to-end tests
│   ├── example.spec.ts           # Playwright test specs
│   └── fixtures/                 # Test fixtures
│
├── public/                       # Static assets
│   ├── favicon.ico               # App favicon
│   └── locales/                  # Public translation files
│
├── .env.example                  # Environment variable template
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── Dockerfile                    # Docker build instructions
├── docker-compose.yml            # Docker Compose configuration
├── nginx.conf                    # Nginx production configuration
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── vitest.config.ts              # Vitest test configuration
├── playwright.config.ts          # Playwright E2E configuration
└── README.md                     # This file
```

## 🏗️ Architecture

### Component Architecture

```
┌─────────────────────────────────────────┐
│              App.tsx                    │
│  (Main component, routing, layout)     │
└─────────────────────────────────────────┘
                  │
    ┌─────────────┴──────────────┐
    │                            │
┌───▼────────┐          ┌────────▼────┐
│  Header    │          │   Footer    │
│  (Auth)    │          │  (Info)     │
└────────────┘          └─────────────┘
                  │
    ┌─────────────┴──────────────┐
    │                            │
┌───▼─────────┐       ┌──────────▼──────┐
│ ApiSelector │       │  WeightForm     │
│ (Protocol)  │       │  (Filters)      │
└─────────────┘       └─────────────────┘
                  │
    ┌─────────────┴──────────────┐
    │                            │
┌───▼────────┐          ┌────────▼────────┐
│ ProductCard│          │  ChartGallery   │
│ (Display)  │          │  (Viz)          │
└────────────┘          └─────────────────┘
```

### State Management

- **Global State**: React Context for auth and theme
- **Server State**: Custom hooks with built-in caching
- **Component State**: React.useState for local UI state
- **Form State**: Controlled components with validation

### Data Flow

```
User Action → Component → Custom Hook → API Client → Backend API
                ↓              ↓             ↓
            Local State   Cache Layer   Network Request
                ↓              ↓             ↓
            Re-render ← Updated State ← Response
```

## 🔌 API Integration

### Supported Protocols

#### 1. REST API (Axios)

```typescript
// Usage example
import { restClient } from './api/restClient';

const products = await restClient.getAllProducts(params);
const product = await restClient.getProductById(id);
```

**Features**:
- Axios interceptors for auth and error handling
- Request/response transformation
- Retry logic with exponential backoff
- Timeout configuration

#### 2. GraphQL (graphql-request)

```typescript
// Usage example
import { graphqlClient } from './api/graphqlClient';

const data = await graphqlClient.getAllProducts(params);
const product = await graphqlClient.getProductById(id);
```

**Features**:
- Type-safe queries and mutations
- Fragment composition
- Error handling with detailed messages
- Variables validation

#### 3. gRPC-Web (grpc-web + Envoy)

```typescript
// Usage example
import { grpcClient } from './api/grpcClient';

const response = await grpcClient.listProducts(request);
const product = await grpcClient.getProduct(request);
```

**Features**:
- Protocol Buffer serialization
- Streaming support (server-side)
- Type-safe RPC calls
- Metadata for authentication

**Setup Requirements**:
- Envoy proxy for gRPC-Web translation
- Protocol Buffer compilation
- Service definitions in `.proto` files

#### 4. RSocket (rsocket-websocket-client)

```typescript
// Usage example
import { rsocketClient } from './api/rsocketClient';

// Request-Response
const product = await rsocketClient.requestResponse(data);

// Request-Stream
const stream = rsocketClient.requestStream(data);
stream.subscribe({
  onNext: (payload) => console.log(payload),
  onComplete: () => console.log('Complete'),
});
```

**Features**:
- Bidirectional streaming
- Backpressure support
- Connection resilience
- Multiple interaction models (request-response, stream, channel)

### API Client Configuration

All API clients support:
- ✅ Authentication token injection
- ✅ Request/response logging (dev mode)
- ✅ Error transformation
- ✅ TypeScript type safety
- ✅ Configurable timeouts

## 🔐 Authentication

### OAuth2/OIDC with Keycloak

The application uses **oidc-client-ts** for authentication:

```typescript
// Auth configuration
{
  authority: VITE_AUTH_AUTHORITY,
  client_id: VITE_AUTH_CLIENT_ID,
  redirect_uri: window.location.origin + '/callback',
  response_type: 'code',
  scope: 'openid profile email',
  // PKCE enabled by default
}
```

### Authentication Flow

```
1. User clicks "Login"
2. Redirect to Keycloak
3. User authenticates
4. Redirect back with auth code
5. Exchange code for tokens (PKCE)
6. Store tokens securely
7. Inject token in API requests
8. Auto-refresh before expiration
```

### Protected Routes

```typescript
// Usage
<PrivateRoute>
  <ProtectedComponent />
</PrivateRoute>
```

### Development Mode

Disable auth for local development:

```bash
# .env.local
VITE_AUTH_ENABLED=false
```

## 🌍 Internationalization

### Supported Languages

- 🇺🇸 English (en-US) - Default
- 🇪🇸 Spanish (es-ES)

### Usage

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('es-ES')}>
        Español
      </button>
    </div>
  );
}
```

### Adding Translations

1. Add keys to `src/locales/en-US.json`
2. Add translations to `src/locales/es-ES.json`
3. Use `t('your.key')` in components

## 🧪 Testing

### Test Stack

- **Unit/Integration**: Vitest + Testing Library + happy-dom
- **E2E**: Playwright
- **Coverage**: c8/v8
- **Mocking**: MSW (Mock Service Worker)

### Running Tests

```bash
# Unit & Integration Tests
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # With coverage report
npm run test:ui           # Visual test UI

# End-to-End Tests
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:debug    # Debug mode with inspector

# Run All Tests
npm run test:all          # Unit + E2E
npm run test:ci           # Optimized for CI/CD
```

### Writing Tests

#### Component Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = { id: '1', name: 'Test Product' };
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

#### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('can search for products', async ({ page }) => {
  await page.goto('http://localhost:3030');
  await page.fill('#search', 'laptop');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.product-card')).toBeVisible();
});
```

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## ⚡ Performance

### Optimization Techniques

#### Code Splitting

```typescript
// Lazy load heavy components
const ChartGallery = lazy(() => import('./components/ChartGallery'));

<Suspense fallback={<LoadingSkeleton />}>
  <ChartGallery />
</Suspense>
```

#### Memoization

```typescript
// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(ExpensiveComponent);

// Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);

// Memoize computed values
const filteredProducts = useMemo(
  () => products.filter(filter),
  [products, filter]
);
```

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Lighthouse Score**: > 90

## 🐳 Docker Deployment

### Multi-Stage Build

The Dockerfile uses a two-stage build for optimal image size:

```dockerfile
# Stage 1: Build (Node.js)
FROM node:25-alpine AS builder
# ... build steps ...

# Stage 2: Serve (Nginx)
FROM nginx:1.25-alpine
# ... nginx setup ...
```

**Image Size**: ~25MB (compressed)

### Quick Deploy

```bash
# Using Docker Compose (recommended)
npm run docker:up

# Or manual build
npm run docker:build
npm run docker:run

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

### Docker Compose

```yaml
services:
  camila-ui:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://api.example.com
      - VITE_AUTH_AUTHORITY=https://auth.example.com
    restart: unless-stopped
```

### Nginx Configuration

Production Nginx features:
- Gzip compression
- Static asset caching
- Security headers (CSP, X-Frame-Options, etc.)
- SPA routing support (404 → index.html)
- Health check endpoint

### Environment Variable Injection

Runtime environment variables with `docker-entrypoint.sh`:

```bash
# Variables are injected into built files at container startup
docker run -e VITE_API_BASE_URL=https://api.prod.com camila-ui
```

## 💻 Development Guide

### Available Scripts

```json
{
  "dev": "Start development server",
  "build": "Build production bundle",
  "preview": "Preview production build",
  "lint": "Check code quality",
  "lint:fix": "Fix linting issues",
  "test": "Run unit tests (watch)",
  "test:run": "Run unit tests (once)",
  "test:coverage": "Generate coverage report",
  "test:e2e": "Run E2E tests",
  "test:all": "Run all tests",
  "docker:build": "Build Docker image",
  "docker:up": "Start Docker containers",
  "docker:down": "Stop Docker containers"
}
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Max line length**: 100 characters
- **React**: Functional components with hooks

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Run tests
npm run test:all

# 4. Push and create PR
git push origin feature/my-feature
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🔧 Troubleshooting

### Common Issues

#### Issue: Module not found errors

```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port 3030 already in use

```bash
# Solution: Change port in .env.local
VITE_PORT=3031
```

#### Issue: gRPC requests failing

```bash
# Solution: Ensure Envoy proxy is running
docker-compose up envoy
# Or start Envoy manually on port 8765
```

#### Issue: Authentication redirects not working

```bash
# Solution: Check redirect URI configuration
# Must match: http://localhost:3030/callback
# In Keycloak client settings
```

#### Issue: Docker build fails

```bash
# Solution: Increase Docker memory limit
# Docker Desktop → Settings → Resources → Memory (4GB+)
```

### Debug Mode

Enable verbose logging:

```bash
# .env.local
VITE_LOG_LEVEL=debug
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** code style guidelines
4. **Write** tests for new features
5. **Update** documentation
6. **Submit** a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the GNU General Public License v3.0. See [LICENSE.md](../LICENSE.md) for details.

## 🙋 Support

- **Documentation**: This README + [Main README](../README.md)
- **Issues**: [GitHub Issues](https://github.com/JuanPabloJimenezEsclusa/camila-services/issues)
- **Email**: juan.pablo.jimenez.esclusa@gmail.com

---

<div align="center">

**[⬆ Back to Top](#-camila-product-react-ui)**

Built with ⚛️ React, 💙 TypeScript, and ☕ Coffee

</div>
