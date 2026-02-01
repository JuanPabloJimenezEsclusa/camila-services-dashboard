/**
 * Shared Authentication Utility
 *
 * Provides centralized authentication token management for all API clients.
 * This ensures consistent token retrieval and reduces code duplication.
 *
 * If authentication is disabled (VITE_AUTH_ENABLED=false), all functions
 * return null/false, allowing the app to run without authentication.
 */

import { authConfig } from '../config/auth.config';
import { env } from '../config/env.config';

/**
 * Get OAuth2 access token from session storage
 *
 * The token is stored by oidc-client-ts in sessionStorage.
 * Format: `oidc.user:{authority}:{client_id}`
 *
 * @returns {string | null} The access token or null if not found or auth disabled
 */
export function getAuthToken(): string | null {
  // Return null if authentication is disabled
  if (!env.auth.enabled) {
    if (import.meta.env.DEV) {
      console.debug('[Auth] Authentication disabled, returning null token');
    }
    return null;
  }

  try {
    // Construct OIDC storage key
    const oidcStorageKey = `oidc.user:${authConfig.authority}:${authConfig.client_id}`;

    // Debug logging
    if (import.meta.env.DEV) {
      console.debug('[Auth] OIDC Storage Key:', oidcStorageKey);
    }

    // Retrieve from session storage
    const oidcStorage = sessionStorage.getItem(oidcStorageKey);

    if (!oidcStorage) {
      if (import.meta.env.DEV) {
        console.debug('[Auth] No auth token found in session storage');
      }
      return null;
    }

    // Parse user object
    const user = JSON.parse(oidcStorage);

    // Extract access token
    const token = user.access_token || null;

    if (import.meta.env.DEV) {
      console.debug('[Auth] Access token:', token ? 'Present' : 'Missing');
    }

    return token;
  } catch (err) {
    console.error('[Auth] Error retrieving auth token:', err);
    return null;
  }
}

/**
 * Get Authorization header value
 *
 * @returns {string | null} Bearer token header value or null
 */
export function getAuthorizationHeader(): string | null {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : null;
}

/**
 * Check if user is authenticated
 *
 * @returns {boolean} True if valid token exists (or auth is disabled)
 */
export function isAuthenticated(): boolean {
  // If auth is disabled, consider always authenticated
  if (!env.auth.enabled) {
    return true;
  }

  const token = getAuthToken();
  return token !== null && token.length > 0;
}

/**
 * Debug helper: Log current auth state
 */
export function debugAuthState(): void {
  const isAuth = isAuthenticated();

  console.group('[Auth] Current State');
  console.log('Enabled:', env.auth.enabled);
  console.log('Authenticated:', isAuth);
  console.log('Authority:', authConfig.authority);
  console.log('Client ID:', authConfig.client_id);
  console.log('Client Secret:', authConfig.client_secret ? '***' : 'Not Set');
  console.log('redirect_uri:', authConfig.redirect_uri);
  console.log('post_logout_redirect_uri:', authConfig.post_logout_redirect_uri);
  console.groupEnd();
}
