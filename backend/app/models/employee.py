from __future__ import annotations
import enum
from typing import TYPE_CHECKING

from sqlalchemy import Enum, String, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.cafe_employee import CafeEmployee


class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"


class Employee(TimestampMixin, Base):
    __tablename__ = "employees"
    __table_args__ = (
        CheckConstraint(
            r"id ~ '^UI[A-Za-z0-9]{7}$'",
            name="ck_employees_id_format",
        ),
        CheckConstraint(
            r"phone_number ~ '^[89][0-9]{7}$'",
            name="ck_employees_phone_number_format",
        ),
    )

    # Unique employee id in the format ‘UIXXXXXXX’ where the X is replaced with alphanumeric
    id: Mapped[str] = mapped_column(String(9), primary_key=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email_address: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )
    phone_number: Mapped[str] = mapped_column(String(8), nullable=False)
    gender: Mapped[GenderEnum] = mapped_column(
        Enum(GenderEnum, name="gender_enum"),
        nullable=False
    )

    # Relationships
    cafe_employees: Mapped[list["CafeEmployee"]] = relationship(
        "CafeEmployee",
        back_populates="employee",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
