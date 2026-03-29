from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class CafeResponse(BaseModel):
    """Schema for cafe response."""
    id: UUID
    name: str = Field(..., max_length=255)
    description: str
    logo_path: str | None = Field(default=None, max_length=512)
    location: str = Field(..., max_length=255)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CafeCreate(BaseModel):
    """Schema for creating a new cafe."""
    name: str = Field(..., max_length=255)
    description: str
    logo_path: str | None = Field(default=None, max_length=512)
    location: str = Field(..., max_length=255)


class CafeUpdate(BaseModel):
    """Schema for updating an existing cafe."""
    name: str | None = Field(default=None, max_length=255)
    description: str | None = None
    logo_path: str | None = Field(default=None, max_length=512)
    location: str | None = Field(default=None, max_length=255)
