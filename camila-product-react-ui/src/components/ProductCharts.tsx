import { useMemo } from 'react';
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
  ArcElement
);

interface ProductChartsProps {
  products: Product[];
}

export const ProductCharts = ({ products }: ProductChartsProps) => {
  const { t } = useTranslation();

  const aggregatedData = useMemo(() => {
    const categoryMap = new Map<string, { salesUnits: number; stockTotal: number }>();

    products.forEach((product) => {
      const category = product.category || 'Unknown';
      const existing = categoryMap.get(category) || { salesUnits: 0, stockTotal: 0 };
      
      const stockTotal = Object.values(product.stock || {}).reduce((sum, val) => sum + val, 0);
      
      categoryMap.set(category, {
        salesUnits: existing.salesUnits + (product.salesUnits || 0),
        stockTotal: existing.stockTotal + stockTotal,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [products]);

  const salesByCategory = {
    labels: aggregatedData.map((d) => d.category),
    datasets: [
      {
        label: t('charts.salesUnits'),
        data: aggregatedData.map((d) => d.salesUnits),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const stockByCategory = {
    labels: aggregatedData.map((d) => d.category),
    datasets: [
      {
        label: t('charts.stockTotal'),
        data: aggregatedData.map((d) => d.stockTotal),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
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
      },
    ],
  };

  const pieData = {
    labels: aggregatedData.map((d) => d.category),
    datasets: [
      {
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
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#ddd',
        },
      },
      y: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#ddd',
        },
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
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: t('charts.stockTotal'),
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
      },
      y: {
        ...chartOptions.scales.y,
        title: {
          display: true,
          text: t('charts.salesUnits'),
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000',
        },
      },
      title: {
        display: false,
      },
    },
  };

  if (products.length === 0) {
    return (
      <div className="charts-container">
        <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>
          {t('charts.noData')}
        </p>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <h2>{t('charts.title')}</h2>
      
      <div className="charts-grid">
        <div className="chart-item">
          <h3>{t('charts.salesByCategory')}</h3>
          <div style={{ height: '300px' }}>
            <Bar data={salesByCategory} options={chartOptions} />
          </div>
        </div>

        <div className="chart-item">
          <h3>{t('charts.stockByCategory')}</h3>
          <div style={{ height: '300px' }}>
            <Bar data={stockByCategory} options={chartOptions} />
          </div>
        </div>

        <div className="chart-item">
          <h3>{t('charts.salesVsStock')}</h3>
          <div style={{ height: '300px' }}>
            <Scatter data={scatterData} options={scatterOptions} />
          </div>
        </div>

        <div className="chart-item">
          <h3>{t('charts.salesDistribution')}</h3>
          <div style={{ height: '300px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
