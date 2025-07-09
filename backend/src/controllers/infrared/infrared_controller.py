from fastapi import APIRouter
from ...schemas.infrared import Infrared
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/infrared", response_model=Infrared)
def get_infrared_data():
    infrared_value = data_service.get_data("infrared")
    return infrared_value
