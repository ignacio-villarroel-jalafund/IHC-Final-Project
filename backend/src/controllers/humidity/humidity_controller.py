from fastapi import APIRouter
from ...schemas.humidity import Humidity
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/humidity", response_model=Humidity)
def get_humidity_data():
    humidity_value = data_service.get_data("humidity")
    return {"humidity": humidity_value}
