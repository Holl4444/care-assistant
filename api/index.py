from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers.care_logs import router as care_logs_router
from api.routers.projects import router as projects_router

app = FastAPI(title="Carekin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

app.include_router(care_logs_router)
app.include_router(projects_router)

__all__ = ["app"]
