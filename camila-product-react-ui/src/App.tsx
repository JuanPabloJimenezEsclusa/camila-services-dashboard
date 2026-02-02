import React, { useState, useCallback, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { WeightForm } from './components/WeightForm';
import { RangeConfig } from './components/RangeConfig';
import { SkipLink } from './components/SkipLink';
import { SEO } from './components/SEO';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { useProducts, useProduct } from './hooks/useProducts';
import { WeightParams, ApiType } from './types/api';

// Lazy load ChartGallery (largest component ~200KB)
const ChartGallery = lazy(() => import('./components/ChartGallery'));

function App() {
  const { t } = useTranslation();
  const [apiType, setApiType] = useState<ApiType>('REST');
  const [params, setParams] = useState<WeightParams>({
    salesUnits: '0.4',
    stock: '0.2',
    profitMargin: '0.2',
    daysInStock: '0.2',
    page: '0',
    size: '50',
  });
  
  const [searchId, setSearchId] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [minWeight, setMinWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(1);
  
  const { products, totalCount, loading, error } = useProducts(params, apiType);
  const { product, loading: productLoading, error: productError } = useProduct(selectedId, apiType);

  // Memoized event handlers
  const handleSearchById = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setSelectedId(searchId.trim());
    }
  }, [searchId]);

  const handleClearSearch = useCallback(() => {
    setSelectedId(null);
    setSearchId('');
  }, []);

  const handleParamsChange = useCallback((newParams: WeightParams) => {
    setParams(newParams);
  }, []);

  return (
    <HelmetProvider>
      <SEO />
      <div className="app-container">
        <SkipLink />
        <Header selectedApi={apiType} onApiChange={setApiType} />
        
        <main id="main-content" className="main-container" role="main">
          
          {/* Search Section */}
        <div className="card search-section">
          <h2>{t('searchById')}</h2>
          <form onSubmit={handleSearchById} className="search-form">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button type="submit">{t('searchButton')}</button>
            <button 
              type="button" 
              className="secondary"
              onClick={handleClearSearch}
            >
              {t('clearButton')}
            </button>
          </form>
          
          {productLoading && <div className="loading">{t('loadingProduct')}</div>}
          {productError && <div className="error">{productError}</div>}
          {product && <ProductCard product={product} />}
        </div>

        {/* Configuration Section */}
        <RangeConfig
          minWeight={minWeight}
          maxWeight={maxWeight}
          onMinWeightChange={setMinWeight}
          onMaxWeightChange={setMaxWeight}
        />

        <WeightForm 
          onSubmit={handleParamsChange} 
          minWeight={minWeight}
          maxWeight={maxWeight}
        />

        {/* ARIA Live Region for Product Count */}
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
        >
          {!loading && totalCount !== undefined && 
            `${totalCount} ${t('products')} ${t('loadedSuccess', 'loaded successfully')}`
          }
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading" aria-busy="true">
            {t('loadingProducts')}
          </div>
        )}
        
        {/* Error State */}
        {error && <div className="error">{error}</div>}
        
        {/* Content Section */}
        {!loading && !error && (
          <>
            {products.length > 0 && (
              <Suspense fallback={<LoadingSkeleton />}>
                <ChartGallery products={products} />
              </Suspense>
            )}
            
            <div className="section-header">
              <h2>{t('products')}</h2>
              {totalCount !== undefined && (
                <span className="section-count">
                  {t('product.total')}: {totalCount}
                </span>
              )}
            </div>
            
            <div className="grid">
              {products.map((product) => (
                <ProductCard key={product.id || product.internalId} product={product} />
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="card">
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {t('noProducts')}
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
    </HelmetProvider>
  );
}

export default App;
