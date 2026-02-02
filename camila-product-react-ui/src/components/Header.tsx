import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from './UserProfile';
import { ApiType } from '../types/api';

interface HeaderProps {
  selectedApi: ApiType;
  onApiChange: (api: ApiType) => void;
}

export function Header({ selectedApi, onApiChange }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(r => r);
  };

  const apiOptions = [
    { type: 'REST' as ApiType, icon: '🌐', label: 'REST' },
    { type: 'GraphQL' as ApiType, icon: '◈', label: 'GraphQL' },
    { type: 'GRPC' as ApiType, icon: '⚡', label: 'gRPC' },
    { type: 'RSOCKET' as ApiType, icon: '🔌', label: 'RSocket' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <h1>{t('appTitle')}</h1>
        
        <div className="header-controls">
          {/* API Selector with small icons */}
          <div className="api-selector-header">
            {apiOptions.map(({ type, icon, label }) => (
              <button
                key={type}
                className={`api-icon-small ${selectedApi === type ? 'active' : ''}`}
                onClick={() => onApiChange(type)}
                aria-pressed={selectedApi === type}
                aria-label={label}
                title={label}
              >
                {icon}
              </button>
            ))}
          </div>

          <select 
            className="language-selector"
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label={t('language.title')}
          >
            <option value="en">{t('language.en')}</option>
            <option value="es">{t('language.es')}</option>
            <option value="ca">{t('language.ca')}</option>
            <option value="de">{t('language.de')}</option>
            <option value="pt">{t('language.pt')}</option>
            <option value="ko">{t('language.ko')}</option>
            <option value="zh">{t('language.zh')}</option>
          </select>
          
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={t('theme.toggle')}
            title={theme === 'light' ? t('theme.dark') : t('theme.light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Profile (only show when authenticated) */}
          {isAuthenticated && <UserProfile />}
        </div>
      </div>
    </header>
  );
}
