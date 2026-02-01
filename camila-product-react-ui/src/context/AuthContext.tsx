import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { authConfig } from '../config/auth.config';
import { refreshGraphQLAuth } from '../api/graphqlClient';
import { env } from '../config/env.config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  error: string | null;
  authEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authEnabled = env.auth.enabled;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(authEnabled); // Only show loading if auth is enabled
  const [error, setError] = useState<string | null>(null);
  const [userManager] = useState(() =>
    authEnabled ? new UserManager(authConfig as UserManagerSettings) : null
  );

  // Load user from storage on mount
  useEffect(() => {
    // Skip auth flow if disabled
    if (!authEnabled) {
      console.info('[Auth] Authentication disabled via VITE_AUTH_ENABLED=false');
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      if (!userManager) return;

      try {
        setIsLoading(true);
        const storedUser = await userManager.getUser();

        if (storedUser && !storedUser.expired) {
          setUser(storedUser);
          // Refresh GraphQL authentication with stored token
          refreshGraphQLAuth();
          console.debug('User loaded from storage, GraphQL auth set');
        } else if (storedUser?.expired) {
          // Try to silently renew token
          try {
            const renewedUser = await userManager.signinSilent();
            setUser(renewedUser);
            refreshGraphQLAuth();
            console.debug('Token renewed, GraphQL auth set');
          } catch (renewError) {
            console.warn('Token renewal failed:', renewError);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load authentication state');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userManager, authEnabled]);

  // Handle callback after redirect from auth server
  useEffect(() => {
    // Skip callback handling if auth is disabled
    if (!authEnabled || !userManager) return;

    const handleCallback = async () => {
      const params = new URLSearchParams(globalThis.location.search);

      if (params.has('code') || params.has('state')) {
        try {
          setIsLoading(true);
          const callbackUser = await userManager.signinCallback();
          console.debug('Callback successful:', callbackUser);
          setUser(callbackUser ?? null);
          // Refresh GraphQL authentication after callback
          refreshGraphQLAuth();
          console.debug('OAuth callback complete, GraphQL auth set');

          // Clean up URL
          globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
        } catch (err) {
          console.error('Callback error:', err);
          setError('Authentication callback failed');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleCallback();
  }, [userManager, authEnabled]);

  // Setup event listeners
  useEffect(() => {
    // Skip event listeners if auth is disabled
    if (!authEnabled || !userManager) return;

    const handleUserLoaded = (loadedUser: User) => {
      setUser(loadedUser);
      setError(null);
      // Refresh GraphQL authentication when user loads
      refreshGraphQLAuth();
      console.debug('User loaded, GraphQL auth refreshed');
    };

    const handleUserUnloaded = () => {
      setUser(null);
      // Clear GraphQL authentication when user unloads
      refreshGraphQLAuth();
      console.debug('User unloaded, GraphQL auth cleared');
    };

    const handleAccessTokenExpiring = () => {
      console.log('Access token expiring...');
    };

    const handleAccessTokenExpired = () => {
      console.log('Access token expired');
      setUser(null);
      // Clear GraphQL authentication when token expires
      refreshGraphQLAuth();
    };

    const handleSilentRenewError = (err: Error) => {
      console.error('Silent renew error:', err);
      setError('Session renewal failed');
    };

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addAccessTokenExpiring(handleAccessTokenExpiring);
    userManager.events.addAccessTokenExpired(handleAccessTokenExpired);
    userManager.events.addSilentRenewError(handleSilentRenewError);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeAccessTokenExpiring(handleAccessTokenExpiring);
      userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, [userManager, authEnabled]);

  const login = useCallback(async () => {
    if (!authEnabled || !userManager) {
      console.warn('[Auth] Login attempted but authentication is disabled');
      return;
    }

    try {
      setError(null);
      await userManager.signinRedirect();
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
      throw err;
    }
  }, [userManager, authEnabled]);

  const logout = useCallback(async () => {
    if (!authEnabled || !userManager) {
      console.warn('[Auth] Logout attempted but authentication is disabled');
      return;
    }

    try {
      setError(null);
      await userManager.signoutRedirect();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
      throw err;
    }
  }, [userManager, authEnabled]);

  const getAccessToken = useCallback((): string | null => {
    if (!authEnabled) {
      return null;
    }
    return user?.access_token || null;
  }, [user, authEnabled]);

  const value: AuthContextType = useMemo(() => (
   {
    user,
    isAuthenticated: authEnabled ? !!user && !user.expired : true, // Always authenticated if auth is disabled
    isLoading,
    login,
    logout,
    getAccessToken,
    error,
    authEnabled,
  }), [user, isLoading, login, logout, getAccessToken, error, authEnabled]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
