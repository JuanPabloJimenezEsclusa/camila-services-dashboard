/**
 * MSW Handlers for E2E Tests
 * 
 * Mocks all backend APIs:
 * - REST API (Express/Spring Boot)
 * - GraphQL API
 * - Keycloak Authentication
 * 
 * Note: gRPC and RSocket require specialized mocking outside MSW
 */

import { http, HttpResponse, graphql } from 'msw';
import { mockProducts, findProductById, sortProducts } from './data';

// Use relative paths for browser MSW (not full URLs)
// This intercepts requests before they reach Vite proxy
const API_BASE_URL = '/product-dev/api';
const KEYCLOAK_BASE = 'http://localhost:9191/realms/camila-realm';

export const handlers = [
  // =========================================================================
  // KEYCLOAK AUTHENTICATION MOCKS
  // =========================================================================
  
  // OpenID Configuration
  http.get(`${KEYCLOAK_BASE}/.well-known/openid-configuration`, () => {
    return HttpResponse.json({
      issuer: KEYCLOAK_BASE,
      authorization_endpoint: `${KEYCLOAK_BASE}/protocol/openid-connect/auth`,
      token_endpoint: `${KEYCLOAK_BASE}/protocol/openid-connect/token`,
      userinfo_endpoint: `${KEYCLOAK_BASE}/protocol/openid-connect/userinfo`,
      jwks_uri: `${KEYCLOAK_BASE}/protocol/openid-connect/certs`,
      end_session_endpoint: `${KEYCLOAK_BASE}/protocol/openid-connect/logout`,
    });
  }),

  // Token endpoint
  http.post(`${KEYCLOAK_BASE}/protocol/openid-connect/token`, () => {
    return HttpResponse.json({
      access_token: 'mock_access_token_e2e',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'mock_refresh_token',
      scope: 'openid profile email',
      id_token: 'mock_id_token',
    });
  }),

  // User info endpoint
  http.get(`${KEYCLOAK_BASE}/protocol/openid-connect/userinfo`, () => {
    return HttpResponse.json({
      sub: 'camila-user-123',
      name: 'Camila User',
      preferred_username: 'camila',
      email: 'camila@example.com',
    });
  }),

  // JWKS endpoint (JSON Web Key Set)
  http.get(`${KEYCLOAK_BASE}/protocol/openid-connect/certs`, () => {
    return HttpResponse.json({
      keys: [
        {
          kid: 'mock-key-id',
          kty: 'RSA',
          alg: 'RS256',
          use: 'sig',
          n: 'mock-n-value',
          e: 'AQAB',
        },
      ],
    });
  }),

  // =========================================================================
  // REST API MOCKS
  // =========================================================================
  
  // GET /products - List all products
  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (id) {
      const product = findProductById(parseInt(id));
      return HttpResponse.json(product ? [product] : []);
    }
    
    return HttpResponse.json(mockProducts);
  }),

  // GET /products/:id - Get single product
  http.get(`${API_BASE_URL}/products/:id`, ({ params }) => {
    const product = findProductById(parseInt(params.id as string));
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  // POST /products/sort - Sort products with weights
  http.post(`${API_BASE_URL}/products/sort`, async ({ request }) => {
    const body = await request.json() as {
      salesUnits?: string;
      stock?: string;
      profitMargin?: string;
      daysInStock?: string;
    };

    const weights = {
      salesUnits: parseFloat(body.salesUnits || '0'),
      stock: parseFloat(body.stock || '0'),
      profitMargin: parseFloat(body.profitMargin || '0'),
      daysInStock: parseFloat(body.daysInStock || '0'),
    };

    const sorted = sortProducts(weights);
    
    return HttpResponse.json({
      products: sorted,
      totalCount: sorted.length,
    });
  }),

  // =========================================================================
  // GRAPHQL API MOCKS
  // =========================================================================
  
  // Query: products - List all products
  graphql.query('GetProducts', ({ variables }) => {
    const { id } = variables as { id?: number };
    
    if (id) {
      const product = findProductById(id);
      return HttpResponse.json({
        data: {
          products: product ? [product] : [],
        },
      });
    }
    
    return HttpResponse.json({
      data: {
        products: mockProducts,
      },
    });
  }),

  // Query: product - Get single product by ID
  graphql.query('GetProduct', ({ variables }) => {
    const { id } = variables as { id: number };
    const product = findProductById(id);
    
    if (!product) {
      return HttpResponse.json({
        errors: [
          {
            message: `Product with ID ${id} not found`,
            extensions: { code: 'NOT_FOUND' },
          },
        ],
      });
    }
    
    return HttpResponse.json({
      data: {
        product,
      },
    });
  }),

  // Mutation: sortProducts - Sort products with weights
  graphql.mutation('SortProducts', ({ variables }) => {
    const { input } = variables as {
      input: {
        salesUnits?: string;
        stock?: string;
        profitMargin?: string;
        daysInStock?: string;
      };
    };

    const weights = {
      salesUnits: parseFloat(input.salesUnits || '0'),
      stock: parseFloat(input.stock || '0'),
      profitMargin: parseFloat(input.profitMargin || '0'),
      daysInStock: parseFloat(input.daysInStock || '0'),
    };

    const sorted = sortProducts(weights);
    
    return HttpResponse.json({
      data: {
        sortProducts: {
          products: sorted,
          totalCount: sorted.length,
        },
      },
    });
  }),

  // =========================================================================
  // HEALTH CHECK
  // =========================================================================
  
  http.get(`${API_BASE_URL}/health`, () => {
    return HttpResponse.json({ status: 'ok', timestamp: Date.now() });
  }),
];
