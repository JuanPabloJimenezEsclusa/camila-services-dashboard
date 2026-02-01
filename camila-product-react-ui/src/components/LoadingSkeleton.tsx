/**
 * Loading Skeleton for ChartGallery
 * Displays while lazy-loaded component is loading
 */

export function LoadingSkeleton() {
  return (
    <div className="chart-gallery-skeleton" aria-busy="true" aria-live="polite">
      <div className="skeleton-main-chart">
        <div className="skeleton-shimmer" />
      </div>
      <div className="skeleton-thumbnails">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-thumbnail">
            <div className="skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
