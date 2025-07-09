from fastapi import APIRouter, HTTPException
from ...schemas.intruder_alarm import IntruderAlarm
from ...services.mqtt_data_service import data_service

router = APIRouter()

@router.get("/intruder-alarm", response_model=IntruderAlarm)
def get_intruder_alarm_data():
    alarm_value = data_service.get_data("intruder_alarm")

    if alarm_value == "No data yet":
        raise HTTPException(status_code=404, detail="No data yet.")
        
    return {"alarm_level": float(alarm_value)}
