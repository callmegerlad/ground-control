from __future__ import annotations
import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey, Index, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.cafe import Cafe
    from app.models.employee import Employee


class CafeEmployee(Base):
    __tablename__ = "cafe_employees"
    __table_args__ = (
        Index("ix_cafe_employees_cafe_id", "cafe_id"),
        Index("ix_cafe_employees_employee_id", "employee_id"),
        UniqueConstraint(
            "cafe_id",
            "employee_id",
            name="uq_cafe_employees_cafe_employee"
        ),
        UniqueConstraint(
            "employee_id",
            name="uq_cafe_employees_employee_single_cafe"
        )
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    cafe_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("cafes.id", ondelete="CASCADE"),
        nullable=False,
    )
    employee_id: Mapped[str] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )

    start_date: Mapped[date] = mapped_column(Date, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    cafe: Mapped["Cafe"] = relationship(
        "Cafe",
        back_populates="cafe_employees")
    employee: Mapped["Employee"] = relationship(
        "Employee",
        back_populates="cafe_employees")
