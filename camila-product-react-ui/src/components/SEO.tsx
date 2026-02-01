/**
 * SEO Component with React Helmet
 * Manages dynamic meta tags, Open Graph, Twitter Cards, and structured data
 */

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({ 
  title, 
  description, 
  canonical = window.location.href,
  ogImage = '/og-image.png'
}: SEOProps) {
  const { t, i18n } = useTranslation();
  
  const siteTitle = title || t('appTitle');
  const siteDescription = description || t('seo.description', 
    'Camila Product Dashboard - Intelligent product ranking and classification system for e-commerce optimization.');

  useEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={i18n.language} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": siteTitle,
          "description": siteDescription,
          "url": canonical,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "inLanguage": [i18n.language],
          "keywords": "product ranking, e-commerce, dashboard, analytics, business intelligence"
        })}
      </script>
    </Helmet>
  );
}
