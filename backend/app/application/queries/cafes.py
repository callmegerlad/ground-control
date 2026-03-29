from uuid import UUID
from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.cafe import Cafe
from app.models.cafe_employee import CafeEmployee


@dataclass(frozen=True)
class ListCafesQuery:
    location: str | None = None


class ListCafesHandler:
    """Handler for query to list cafes."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, query: ListCafesQuery) -> list[Cafe]:
        stmt = select(Cafe).outerjoin(CafeEmployee)

        # Filter by location (optional)
        if query.location is not None:
            stmt = stmt.where(Cafe.location == query.location)

        stmt = stmt.group_by(Cafe.id).order_by(
            func.count(CafeEmployee.id).desc()
        )

        return list(self.db.scalars(stmt).all())
