import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, Tooltip, Legend } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';
import type { Product } from '../types/api';

ChartJS.register(MatrixController, MatrixElement, Tooltip, Legend);

interface HeatMapProps {
  products: Product[];
}

export const CategoryHeatMap = ({ products }: HeatMapProps) => {
  const { t } = useTranslation();

  const heatMapData = useMemo(() => {
    // Aggregate data by category
    const categoryMap = new Map<string, {
      salesUnits: number;
      stock: number;
      profitMargin: number;
      daysInStock: number;
      count: number;
    }>();

    products.forEach((product) => {
      const category = product.category || 'Unknown';
      const existing = categoryMap.get(category) || {
        salesUnits: 0,
        stock: 0,
        profitMargin: 0,
        daysInStock: 0,
        count: 0,
      };
      
      const stockTotal = Object.values(product.stock || {}).reduce((sum, val) => sum + val, 0);
      
      categoryMap.set(category, {
        salesUnits: existing.salesUnits + (product.salesUnits || 0),
        stock: existing.stock + stockTotal,
        profitMargin: existing.profitMargin + (product.profitMargin || 0),
        daysInStock: existing.daysInStock + (product.daysInStock || 0),
        count: existing.count + 1,
      });
    });

    // Calculate averages and normalize
    const categories = Array.from(categoryMap.keys());
    const metrics = ['salesUnits', 'stock', 'profitMargin', 'daysInStock'];
    
    // Find min/max for normalization
    const allValues: number[] = [];
    categories.forEach(category => {
      const data = categoryMap.get(category)!;
      allValues.push(
        data.salesUnits / data.count,
        data.stock / data.count,
        data.profitMargin / data.count,
        data.daysInStock / data.count
      );
    });
    
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue || 1;

    // Create matrix data points
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataPoints: any[] = [];
    categories.forEach((category, y) => {
      const categoryData = categoryMap.get(category)!;
      metrics.forEach((metric, x) => {
        const rawValue = (categoryData[metric as keyof typeof categoryData] as number) / categoryData.count;
        // Normalize to 0-1 range
        const normalizedValue = (rawValue - minValue) / range;
        
        dataPoints.push({
          x: x,
          y: y,
          v: normalizedValue,
          rawValue: rawValue,
          category: category,
          metric: metric,
        });
      });
    });

    return {
      categories,
      metrics,
      dataPoints,
    };
  }, [products]);

  const metricLabels = {
    salesUnits: t('product.salesUnits'),
    stock: t('product.stock'),
    profitMargin: t('product.profitMargin'),
    daysInStock: t('product.daysInStock'),
  };

  const data = {
    datasets: [{
      label: t('charts.categoryPerformance'),
      data: heatMapData.dataPoints,
      // Chart.js callback context types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backgroundColor(context: any) {
        const value = context.dataset.data[context.dataIndex]?.v || 0;
        // Color scale from cool (blue) to hot (red)
        const red = Math.round(255 * value);
        const blue = Math.round(255 * (1 - value));
        const green = Math.round(128 * (1 - Math.abs(value - 0.5) * 2));
        return `rgba(${red}, ${green}, ${blue}, 0.8)`;
      },
      borderColor: 'var(--border-color)',
      borderWidth: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      width: ({ chart }: any) => (chart.chartArea?.width || 0) / heatMapData.metrics.length - 2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      height: ({ chart }: any) => (chart.chartArea?.height || 0) / heatMapData.categories.length - 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: () => '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const point = context.raw;
            return [
              `${t('product.category')}: ${point.category}`,
              `${metricLabels[point.metric as keyof typeof metricLabels]}: ${point.rawValue.toFixed(2)}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        labels: heatMapData.metrics.map(m => metricLabels[m as keyof typeof metricLabels]),
        offset: true,
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'category' as const,
        labels: heatMapData.categories,
        offset: true,
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="heatmap-container">
      <h2>🔥 {t('charts.categoryPerformance')}</h2>
      <div className="heatmap-content">
        <div style={{ height: Math.max(300, heatMapData.categories.length * 60) }}>
          <Chart type="matrix" data={data} options={options} />
        </div>
        <div className="heatmap-legend">
          <div className="legend-title">{t('charts.intensityScale')}</div>
          <div className="legend-gradient">
            <span>{t('charts.low')}</span>
            <div className="gradient-bar"></div>
            <span>{t('charts.high')}</span>
          </div>
          <div className="legend-description">
            {t('charts.heatmapDescription')}
          </div>
        </div>
      </div>
    </div>
  );
};
