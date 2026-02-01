/**
 * Web Vitals Performance Monitoring
 * Reports Core Web Vitals metrics to console (can be extended to analytics service)
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Reports Web Vitals metric to console
 * In production, send to analytics service (Google Analytics, Datadog, etc.)
 */
function sendToAnalytics(metric: Metric): void {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: `${Math.round(metric.value)}ms`,
      rating: metric.rating,
    });
  }

  // In production, send to your analytics endpoint
  // Example: navigator.sendBeacon('/analytics', JSON.stringify(metric));
  // Example: fetch('/analytics', { method: 'POST', body: JSON.stringify(metric), keepalive: true });
}

/**
 * Initialize Web Vitals monitoring
 * Call this once in main.tsx
 */
export function initPerformanceMonitoring(): void {
  // Cumulative Layout Shift (CLS) - visual stability
  // Good: < 0.1, Needs improvement: 0.1-0.25, Poor: > 0.25
  onCLS(sendToAnalytics);

  // Interaction to Next Paint (INP) - responsiveness (replaces FID in v4)
  // Good: < 200ms, Needs improvement: 200-500ms, Poor: > 500ms
  onINP(sendToAnalytics);

  // First Contentful Paint (FCP) - loading
  // Good: < 1.8s, Needs improvement: 1.8-3s, Poor: > 3s
  onFCP(sendToAnalytics);

  // Largest Contentful Paint (LCP) - loading
  // Good: < 2.5s, Needs improvement: 2.5-4s, Poor: > 4s
  onLCP(sendToAnalytics);

  // Time to First Byte (TTFB) - server response
  // Good: < 800ms, Needs improvement: 800-1800ms, Poor: > 1800ms
  onTTFB(sendToAnalytics);
}

/**
 * Performance metrics thresholds for quick reference
 */
export const PERFORMANCE_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 },
} as const;
