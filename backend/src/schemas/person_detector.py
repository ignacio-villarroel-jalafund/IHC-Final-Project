from pydantic import BaseModel

class PersonDetector(BaseModel):
    detection_level: float
