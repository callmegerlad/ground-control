from uuid import UUID
from typing import Any
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cafe import Cafe
from app.models.cafe_employee import CafeEmployee
from app.models.employee import Employee


@dataclass(frozen=True)
class CreateCafeCommand:
    name: str
    description: str
    logo_path: str | None
    location: str


@dataclass(frozen=True)
class UpdateCafeCommand:
    cafe_id: UUID
    data: dict[str, Any]


@dataclass(frozen=True)
class DeleteCafeCommand:
    cafe_id: UUID


class CreateCafeHandler:
    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, command: CreateCafeCommand) -> Cafe:
        cafe = Cafe(
            name=command.name,
            description=command.description,
            logo_path=command.logo_path,
            location=command.location,
        )
        self.db.add(cafe)
        self.db.commit()
        self.db.refresh(cafe)
        return cafe


class UpdateCafeHandler:
    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, command: UpdateCafeCommand) -> Cafe | None:
        cafe = self.db.get(Cafe, command.cafe_id)
        if cafe is None:
            return None

        for field, value in command.data.items():
            setattr(cafe, field, value)

        self.db.commit()
        self.db.refresh(cafe)
        return cafe


class DeleteCafeHandler:
    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, command: DeleteCafeCommand) -> bool:
        cafe = self.db.get(Cafe, command.cafe_id)
        if cafe is None:
            return False

        # Delete all employees associated with this cafe
        cafe_employees = self.db.scalars(
            select(CafeEmployee).where(CafeEmployee.cafe_id == command.cafe_id)
        ).all()

        for cafe_employee in cafe_employees:
            employee = self.db.get(Employee, cafe_employee.employee_id)
            if employee is not None:
                self.db.delete(employee)

        # Delete the cafe
        self.db.delete(cafe)
        self.db.commit()
        return True
