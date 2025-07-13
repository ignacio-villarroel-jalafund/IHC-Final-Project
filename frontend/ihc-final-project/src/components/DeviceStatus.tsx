import React from 'react';

interface DeviceStatusProps {
  intruderAlarmState: number;
  personDetectorState: number;
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ intruderAlarmState, personDetectorState }) => {
  const isAlarmActive = intruderAlarmState >= 750.0;
  const isPersonDetected = personDetectorState >= 750.0;

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
      </div>
    </div>
  );
};

export default DeviceStatus;