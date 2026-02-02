import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const userName = user.profile?.name || user.profile?.preferred_username || 'User';
  const userEmail = user.profile?.email;

  return (
    <div className="user-profile">
      <button 
        className="user-button"
        onClick={() => setShowMenu(!showMenu)}
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        <span className="user-avatar">
          {userName.charAt(0).toUpperCase()}
        </span>
        <span className="user-name">{userName}</span>
      </button>
      
      {showMenu && (
        <div className="user-menu" role="menu">
          <div className="user-info">
            <div className="user-info-name">{userName}</div>
            {userEmail && <div className="user-info-email">{userEmail}</div>}
          </div>
          <hr />
          <button 
            onClick={() => {
              setShowMenu(false);
              logout();
            }}
            className="logout-button"
            role="menuitem"
          >
            {t('auth.logout', 'Log Out')}
          </button>
        </div>
      )}
    </div>
  );
};
