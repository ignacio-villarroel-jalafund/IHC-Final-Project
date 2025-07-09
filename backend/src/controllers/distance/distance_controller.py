from fastapi import APIRouter
from ...schemas.distance import Distance
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/distance", response_model=Distance)
def get_distance_data():
    distance_value = data_service.get_data("distance")
    return {"distance": distance_value}
