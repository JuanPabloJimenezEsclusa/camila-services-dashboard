/**
 * OAuth2 / OpenID Connect Configuration
 * Keycloak authentication settings
 *
 * This configuration now uses environment variables for flexibility
 * across different deployment environments (dev, staging, production)
 *
 * IMPORTANT: Uses getters to ensure values are evaluated at runtime,
 * after window._env_ is injected by docker-entrypoint.sh
 */

import { env } from './env.config';

export const authConfig = {
  // Use getters for runtime evaluation
  get authority() {
    return env.auth.authority;
  },

  get client_id() {
    return env.auth.clientId;
  },

  get client_secret() {
    return env.auth.clientSecret;
  },

  get redirect_uri() {
    return globalThis.location?.origin + '/callback' || 'http://localhost:3030/callback';
  },

  get post_logout_redirect_uri() {
    return globalThis.location?.origin || 'http://localhost:3030';
  },

  response_type: 'code',
  scope: 'openid email camila/read camila/write',

  // Keycloak endpoints - dynamically constructed from authority
  get metadata() {
    const authority = env.auth.authority;
    return {
      // failed to use the authority variable directly here
      authorization_endpoint: 'http://keycloak:9191/realms/camila-realm/protocol/openid-connect/auth',
      token_endpoint: authority + '/protocol/openid-connect/token',
      end_session_endpoint: authority + '/protocol/openid-connect/logout',
      issuer: authority,
    };
  },

  // Additional settings
  automaticSilentRenew: true,
  loadUserInfo: false,
  monitorSession: true,
};
