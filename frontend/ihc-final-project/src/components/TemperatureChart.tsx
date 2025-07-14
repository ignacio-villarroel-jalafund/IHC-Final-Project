import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const getGaugeColor = (temperature: number, maxTemp: number): { background: string; border: string } => {
  const green = { r: 0, g: 255, b: 0 };   
  const yellow = { r: 255, g: 255, b: 0 };
  const red = { r: 255, g: 0, b: 0 };     
  
  const midPoint = maxTemp / 2;
  let r, g, b;

  if (temperature <= midPoint) {
    const percentage = temperature / midPoint;
    r = green.r + percentage * (yellow.r - green.r);
    g = green.g + percentage * (yellow.g - green.g);
    b = green.b + percentage * (yellow.b - green.b);
  } else {
    const percentage = (temperature - midPoint) / midPoint;
    r = yellow.r + percentage * (red.r - yellow.r);
    g = yellow.g + percentage * (red.g - yellow.g);
    b = yellow.b + percentage * (red.b - yellow.b);
  }
  
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return {
    background: `rgba(${r}, ${g}, ${b}, 0.9)`, 
    border: `rgba(${r}, ${g}, ${b}, 1)`,      
  };
};

const gaugeTextPlugin: Plugin<'doughnut'> = {
  id: 'gaugeText',
  beforeDraw: (chart) => {
    const { ctx, data, chartArea: { top, width, height } } = chart;
    const temperature = data.datasets[0].data[0] as number;

    ctx.save();
    ctx.font = `bold ${height / 4.5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#333';
    ctx.fillText(`${temperature.toFixed(1)}°C`, width / 2, top + (height / 1.6));
    ctx.restore();
  },
};

interface TemperatureGaugeProps {
  temperature: number;
  maxTemp?: number;
}

const TemperatureChart: React.FC<TemperatureGaugeProps> = ({ temperature, maxTemp = 40 }) => {
  const gaugeColor = getGaugeColor(temperature, maxTemp);
  
  const data = {
    datasets: [
      {
        data: [temperature, maxTemp - temperature],
        backgroundColor: [
          gaugeColor.background,
          'rgba(230, 230, 230, 0.5)',
        ],
        borderColor: [
          gaugeColor.border,
          'rgba(230, 230, 230, 0.3)',
        ],
        borderWidth: 1,
        circumference: 180,
        rotation: -90,
      },
    ],
    labels: ['Temperatura', 'Restante'],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 500,
    },
    cutout: '80%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '150px', width: '100%' }}>
       <Doughnut data={data} options={options} plugins={[gaugeTextPlugin]} />
    </div>
  );
};

export default TemperatureChart;