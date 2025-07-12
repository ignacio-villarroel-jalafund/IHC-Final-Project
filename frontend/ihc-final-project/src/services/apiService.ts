const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const getTemperature = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/temperature`);
    if (!response.ok) {
      throw new Error(`Error en el endpoint /temperature: ${response.status}`);
    }
    const data: { temp: number } = await response.json();
    console.log('[API/getTemperature] Datos recibidos:', data);
    return data.temp;
  } catch (error) {
    console.error("Error en getTemperature:", error);
    throw error;
  }
};

const getHumidity = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/humidity`);
    if (!response.ok) {
      throw new Error(`Error en el endpoint /humidity: ${response.status}`);
    }
    const data: { humidity: number } = await response.json();
    console.log('[API/getHumidity] Datos recibidos:', data);
    return data.humidity;
  } catch (error) {
    console.error("Error en getHumidity:", error);
    throw error;
  }
};

const getDistance = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/distance`);
    if (!response.ok) {
      throw new Error(`Error en el endpoint /distance: ${response.status}`);
    }
    const data: { distance: number } = await response.json();
    console.log('[API/getDistance] Datos recibidos:', data);
    return data.distance;
  } catch (error) {
    console.error("Error en getDistance:", error);
    throw error;
  }
};

const getIntruderAlarm = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/intruder-alarm`);
    if (!response.ok) {
      throw new Error(`Error en el endpoint /intruder-alarm: ${response.status}`);
    }
    const data: { alarm_level: number } = await response.json();
    console.log('[API/getIntruderAlarm] Datos recibidos:', data);
    return data.alarm_level;
  } catch (error) {
    console.error("Error en getIntruderAlarm:", error);
    throw error;
  }
};

const getPersonDetector = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/person-detector`);
    if (!response.ok) {
      throw new Error(`Error en el endpoint /person-detector: ${response.status}`);
    }
    const data: { detection_level: number } = await response.json();
    console.log('[API/getPersonDetector] Datos recibidos:', data);
    return data.detection_level;
  } catch (error) {
    console.error("Error en getPersonDetector:", error);
    throw error;
  }
};

export const apiService = {
  getTemperature,
  getHumidity,
  getDistance,
  getIntruderAlarm,
  getPersonDetector,
};