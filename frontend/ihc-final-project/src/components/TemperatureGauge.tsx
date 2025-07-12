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

// --- FUNCIÓN AUXILIAR PARA CALCULAR EL COLOR ---
// Esta función crea una transición suave de verde -> amarillo -> rojo.
const getGaugeColor = (temperature: number, maxTemp: number): { background: string; border: string } => {
  // Definimos nuestros colores clave en formato RGB
  const green = { r: 0, g: 255, b: 0 };    // Verde puro
  const yellow = { r: 255, g: 255, b: 0 }; // Amarillo
  const red = { r: 255, g: 0, b: 0 };      // Rojo puro
  
  const midPoint = maxTemp / 2; // El punto medio (ej. 50 si maxTemp es 100)
  let r, g, b;

  if (temperature <= midPoint) {
    // Estamos en el rango de Verde a Amarillo
    const percentage = temperature / midPoint;
    r = green.r + percentage * (yellow.r - green.r);
    g = green.g + percentage * (yellow.g - green.g);
    b = green.b + percentage * (yellow.b - green.b);
  } else {
    // Estamos en el rango de Amarillo a Rojo
    const percentage = (temperature - midPoint) / midPoint;
    r = yellow.r + percentage * (red.r - yellow.r);
    g = yellow.g + percentage * (red.g - yellow.g);
    b = yellow.b + percentage * (red.b - yellow.b);
  }
  
  // Redondeamos los valores y creamos los strings de color con opacidad
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return {
    background: `rgba(${r}, ${g}, ${b}, 0.9)`, // Color con opacidad para el fondo
    border: `rgba(${r}, ${g}, ${b}, 1)`,       // Color sólido para el borde
  };
};
// ----------------------------------------------------


// Plugin para dibujar el texto en el centro (sin cambios)
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

const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({ temperature, maxTemp = 40 }) => {
  // **NUEVO**: Llamamos a nuestra función para obtener el color dinámico
  const gaugeColor = getGaugeColor(temperature, maxTemp);
  
  const data = {
    datasets: [
      {
        data: [temperature, maxTemp - temperature],
        // **MODIFICADO**: Usamos los colores dinámicos que calculamos
        backgroundColor: [
          gaugeColor.background,          // Color dinámico
          'rgba(230, 230, 230, 0.5)', // Color para el fondo/resto
        ],
        borderColor: [
          gaugeColor.border,              // Color dinámico
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
    maintainAspectRatio: true,
    animation: {
        duration: 500, // Añadimos una animación suave para la transición de color
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

  return <Doughnut data={data} options={options} plugins={[gaugeTextPlugin]} />;
};

export default TemperatureGauge;