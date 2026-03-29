from fastapi import APIRouter
from app.api.v1.cafes import router as cafes_router
from app.api.v1.employees import router as employees_router


api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(
    cafes_router,
    prefix="/cafes",
    tags=["cafes"]
)
api_v1_router.include_router(
    employees_router,
    prefix="/employees",
    tags=["employees"]
)
