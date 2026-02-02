/**
 * API Type Selector Component
 * Allows switching between REST, GraphQL, gRPC, and RSocket APIs
 */

import { useTranslation } from 'react-i18next';
import { ApiType } from '../types/api';

interface ApiSelectorProps {
  selectedApi: ApiType;
  onApiChange: (api: ApiType) => void;
}

export function ApiSelector({ selectedApi, onApiChange }: ApiSelectorProps) {
  const { t } = useTranslation();

  const apiOptions = [
    { type: 'REST' as ApiType, icon: '🌐', label: 'REST' },
    { type: 'GraphQL' as ApiType, icon: '◈', label: 'GraphQL' },
    { type: 'GRPC' as ApiType, icon: '⚡', label: 'gRPC' },
    { type: 'RSOCKET' as ApiType, icon: '🔌', label: 'RSocket' },
  ];

  return (
    <div className="card api-selector">
      <h3>{t('apiSelector.title', 'API Type')}</h3>
      <div className="api-selector-icons">
        {apiOptions.map(({ type, icon, label }) => (
          <button
            key={type}
            className={`api-icon ${selectedApi === type ? 'active' : ''}`}
            onClick={() => onApiChange(type)}
            aria-pressed={selectedApi === type}
            aria-label={label}
            title={label}
          >
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>
          </button>
        ))}
      </div>
      <p className="api-selector-description">
        {selectedApi === 'REST' 
          ? t('apiSelector.restDescription', 'Using RESTful API endpoints')
          : selectedApi === 'GraphQL'
          ? t('apiSelector.graphqlDescription', 'Using GraphQL query language')
          : selectedApi === 'GRPC'
          ? t('apiSelector.grpcDescription', 'Using gRPC high-performance RPC')
          : t('apiSelector.rsocketDescription', 'Using RSocket reactive messaging')
        }
      </p>
    </div>
  );
}
