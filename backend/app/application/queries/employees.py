from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import Integer, func, cast, select
from sqlalchemy.orm import Session

from app.models.cafe import Cafe
from app.models.cafe_employee import CafeEmployee
from app.models.employee import Employee
from app.schemas.employee import EmployeeResponse
from app.core.exceptions import NotFoundException


@dataclass(frozen=True)
class ListEmployeesQuery:
    cafe_id: UUID | None = None


@dataclass(frozen=True)
class GetEmployeeByIdQuery:
    employee_id: str


class ListEmployeesHandler:
    """Handler for query to list employees."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, query: ListEmployeesQuery) -> list[EmployeeResponse]:
        days_worked_expr = func.coalesce(
            cast(func.current_date() - CafeEmployee.start_date, Integer),
            0,
        )

        stmt = (
            select(
                Employee.id,
                Employee.name,
                Employee.email_address,
                Employee.phone_number,
                Employee.gender,
                Employee.created_at,
                Employee.updated_at,
                Cafe.name.label("cafe"),
                days_worked_expr.label("days_worked"),
            )
            .outerjoin(CafeEmployee, CafeEmployee.employee_id == Employee.id)
            .outerjoin(Cafe, Cafe.id == CafeEmployee.cafe_id)
            .order_by(days_worked_expr.desc(), Employee.name.asc())
        )

        # Filter by cafe_id (optional)
        if query.cafe_id is not None:
            stmt = stmt.where(CafeEmployee.cafe_id == query.cafe_id)

        employees = self.db.execute(stmt).mappings().all()
        return [EmployeeResponse.model_validate(employee) for employee in employees]


class GetEmployeeByIdHandler:
    """Handler for query to get employee by ID."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def handle(self, query: GetEmployeeByIdQuery) -> EmployeeResponse:
        days_worked_expr = func.coalesce(
            cast(func.current_date() - CafeEmployee.start_date, Integer),
            0,
        )

        stmt = (
            select(
                Employee.id,
                Employee.name,
                Employee.email_address,
                Employee.phone_number,
                Employee.gender,
                Employee.created_at,
                Employee.updated_at,
                Cafe.name.label("cafe"),
                days_worked_expr.label("days_worked"),
            )
            .outerjoin(CafeEmployee, CafeEmployee.employee_id == Employee.id)
            .outerjoin(Cafe, Cafe.id == CafeEmployee.cafe_id)
            .where(Employee.id == query.employee_id)
        )

        employee = self.db.execute(stmt).mappings().first()
        if employee is None:
            raise NotFoundException(detail="Employee not found")

        return EmployeeResponse.model_validate(employee)
