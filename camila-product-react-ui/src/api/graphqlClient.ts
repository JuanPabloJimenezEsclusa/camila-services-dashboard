/**
 * GraphQL API Client
 * Uses graphql-request for simplified GraphQL queries
 * Includes OAuth2 Bearer token authentication
 */

import { GraphQLClient } from 'graphql-request';
import { Product } from '../types/api';
import { env } from '../config/env.config';
import { getAuthToken } from '../utils/auth';

/**
 * Get GraphQL endpoint from environment configuration
 */
const getGraphQLEndpoint = (): string => {
  return env.api.graphqlEndpoint;
};

/**
 * Create GraphQL client with OAuth2 authentication
 */
function createAuthenticatedClient(): GraphQLClient {
  const client = new GraphQLClient(getGraphQLEndpoint(), { method: 'POST', errorPolicy: 'all', excludeOperationName: true });

  // Set authorization header if token is available
  const token = getAuthToken();
  if (token) {
    client.setHeader('Authorization', `Bearer ${token}`);
    if (import.meta.env.DEV) {
      console.debug('[GraphQL] Authorization header set');
    }
  }

  return client;
}

// Create initial GraphQL client
let client = createAuthenticatedClient();

/**
 * Refresh client authentication (call after login/token refresh)
 */
export function refreshGraphQLAuth(): void {
  client = createAuthenticatedClient();
  console.debug('GraphQL - Client authentication refreshed');
}

/**
 * Find product by internal ID
 */
export async function findByIdGraphQL(internalId: string): Promise<Product | null> {
  const query = `
    query FindById($internalId: ID!) {
      findById(internalId: $internalId) {
        id
        internalId
        name
        category
        salesUnits
        stock
        profitMargin
        daysInStock
      }
    }
  `;

  try {
    // Refresh auth before request
    refreshGraphQLAuth();
    const data = await client.request<{ findById: Product | null }>(query, { internalId });
    return data.findById;
  } catch (error) {
    console.error('GraphQL findById error:', error);
    throw new Error('Failed to fetch product');
  }
}

/**
 * Sort products by weights
 */
export async function sortProductsGraphQL(params: {
  salesUnits: number;
  stock: number;
  profitMargin: number;
  daysInStock: number;
  page: number;
  size: number;
}): Promise<{ products: Product[]; totalCount?: number }> {
  const query = `
    query sortProducts(
      $salesUnits: Float!
      $stock: Float!
      $profitMargin: Float!
      $daysInStock: Float!
      $page: Int!
      $size: Int!
    ) {
      sortProducts(
        salesUnits: $salesUnits
        stock: $stock
        profitMargin: $profitMargin
        daysInStock: $daysInStock
        page: $page
        size: $size
      ) {
        id
        internalId
        name
        category
        salesUnits
        stock
        profitMargin
        daysInStock
      }
    }
  `;

  try {
    // Refresh auth before request
    refreshGraphQLAuth();
    const data = await client.request<{ sortProducts: Product[] }>(query, params);
    return {
      products: data.sortProducts || [],
      // GraphQL doesn't return total count in current schema
      totalCount: data.sortProducts?.length,
    };
  } catch (error: unknown) {
    console.error('GraphQL sortProducts error:', error);

    // Type guard for error with response
    const hasResponse = (err: unknown): err is { response: { status: number } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };

    // Type guard for error with message
    const hasMessage = (err: unknown): err is { message: string } => {
      return typeof err === 'object' && err !== null && 'message' in err;
    };

    // Handle specific error cases
    if (hasResponse(error) && error.response.status === 500) {
      // Backend likely failed due to invalid pagination or data constraints
      throw new Error('Server error: Unable to fetch products. Try reducing the page number or page size.');
    }

    throw new Error(hasMessage(error) ? error.message : 'Failed to fetch products');
  }
}

/**
 * Update GraphQL endpoint (for dynamic configuration)
 */
export function setGraphQLEndpoint(endpoint: string): void {
  client.setEndpoint(endpoint);
  // Refresh auth after endpoint change
  refreshGraphQLAuth();
}

/**
 * Set authentication token manually (optional)
 */
export function setGraphQLAuthToken(token: string | null): void {
  if (token) {
    client.setHeader('Authorization', `Bearer ${token}`);
    console.debug('GraphQL - Auth token set manually');
  } else {
    client.setHeader('Authorization', '');
    console.debug('GraphQL - Auth token cleared');
  }
}
