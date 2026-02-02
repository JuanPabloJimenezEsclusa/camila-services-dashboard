/**
 * Unit tests for shared authentication utility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAuthToken, getAuthorizationHeader, isAuthenticated, debugAuthState } from '../auth';

describe('Auth Utility', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('getAuthToken', () => {
    it('should return null when no token exists', () => {
      const token = getAuthToken();
      expect(token).toBeNull();
    });

    it('should retrieve token from sessionStorage', () => {
      // Mock OIDC storage
      const mockToken = 'mock-access-token-123';
      const mockUser = {
        access_token: mockToken,
        profile: { sub: 'user-123' },
      };
      
      sessionStorage.setItem(
        'oidc.user:http://localhost:9191/realms/camila-realm:camila-client',
        JSON.stringify(mockUser)
      );

      const token = getAuthToken();
      expect(token).toBe(mockToken);
    });

    it('should return null for invalid JSON in storage', () => {
      sessionStorage.setItem(
        'oidc.user:http://localhost:9191/realms/camila-realm:camila-client',
        'invalid-json'
      );

      const token = getAuthToken();
      expect(token).toBeNull();
    });

    it('should return null when user object has no access_token', () => {
      const mockUser = {
        profile: { sub: 'user-123' },
      };
      
      sessionStorage.setItem(
        'oidc.user:http://localhost:9191/realms/camila-realm:camila-client',
        JSON.stringify(mockUser)
      );

      const token = getAuthToken();
      expect(token).toBeNull();
    });
  });

  describe('getAuthorizationHeader', () => {
    it('should return null when no token exists', () => {
      const header = getAuthorizationHeader();
      expect(header).toBeNull();
    });

    it('should return Bearer token header', () => {
      const mockToken = 'mock-access-token-123';
      const mockUser = { access_token: mockToken };
      
      sessionStorage.setItem(
        'oidc.user:http://localhost:9191/realms/camila-realm:camila-client',
        JSON.stringify(mockUser)
      );

      const header = getAuthorizationHeader();
      expect(header).toBe(`Bearer ${mockToken}`);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true when valid token exists', () => {
      const mockUser = { access_token: 'valid-token' };
      
      sessionStorage.setItem(
        'oidc.user:http://localhost:9191/realms/camila-realm:camila-client',
        JSON.stringify(mockUser)
      );

      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when token is empty string', () => {
      const mockUser = { access_token: '' };
      
      sessionStorage.setItem(
        'oidc.user:http://localhost:9191/realms/camila-realm:camila-client',
        JSON.stringify(mockUser)
      );

      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('debugAuthState', () => {
    it('should not throw when called', () => {
      expect(() => debugAuthState()).not.toThrow();
    });

    it('should log auth state information', () => {
      const consoleSpy = vi.spyOn(console, 'group');
      
      debugAuthState();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
