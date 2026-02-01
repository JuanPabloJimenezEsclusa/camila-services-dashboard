import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { WeightParams } from '../types/api';
import debounce from 'lodash.debounce';

interface WeightFormProps {
  onSubmit: (params: WeightParams) => void;
  minWeight?: number;
  maxWeight?: number;
  minPage?: number;
  maxPage?: number;
  minSize?: number;
  maxSize?: number;
}

export function WeightForm({
  onSubmit,
  minWeight = 0,
  maxWeight = 10,
  minPage = 0,
  maxPage = 10,
  minSize = 10,
  maxSize = 1000,
}: Readonly<WeightFormProps>) {
  const { t } = useTranslation();
  const [salesUnits, setSalesUnits] = useState(0.4);
  const [stock, setStock] = useState(0.2);
  const [profitMargin, setProfitMargin] = useState(0.2);
  const [daysInStock, setDaysInStock] = useState(0.2);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);

  // Debounced API call - reduces requests while dragging sliders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(
    debounce((params: WeightParams) => {
      onSubmit(params);
    }, 300),
    [onSubmit]
  );

  useEffect(() => {
    debouncedSubmit({
      salesUnits: salesUnits.toFixed(2),
      stock: stock.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      daysInStock: daysInStock.toFixed(2),
      page: page.toString(),
      size: size.toString(),
    });
  }, [salesUnits, stock, profitMargin, daysInStock, page, size, debouncedSubmit]);

  return (
    <div className="weight-form">
      <h2>⚖️ {t('weightForm.title')}</h2>
      
      <div className="weight-controls">
        <div className="weight-item">
          <label className="weight-label">
            <span>{t('weightForm.salesUnits')}</span>
            <span className="weight-value">{salesUnits.toFixed(2)}</span>
          </label>
          <input
            type="range"
            step="0.01"
            min={minWeight}
            max={maxWeight}
            value={salesUnits}
            onChange={(e) => setSalesUnits(Number.parseFloat(e.target.value))}
          />
        </div>
        
        <div className="weight-item">
          <label className="weight-label">
            <span>{t('weightForm.stock')}</span>
            <span className="weight-value">{stock.toFixed(2)}</span>
          </label>
          <input
            type="range"
            step="0.01"
            min={minWeight}
            max={maxWeight}
            value={stock}
            onChange={(e) => setStock(Number.parseFloat(e.target.value))}
          />
        </div>
        
        <div className="weight-item">
          <label className="weight-label">
            <span>{t('weightForm.profitMargin')}</span>
            <span className="weight-value">{profitMargin.toFixed(2)}</span>
          </label>
          <input
            type="range"
            step="0.01"
            min={minWeight}
            max={maxWeight}
            value={profitMargin}
            onChange={(e) => setProfitMargin(Number.parseFloat(e.target.value))}
          />
        </div>
        
        <div className="weight-item">
          <label className="weight-label">
            <span>{t('weightForm.daysInStock')}</span>
            <span className="weight-value">{daysInStock.toFixed(2)}</span>
          </label>
          <input
            type="range"
            step="0.01"
            min={minWeight}
            max={maxWeight}
            value={daysInStock}
            onChange={(e) => setDaysInStock(Number.parseFloat(e.target.value))}
          />
        </div>
        
        <div className="weight-item">
          <label className="weight-label">
            <span>{t('weightForm.page')}</span>
            <span className="weight-value">{page}</span>
          </label>
          <input
            type="range"
            min={minPage}
            max={maxPage}
            value={page}
            onChange={(e) => setPage(Number.parseInt(e.target.value))}
          />
        </div>
        
        <div className="weight-item">
          <label className="weight-label">
            <span>{t('weightForm.pageSize')}</span>
            <span className="weight-value">{size}</span>
          </label>
          <input
            type="range"
            min={minSize}
            max={maxSize}
            step="10"
            value={size}
            onChange={(e) => setSize(Number.parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
