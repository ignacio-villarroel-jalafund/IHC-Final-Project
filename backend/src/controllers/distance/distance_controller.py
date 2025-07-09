from fastapi import APIRouter

from schemas.distance import Distance

router = APIRouter()

@router.get("/distance", response_model=Distance)
def get_distance_data():
    