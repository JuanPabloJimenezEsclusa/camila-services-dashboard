import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export const LoginPrompt: React.FC = () => {
  const { login, error } = useAuth();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(r => r);
  };

  return (
    <div className="login-container">
      <div className="login-overlay" />
      
      {/* Top Controls */}
      <div className="login-top-controls">
        <div className="login-controls-wrapper">
          <select 
            className="login-language-selector"
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label={t('language.title', 'Language')}
          >
            <option value="en">🇬🇧 {t('language.en', 'English')}</option>
            <option value="es">🇪🇸 {t('language.es', 'Spanish')}</option>
            <option value="ca">🇪🇸 {t('language.ca', 'Catalan')}</option>
            <option value="de">🇩🇪 {t('language.de', 'German')}</option>
            <option value="pt">🇵🇹 {t('language.pt', 'Portuguese')}</option>
            <option value="ko">🇰🇷 {t('language.ko', 'Korean')}</option>
            <option value="zh">🇨🇳 {t('language.zh', 'Chinese')}</option>
          </select>

          <button
            className="login-theme-toggle"
            onClick={toggleTheme}
            aria-label={t('theme.toggle', 'Toggle Theme')}
            title={theme === 'dark' ? t('theme.light', 'Light Mode') : t('theme.dark', 'Dark Mode')}
          >
            {theme === 'dark' ? (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="login-content">
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 200 60" className="logo-svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e50914" />
                  <stop offset="100%" stopColor="#b20710" />
                </linearGradient>
              </defs>
              <text x="10" y="45" fontSize="38" fontWeight="800" fill="url(#logoGradient)" fontFamily="Arial, sans-serif">
                CAMILA
              </text>
            </svg>
          </div>
        </div>

        <div className="login-card">
          <h1>{t('auth.loginRequired', 'Sign In')}</h1>
          <p className="login-subtitle">
            {t('auth.loginMessage', 'Access your Product Analytics Dashboard')}
          </p>
          
          {error && (
            <div className="error-banner" role="alert">
              <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <button 
            onClick={login} 
            className="login-button"
            aria-label={t('auth.loginButton', 'Log in with Keycloak')}
          >
            {t('auth.loginButton', 'Sign In')}
          </button>

          <div className="login-features">
            <div className="feature-item">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>{t('auth.feature1', 'Real-time Analytics')}</span>
            </div>
            <div className="feature-item">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{t('auth.feature2', 'Advanced Search')}</span>
            </div>
            <div className="feature-item">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <span>{t('auth.feature3', 'Multi-Protocol APIs')}</span>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>{t('auth.footerText', 'Enterprise Product Management Platform')}</p>
        </div>
      </div>
    </div>
  );
};
