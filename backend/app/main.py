from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_v1_router
from app.core.config import get_settings


# App metadata
description = """
☕️ Ground Control Backend API

*Created by Gerald Koh.*
"""
tags_metadata = [
    {
        "name": "cafes",
        "description": "Endpoints for managing cafes and their details."
    },
    {
        "name": "employees",
        "description": "Endpoints for managing employees, their details and their cafe assignments."
    }
]

# Retrieve settings
settings = get_settings()

# FastAPI app instance
app = FastAPI(
    title=settings.APP_NAME,
    description=description,
    openapi_tags=tags_metadata,
    version="1.0.0",
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (e.g. logo images)
static_dir = Path("static")
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(api_v1_router)
