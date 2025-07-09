from pydantic import BaseModel

class IntruderAlarm(BaseModel):
    alarm_level: float
