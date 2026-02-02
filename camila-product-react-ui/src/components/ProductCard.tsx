import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/api';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const totalStock = product.stock 
    ? Object.values(product.stock).reduce((sum, qty) => sum + qty, 0) 
    : 0;

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p><strong>{t('product.id')}:</strong> {product.internalId}</p>
      <p><strong>{t('product.category')}:</strong> {product.category}</p>
      {product.salesUnits !== undefined && (
        <p><strong>{t('product.salesUnits')}:</strong> {product.salesUnits}</p>
      )}
      {product.profitMargin !== undefined && (
        <p><strong>{t('product.profitMargin')}:</strong> {product.profitMargin.toFixed(2)}%</p>
      )}
      {product.daysInStock !== undefined && (
        <p><strong>{t('product.daysInStock')}:</strong> {product.daysInStock}</p>
      )}
      {product.stock && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>{t('product.stock')} ({t('product.total')}: {totalStock}):</strong></p>
          <ul style={{ 
            listStyle: 'none', 
            padding: '0.5rem 0', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem' 
          }}>
            {Object.entries(product.stock).map(([size, qty]) => (
              <li key={size} style={{
                padding: '0.25rem 0.75rem',
                background: 'var(--button-secondary)',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {size}: {qty}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
