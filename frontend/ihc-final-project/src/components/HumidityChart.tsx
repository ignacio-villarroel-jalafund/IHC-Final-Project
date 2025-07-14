import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, type ChartOptions, type ChartData
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RealTimeChartProps {
  data: ChartData<'line'>;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ data }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Actividad del Sensor' },
    },
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default RealTimeChart;