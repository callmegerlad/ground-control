from __future__ import annotations
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.models.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.cafe_employee import CafeEmployee


class Cafe(TimestampMixin, Base):
    __tablename__ = "cafes"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    logo_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    cafe_employees: Mapped[list["CafeEmployee"]] = relationship(
        "CafeEmployee",
        back_populates="cafe",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
