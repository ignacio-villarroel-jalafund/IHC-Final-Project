from fastapi import APIRouter

from ...schemas.infrared import Temperature
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/temperature", response_model=Temperature)
def get_temperature_data():
    temp_value = data_service.get_data("temp")
    return {"temp": temp_value}
