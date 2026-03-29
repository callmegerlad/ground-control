from uuid import UUID
from typing import Any
from dataclasses import dataclass
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cafe import Cafe
from app.models.employee import Employee
from app.models.cafe_employee import CafeEmployee
from app.core.exceptions import BadRequestException, NotFoundException


@dataclass(frozen=True)
class CreateEmployeeCommand:
    employee_id: str
    name: str
    email_address: str
    phone_number: str
    gender: str
    cafe_id: UUID | None = None
    start_date: datetime | None = datetime.now(timezone.utc)


@dataclass(frozen=True)
class UpdateEmployeeCommand:
    employee_id: str
    data: dict[str, Any]


@dataclass(frozen=True)
class DeleteEmployeeCommand:
    employee_id: str


class CreateEmployeeHandler:
    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, command: CreateEmployeeCommand) -> Employee:
        if command.cafe_id is not None:
            cafe = self.db.get(Cafe, command.cafe_id)
            if cafe is None:
                raise NotFoundException(detail="Cafe not found")

        employee = Employee(
            id=command.employee_id,
            name=command.name,
            email_address=command.email_address,
            phone_number=command.phone_number,
            gender=command.gender,
        )
        self.db.add(employee)

        if command.cafe_id is not None:
            assignment = CafeEmployee(
                cafe_id=command.cafe_id,
                employee_id=command.employee_id,
                start_date=command.start_date,
            )
            self.db.add(assignment)

        self.db.commit()
        self.db.refresh(employee)
        return employee


class UpdateEmployeeHandler:
    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, command: UpdateEmployeeCommand) -> Employee | None:
        employee = self.db.get(Employee, command.employee_id)
        if employee is None:
            return None

        update_data = dict(command.data)
        has_cafe_id = "cafe_id" in update_data
        has_start_date = "start_date" in update_data
        cafe_id = update_data.pop("cafe_id", None)
        start_date = update_data.pop("start_date", None)

        # update fields on Employee
        for field, value in update_data.items():
            setattr(employee, field, value)

        # handle update fields on CafeEmployee
        if has_cafe_id or has_start_date:
            assignment = self.db.scalar(
                select(CafeEmployee)
                .where(CafeEmployee.employee_id == employee.id)
                .order_by(CafeEmployee.created_at.desc())
            )

            if has_cafe_id and cafe_id is not None:
                cafe = self.db.get(Cafe, cafe_id)
                if cafe is None:
                    raise NotFoundException(detail="Cafe not found")

            if has_cafe_id and cafe_id is None:
                if has_start_date:
                    raise BadRequestException(
                        detail="Cannot set start_date when cafe_id is null"
                    )
                if assignment is not None:
                    self.db.delete(assignment)
            else:
                if assignment is None:
                    if cafe_id is None:
                        raise BadRequestException(
                            detail="cafe_id is required to create assignment"
                        )

                    assignment = CafeEmployee(
                        cafe_id=cafe_id,
                        employee_id=employee.id,
                        start_date=(
                            start_date.date()
                            if isinstance(start_date, datetime)
                            else datetime.now(timezone.utc).date()
                        ),
                    )
                    self.db.add(assignment)
                else:
                    if has_cafe_id and cafe_id is not None:
                        assignment.cafe_id = cafe_id
                    if has_start_date:
                        if start_date is None:
                            raise BadRequestException(
                                detail="start_date cannot be null"
                            )
                        assignment.start_date = (
                            start_date.date()
                            if isinstance(start_date, datetime)
                            else start_date
                        )

        self.db.commit()
        self.db.refresh(employee)
        return employee


class DeleteEmployeeHandler:
    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, command: DeleteEmployeeCommand) -> bool:
        employee = self.db.get(Employee, command.employee_id)
        if employee is None:
            return False

        self.db.delete(employee)
        self.db.commit()
        return True
