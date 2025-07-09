from fastapi import FastAPI
from src.controllers import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="IHC Final Project",
    description="API to get physical sensors information",
    version="1.0.0",
    
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc"
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the IHC final project API"}

app.add_middleware(   
     CORSMiddleware,
     allow_origins=["*"],
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
)