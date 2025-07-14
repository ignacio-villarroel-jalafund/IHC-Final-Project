import React, { useState, useEffect } from 'react';
import type { ChartData } from 'chart.js';

import HumidityChart from '../components/HumidityChart';
import TemperatureChart from '../components/TemperatureChart';
import DeviceStatus from '../components/DeviceStatus';
import DistanceStatusIndicator from '../components/DistanceStatusIndicator';
import { apiService } from '../services/apiService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [temperature, setTemperature] = useState(0);
  const [, setHumidity] = useState(0);
  const [distance, setDistance] = useState(0);
  const [intruderAlarm, setIntruderAlarm] = useState(0);
  const [personDetector, setPersonDetector] = useState(0);
  const [chartKey, setChartKey] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        apiService.getTemperature(),
        apiService.getHumidity(),
        apiService.getDistance(),
        apiService.getIntruderAlarm(),
        apiService.getPersonDetector(),
      ]);

      const [tempResult, humidityResult, distResult, alarmResult, personResult] = results;

      if (tempResult.status === 'fulfilled') {
        setTemperature(tempResult.value);
      }
      
      if (humidityResult.status === 'fulfilled') {
        setHumidity(humidityResult.value);
        
        const newLabel = new Date().toLocaleTimeString();
        setLineChartData(prevData => ({
          labels: [...prevData.labels!, newLabel].slice(-30),
          datasets: [{
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data, humidityResult.value].slice(-30),
          }],
        }));
      }

      if (distResult.status === 'fulfilled') {
        setDistance(distResult.value);
      }

      if (alarmResult.status === 'fulfilled') {
        setIntruderAlarm(alarmResult.value);
      }
      
      if (personResult.status === 'fulfilled') {
        setPersonDetector(personResult.value);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setChartKey(prevKey => prevKey + 1);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard de Monitoreo de Sensores</h1>
      </header>
      
      <main className="dashboard-layout">
        <div className="main-content">
          <div className="dashboard-card chart-card">
            <h2>Historial de Humedad</h2>
            <HumidityChart key={chartKey} data={lineChartData} />
          </div>
        </div>

        <aside className="sidebar-content">
          <div className="dashboard-card">
            <h2>Temperatura</h2>
            <TemperatureChart key={chartKey + 1} temperature={temperature} maxTemp={100} />
          </div>
          
          <div className="dashboard-card">
            <h2>Proximidad del Sensor</h2>
            <DistanceStatusIndicator value={distance} thresholds={{ warning: 200, danger: 100 }} />
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

export default Dashboard;
