from fastapi import APIRouter, HTTPException
from ...schemas.distance import Distance
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/distance", response_model=Distance)
def get_distance_data():
    distance_value = data_service.get_data("distance")

    if distance_value == "No data yet":
        raise HTTPException(status_code=404, detail="No data yet.")
        
    return {"distance": float(distance_value)}
