from pydantic import BaseModel

class Infrared(BaseModel):
    infrared: float
    detection: bool
