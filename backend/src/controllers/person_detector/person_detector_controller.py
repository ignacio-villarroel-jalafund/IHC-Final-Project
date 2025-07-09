from fastapi import APIRouter, HTTPException
from ...schemas.person_detector import PersonDetector
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/person-detector", response_model=PersonDetector)
def get_person_detector_data():
    detection_value = data_service.get_data("person_detector")

    if detection_value == "No data yet":
        raise HTTPException(status_code=404, detail="No data yet.")

    return {"detection_level": float(detection_value)}
