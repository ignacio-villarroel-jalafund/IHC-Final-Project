import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, type ChartOptions, type ChartData
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// NUEVO: Definimos las props que recibirá el componente
interface RealTimeChartProps {
  data: ChartData<'line'>;
}

// QUITAMOS: El useState y el useEffect de este componente.
// Ahora es un componente de presentación puro.
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
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default RealTimeChart;