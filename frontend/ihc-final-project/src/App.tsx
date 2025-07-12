import React, { useState, useEffect } from 'react';
import type { ChartData } from 'chart.js';

// Importa el servicio de API actualizado

// Importa los componentes (sin cambios en esta parte)
import RealTimeChart from './components/RealTimeChart';
import TemperatureGauge from './components/TemperatureGauge';
import DeviceStatus from './components/DeviceStatus';
import StatusIndicator from './components/StatusIndicator';
import './Dashboard.css';
import { apiService } from './hook/apiService';

const App: React.FC = () => {
  // El estado se mantiene igual que en la versión anterior
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [distance, setDistance] = useState(0);
  const [intruderAlarm, setIntruderAlarm] = useState(0);
  const [personDetector, setPersonDetector] = useState(0);

  const [lineChartData, setLineChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [{
      label: 'Humedad (%)',
      data: [],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.3,
    }],
  });

  // --- EFECTO PARA OBTENER DATOS CON 5 FETCHES ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. Llama a todas las funciones de la API al mismo tiempo
      const results = await Promise.allSettled([
        apiService.getTemperature(),
        apiService.getHumidity(),
        apiService.getDistance(),
        // apiService.getIntruderAlarm(),
        // apiService.getPersonDetector(),
      ]);

      // 2. Procesa cada resultado individualmente
      const [tempResult, humidityResult, distResult,] = results;

      // Actualiza la temperatura si la petición tuvo éxito
      if (tempResult.status === 'fulfilled') {
        setTemperature(tempResult.value);
      }
      
      // Actualiza la humedad y la gráfica si la petición tuvo éxito
      if (humidityResult.status === 'fulfilled') {
        setHumidity(humidityResult.value);
        
        // Actualiza la gráfica con el nuevo valor
        const newLabel = new Date().toLocaleTimeString();
        setLineChartData(prevData => ({
          labels: [...prevData.labels!, newLabel].slice(-30),
          datasets: [{
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data, humidityResult.value].slice(-30),
          }],
        }));
      }

      // Actualiza la distancia si la petición tuvo éxito
      if (distResult.status === 'fulfilled') {
        setDistance(distResult.value);
      }

      // Actualiza la alarma si la petición tuvo éxito
      // if (alarmResult.status === 'fulfilled') {
      //   setIntruderAlarm(alarmResult.value);
      // }
      
      // // Actualiza el detector de personas si la petición tuvo éxito
      // if (personResult.status === 'fulfilled') {
      //   setPersonDetector(personResult.value);
      // }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // El JSX se mantiene exactamente igual, no necesita cambios
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard de Monitoreo de Sensores</h1>
      </header>
      
      <main className="dashboard-layout">
        <div className="main-content">
          <div className="dashboard-card chart-card">
            <h2>Historial de Humedad</h2>
            <RealTimeChart data={lineChartData} />
          </div>
        </div>

        <aside className="sidebar-content">
          <div className="dashboard-card">
            <h2>Temperatura</h2>
            <TemperatureGauge temperature={temperature} maxTemp={100} />
          </div>
          
          <div className="dashboard-card">
            <h2>Proximidad del Sensor (cm)</h2>
            <StatusIndicator value={distance} thresholds={{ warning: 10, danger: 5 }} />
          </div>
          
          <div className="dashboard-card">
            <h2>Estado de Dispositivos</h2>
            <DeviceStatus 
              intruderAlarmState={intruderAlarm}
              personDetectorState={personDetector}
            />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;