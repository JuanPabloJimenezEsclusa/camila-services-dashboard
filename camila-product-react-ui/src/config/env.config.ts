/**
 * Centralized Environment Configuration
 *
 * This module provides a single source of truth for all environment variables.
 * It supports both build-time (import.meta.env) and runtime (window._env_) configuration.
 *
 * For Docker/production deployments:
 * - Build-time vars are embedded during `npm run build`
 * - Runtime vars can be injected via docker-entrypoint.sh
 */

interface EnvironmentConfig {
  // Authentication
  auth: {
    enabled: boolean;
    authority: string;
    clientId: string;
    clientSecret: string;
  };

  // API Endpoints
  api: {
    baseUrl: string;
    graphqlEndpoint: string;
    grpcEndpoint: string;
    rsocketUrl: string;
  };

  // App Configuration
  app: {
    version: string;
    defaultLanguage: string;
    port: number;
  };
}

/**
 * Runtime environment variables (injected by docker-entrypoint.sh)
 * Falls back to build-time environment variables if not available
 */
declare global {
  interface Window {
    _env_?: {
      VITE_AUTH_ENABLED?: string;
      VITE_AUTH_AUTHORITY?: string;
      VITE_AUTH_CLIENT_ID?: string;
      VITE_AUTH_CLIENT_SECRET?: string;
      VITE_API_BASE_URL?: string;
      VITE_GRAPHQL_ENDPOINT?: string;
      VITE_GRPC_ENDPOINT?: string;
      VITE_RSOCKET_URL?: string;
      VITE_API_VERSION?: string;
      VITE_DEFAULT_LANGUAGE?: string;
    };
  }
}

/**
 * Get environment variable with runtime override support
 */
function getEnv(key: string, defaultValue: string = ''): string {
  // Check runtime environment first (from window._env_)
  if (typeof window !== 'undefined' && window._env_ && (window._env_ as Record<string, string>)[key]) {
    return (window._env_ as Record<string, string>)[key];
  }

  // Fall back to build-time environment
  return (import.meta.env as Record<string, string>)[key] || defaultValue;
}

/**
 * Resolve URL - handles both absolute and relative URLs
 * In production with Nginx, relative URLs are preferred for reverse proxy scenarios
 */
function resolveUrl(url: string, defaultUrl: string): string {
  const envUrl = getEnv(url, defaultUrl);

  // If it's already an absolute URL, use it as-is
  if (envUrl.startsWith('http://')
    || envUrl.startsWith('https://')
    || envUrl.startsWith('ws://')
    || envUrl.startsWith('wss://')) {
    return envUrl;
  }

  // If it's a relative URL, and we're in a browser, resolve against current origin
  if (typeof window !== 'undefined' && envUrl.startsWith('/')) {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${window.location.host}${envUrl}`;
  }

  return envUrl;
}

/**
 * Main environment configuration object
 */
export const env: EnvironmentConfig = {
  auth: {
    enabled: getEnv('VITE_AUTH_ENABLED', 'true').toLowerCase() === 'true',
    authority: getEnv('VITE_AUTH_AUTHORITY', 'http://localhost:9191/realms/camila-realm'),
    clientId: getEnv('VITE_AUTH_CLIENT_ID', 'camila-client'),
    clientSecret: getEnv('VITE_AUTH_CLIENT_SECRET', 'Fuvf8XyBDXxU57NAOOFZVvdUIPmGgiyE'),
  },

  api: {
    baseUrl: resolveUrl('VITE_API_BASE_URL', '/product-dev/api'),
    graphqlEndpoint: resolveUrl('VITE_GRAPHQL_ENDPOINT', '/product-dev/api/graphql'),
    grpcEndpoint: resolveUrl('VITE_GRPC_ENDPOINT', 'http://localhost:8765'),
    rsocketUrl: getEnv('VITE_RSOCKET_URL', 'ws://localhost:7000/product-dev/api/rsocket'),
  },

  app: {
    version: getEnv('VITE_API_VERSION', '1.0.0'),
    defaultLanguage: getEnv('VITE_DEFAULT_LANGUAGE', 'en-US'),
    port: Number.parseInt(getEnv('VITE_PORT', '3030'), 10),
  },
};

/**
 * Export individual getters for convenience
 */
export const getAuthConfig = () => env.auth;
export const getApiConfig = () => env.api;
export const getAppConfig = () => env.app;

/**
 * Log configuration in development mode
 */
if (import.meta.env.DEV) {
  console.log('[ENV CONFIG] Loaded configuration:', {
    auth: { ...env.auth, clientSecret: '***' },
    api: env.api,
    app: env.app,
  });
}
