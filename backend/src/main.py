from fastapi import FastAPI
from contextlib import asynccontextmanager
from .controllers.api import api_router
from .services.serial_service import start_serial_listener
from .services.mqtt_data_service import data_service
from fastapi.middleware.cors import CORSMiddleware
import threading


def start_background_services():
    data_service.start()
    thread = threading.Thread(target=start_serial_listener, daemon=True)
    thread.start()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting background services...")
    start_background_services()
    yield
    print("Services stopped.")


app = FastAPI(
    title="IHC Final Project",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    lifespan=lifespan,
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "IHC final project API"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
