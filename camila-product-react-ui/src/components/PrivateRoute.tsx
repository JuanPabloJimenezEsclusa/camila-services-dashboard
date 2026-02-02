import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPrompt } from './LoginPrompt';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Authenticating...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <>{children}</>;
};
