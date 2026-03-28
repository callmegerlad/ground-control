from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.employee import GenderEnum


class EmployeeBase(BaseModel):
    name: str = Field(..., max_length=255)
    email_address: EmailStr
    phone_number: str = Field(..., pattern=r"^[89][0-9]{7}$")
    gender: GenderEnum


class EmployeeCreate(EmployeeBase):
    id: str = Field(..., pattern=r"^UI[A-Za-z0-9]{7}$")


class EmployeeUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    email_address: EmailStr | None = None
    phone_number: str | None = Field(default=None, pattern=r"^[89][0-9]{7}$")
    gender: GenderEnum | None = None


class EmployeeResponse(EmployeeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
