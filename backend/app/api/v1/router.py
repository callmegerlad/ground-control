from fastapi import APIRouter
from app.api.v1.cafes import router as cafes_router


api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(
    cafes_router,
    prefix="/cafes",
    tags=["cafes"]
)
