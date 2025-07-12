// src/components/DeviceStatus.tsx
import React from 'react';
import { apiService } from '../hook/apiService';

interface DeviceStatusProps {
  intruderAlarmState: number;
  personDetectorState: number;
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ intruderAlarmState, personDetectorState }) => {
  // Convertimos 1.0 a 'true' y 0.0 a 'false'
  const isAlarmActive = intruderAlarmState === 1.0;
  const isPersonDetected = personDetectorState === 1.0;

  const handleSubmit =  async () => {
    console.log('--- INICIANDO PRUEBA DE TEMPERATURA ---');
    try {
      const tempValue = await apiService.getTemperature();
      alert(`¡Éxito! Valor recibido: ${tempValue}`);
      console.log('Valor recibido exitosamente:', tempValue);
    } catch (error) {
      alert('¡Error! Revisa la consola para más detalles.');
      console.error('Detalles del error en la prueba:', error);
    }
    console.log('--- FIN DE LA PRUEBA ---');
  };

  return (
    <div className="device-status-panel">
      <div className="status-item">
        <h3>Alarma de Intruso</h3>
        <span className={`status-text ${isAlarmActive ? 'active' : 'inactive'}`}>
          {isAlarmActive ? 'Activa' : 'Inactiva'}
        </span>
      </div>
      <div className="status-item">
        <h3>Detector de Personas</h3>
        <span className={`status-text ${isPersonDetected ? 'active' : 'inactive'}`}>
          {isPersonDetected ? 'Detectado' : 'No Detectado'}
        </span>
        <button onClick={handleSubmit}>
      Enviar asd
    </button>
      </div>
    </div>
  );
};

export default DeviceStatus;