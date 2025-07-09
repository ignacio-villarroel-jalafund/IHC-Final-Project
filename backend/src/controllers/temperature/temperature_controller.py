from fastapi import APIRouter, HTTPException
from ...schemas.temperature import Temperature
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/temperature", response_model=Temperature)
def get_temperature_data():
    temp_value = data_service.get_data("temperature")
    
    if temp_value == "No data yet":
        raise HTTPException(status_code=404, detail="No data yet.")
    
    return {"temp": float(temp_value)}
