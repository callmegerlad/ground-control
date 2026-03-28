from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CafeBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: str
    logo_path: str | None = Field(default=None, max_length=512)
    location: str = Field(..., max_length=255)


class CafeCreate(CafeBase):
    pass


class CafeUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = None
    logo_path: str | None = Field(default=None, max_length=512)
    location: str | None = Field(default=None, max_length=255)


class CafeResponse(CafeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
