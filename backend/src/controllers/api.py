from fastapi import APIRouter
from .distance import distance_controller
from .humidity import humidity_controller
from .temperature import temperature_controller
from .intruder_alarm import intruder_alarm_controller
from .person_detector import person_detector_controller

api_router = APIRouter()

api_router.include_router(distance_controller.router, tags=["Distance"])
api_router.include_router(humidity_controller.router, tags=["Humidity"])
api_router.include_router(temperature_controller.router, tags=["Temperature"])

api_router.include_router(intruder_alarm_controller.router, tags=["Infrared"])
api_router.include_router(person_detector_controller.router, tags=["Infrared"])
