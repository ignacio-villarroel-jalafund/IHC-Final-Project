from fastapi import APIRouter, HTTPException
from ...schemas.humidity import Humidity
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/humidity", response_model=Humidity)
def get_humidity_data():
    humidity_value = data_service.get_data("humidity")
    
    if humidity_value == "No data yet":
        raise HTTPException(status_code=404, detail="No data yet.")
        
    return {"humidity": float(humidity_value)}
