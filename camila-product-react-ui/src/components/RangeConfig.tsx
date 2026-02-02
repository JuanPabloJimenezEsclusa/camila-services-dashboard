import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RangeConfigProps {
  minWeight: number;
  maxWeight: number;
  onMinWeightChange: (value: number) => void;
  onMaxWeightChange: (value: number) => void;
}

export function RangeConfig({
  minWeight,
  maxWeight,
  onMinWeightChange,
  onMaxWeightChange,
}: Readonly<RangeConfigProps>) {
  const { t } = useTranslation();
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="range-config">
      <div className="range-config-header" onClick={() => setShowConfig(!showConfig)} onKeyDown={() => setShowConfig(!showConfig)}>
        <h3>⚙️ {t('rangeConfig.title')}</h3>
        <button type="button" className="secondary">
          {showConfig ? '▲' : '▼'} {showConfig ? t('rangeConfig.hide') : t('rangeConfig.show')}
        </button>
      </div>
      
      {showConfig && (
        <div className="range-config-content">
          <div className="range-config-item">
            <label>{t('rangeConfig.minWeight')}</label>
            <input
              type="number"
              step="0.1"
              value={minWeight}
              onChange={(e) => onMinWeightChange(Number.parseFloat(e.target.value))}
            />
          </div>
          <div className="range-config-item">
            <label>{t('rangeConfig.maxWeight')}</label>
            <input
              type="number"
              step="0.1"
              value={maxWeight}
              onChange={(e) => onMaxWeightChange(Number.parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
