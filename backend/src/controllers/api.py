from fastapi import APIRouter
from .distance import distance_controller
from .humidity import humidity_controller
from .infrared import infrared_controller
from .temperature import temperature_controller

api_router = APIRouter()
api_router.include_router(distance_controller.router, tags=["Distance"])
api_router.include_router(humidity_controller.router, tags=["Humidity"])
api_router.include_router(infrared_controller.router, tags=["Infrared"])
api_router.include_router(temperature_controller.router, tags=["Temperature"])
