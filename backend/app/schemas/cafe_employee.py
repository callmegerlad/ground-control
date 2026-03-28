from uuid import UUID
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class CafeEmployeeBase(BaseModel):
    cafe_id: UUID
    employee_id: str = Field(..., pattern=r"^UI[A-Za-z0-9]{7}$")
    start_date: date


class CafeEmployeeCreate(CafeEmployeeBase):
    pass


class CafeEmployeeUpdate(BaseModel):
    start_date: date | None = None


class CafeEmployeeResponse(CafeEmployeeBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
