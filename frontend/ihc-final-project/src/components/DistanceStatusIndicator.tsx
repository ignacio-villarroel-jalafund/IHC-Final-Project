import React from 'react';

interface StatusIndicatorProps {
  value: number;
  thresholds: {
    warning: number;
    danger: number;
  };
}

const DistanceStatusIndicator: React.FC<StatusIndicatorProps> = ({ value, thresholds }) => {
  let status = 'safe';
  let message = 'Seguro';

  if (value >= thresholds.danger) {
    status = 'danger';
    message = 'Peligro';
  } else if (value >= thresholds.warning) {
    status = 'warning';
    message = 'Advertencia';
  }

  return (
    <div className={`status-indicator-panel ${status}`}>
      <div className="status-lights">
        <div className={`light green ${status === 'safe' ? 'active' : ''}`}></div>
        <div className={`light yellow ${status === 'warning' ? 'active' : ''}`}></div>
        <div className={`light red ${status === 'danger' ? 'active' : ''}`}></div>
      </div>
      <div className="status-message">
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default DistanceStatusIndicator;