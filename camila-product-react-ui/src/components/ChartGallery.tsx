import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Scatter, Pie } from 'react-chartjs-2';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';
import type { Product } from '../types/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  MatrixController,
  MatrixElement
);

interface ChartGalleryProps {
  products: Product[];
}

type ChartType = 'heatmap' | 'salesByCategory' | 'stockByCategory' | 'salesVsStock' | 'salesDistribution';

export const ChartGallery = ({ products }: ChartGalleryProps) => {
  const { t } = useTranslation();
  const [selectedChart, setSelectedChart] = useState<ChartType>('heatmap');

  // Aggregate data by category
  const aggregatedData = useMemo(() => {
    const categoryMap = new Map<string, { 
      salesUnits: number; 
      stockTotal: number;
      profitMargin: number;
      daysInStock: number;
      count: number;
    }>();

    products.forEach((product) => {
      const category = product.category || 'Unknown';
      const existing = categoryMap.get(category) || { 
        salesUnits: 0, 
        stockTotal: 0,
        profitMargin: 0,
        daysInStock: 0,
        count: 0,
      };
      
      const stockTotal = Object.values(product.stock || {}).reduce((sum, val) => sum + val, 0);
      
      categoryMap.set(category, {
        salesUnits: existing.salesUnits + (product.salesUnits || 0),
        stockTotal: existing.stockTotal + stockTotal,
        profitMargin: existing.profitMargin + (product.profitMargin || 0),
        daysInStock: existing.daysInStock + (product.daysInStock || 0),
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [products]);

  // Heat Map Data
  const heatMapData = useMemo(() => {
    const categories = aggregatedData.map(d => d.category);
    const metrics = ['salesUnits', 'stockTotal', 'profitMargin', 'daysInStock'];
    
    const allValues: number[] = [];
    aggregatedData.forEach(data => {
      allValues.push(
        data.salesUnits / data.count,
        data.stockTotal / data.count,
        data.profitMargin / data.count,
        data.daysInStock / data.count
      );
    });
    
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue || 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataPoints: any[] = [];
    aggregatedData.forEach((data, y) => {
      metrics.forEach((metric, x) => {
        const rawValue = (data[metric as keyof typeof data] as number) / data.count;
        const normalizedValue = (rawValue - minValue) / range;
        
        dataPoints.push({
          x: x,
          y: y,
          v: normalizedValue,
          rawValue: rawValue,
          category: data.category,
          metric: metric,
        });
      });
    });

    const metricLabels = {
      salesUnits: t('product.salesUnits'),
      stockTotal: t('product.stock'),
      profitMargin: t('product.profitMargin'),
      daysInStock: t('product.daysInStock'),
    };

    return { categories, metrics, dataPoints, metricLabels };
  }, [aggregatedData, t]);

  // Chart configurations
  const getTextColor = () => 
    getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000';
  
  const getBorderColor = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#ddd';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: getTextColor() },
      },
    },
    scales: {
      x: {
        ticks: { color: getTextColor() },
        grid: { color: getBorderColor() },
      },
      y: {
        ticks: { color: getTextColor() },
        grid: { color: getBorderColor() },
      },
    },
  };

  // Chart data
  const salesByCategory = {
    labels: aggregatedData.map((d) => d.category),
    datasets: [{
      label: t('charts.salesUnits'),
      data: aggregatedData.map((d) => d.salesUnits),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const stockByCategory = {
    labels: aggregatedData.map((d) => d.category),
    datasets: [{
      label: t('charts.stockTotal'),
      data: aggregatedData.map((d) => d.stockTotal),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }],
  };

  const scatterData = {
    datasets: [{
      label: t('charts.salesVsStock'),
      data: aggregatedData.map((d) => ({
        x: d.stockTotal,
        y: d.salesUnits,
        label: d.category,
      })),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointRadius: 8,
      pointHoverRadius: 10,
    }],
  };

  const pieData = {
    labels: aggregatedData.map((d) => d.category),
    datasets: [{
      label: t('charts.distributionByCategory'),
      data: aggregatedData.map((d) => d.salesUnits),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const heatMapChartData = {
    datasets: [{
      label: t('charts.categoryPerformance'),
      data: heatMapData.dataPoints,
      // Chart.js callback context types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backgroundColor(context: any) {
        const value = context.dataset.data[context.dataIndex]?.v || 0;
        const red = Math.round(255 * value);
        const blue = Math.round(255 * (1 - value));
        const green = Math.round(128 * (1 - Math.abs(value - 0.5) * 2));
        return `rgba(${red}, ${green}, ${blue}, 0.8)`;
      },
      borderColor: getBorderColor(),
      borderWidth: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      width: ({ chart }: any) => (chart.chartArea?.width || 0) / heatMapData.metrics.length - 2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      height: ({ chart }: any) => (chart.chartArea?.height || 0) / heatMapData.categories.length - 2,
    }],
  };

  const heatMapOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: () => '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const point = context.raw;
            return [
              `${t('product.category')}: ${point.category}`,
              `${heatMapData.metricLabels[point.metric as keyof typeof heatMapData.metricLabels]}: ${point.rawValue.toFixed(2)}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        labels: heatMapData.metrics.map(m => heatMapData.metricLabels[m as keyof typeof heatMapData.metricLabels]),
        offset: true,
        ticks: { color: getTextColor() },
        grid: { display: false },
      },
      y: {
        type: 'category' as const,
        labels: heatMapData.categories,
        offset: true,
        ticks: { color: getTextColor() },
        grid: { display: false },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: getTextColor() },
      },
    },
  };

  const scatterOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const point = context.raw;
            return `${point.label}: Stock ${point.x}, Sales ${point.y}`;
          },
        },
      },
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: t('charts.stockTotal'),
          color: getTextColor(),
        },
      },
      y: {
        ...chartOptions.scales.y,
        title: {
          display: true,
          text: t('charts.salesUnits'),
          color: getTextColor(),
        },
      },
    },
  };

  const charts = {
    heatmap: {
      title: t('charts.categoryPerformance'),
      icon: '🔥',
      component: <Chart type="matrix" data={heatMapChartData} options={heatMapOptions} />,
    },
    salesByCategory: {
      title: t('charts.salesByCategory'),
      icon: '📊',
      component: <Bar data={salesByCategory} options={chartOptions} />,
    },
    stockByCategory: {
      title: t('charts.stockByCategory'),
      icon: '📦',
      component: <Bar data={stockByCategory} options={chartOptions} />,
    },
    salesVsStock: {
      title: t('charts.salesVsStock'),
      icon: '🎯',
      component: <Scatter data={scatterData} options={scatterOptions} />,
    },
    salesDistribution: {
      title: t('charts.salesDistribution'),
      icon: '🍰',
      component: <Pie data={pieData} options={pieOptions} />,
    },
  };

  if (products.length === 0) {
    return (
      <div className="chart-gallery">
        <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>
          {t('charts.noData')}
        </p>
      </div>
    );
  }

  return (
    <div className="chart-gallery">
      <h2>📊 {t('charts.title')}</h2>
      
      {/* Main Chart */}
      <div className="main-chart">
        <h3>{charts[selectedChart].icon} {charts[selectedChart].title}</h3>
        <div style={{ height: '500px' }}>
          {charts[selectedChart].component}
        </div>
      </div>

      {/* Chart Thumbnails */}
      <div className="chart-thumbnails">
        {(Object.keys(charts) as ChartType[]).map((chartKey) => (
          <button
            key={chartKey}
            className={`chart-thumbnail ${selectedChart === chartKey ? 'active' : ''}`}
            onClick={() => setSelectedChart(chartKey)}
            aria-label={`Select ${charts[chartKey].title}`}
          >
            <div className="thumbnail-icon">{charts[chartKey].icon}</div>
            <div className="thumbnail-title">{charts[chartKey].title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChartGallery;;
