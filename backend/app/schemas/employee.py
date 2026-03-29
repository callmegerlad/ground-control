from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.employee import GenderEnum


class EmployeeBase(BaseModel):
    """Base schema for employee."""
    id: str = Field(..., pattern=r"^UI[A-Za-z0-9]{7}$")
    name: str = Field(..., max_length=255)
    email_address: EmailStr
    phone_number: str = Field(..., pattern=r"^[89][0-9]{7}$")
    gender: GenderEnum


class EmployeeResponse(EmployeeBase):
    """Schema for employee response."""
    days_worked: int
    cafe: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployeeCreate(EmployeeBase):
    """Schema for creating a new employee."""
    cafe_id: UUID | None = None
    start_date: datetime | None = None


class EmployeeUpdate(BaseModel):
    """Schema for updating an existing employee."""
    name: str | None = Field(default=None, max_length=255)
    email_address: EmailStr | None = None
    phone_number: str | None = Field(default=None, pattern=r"^[89][0-9]{7}$")
    gender: GenderEnum | None = None
    cafe_id: UUID | None = None
    start_date: datetime | None = None
