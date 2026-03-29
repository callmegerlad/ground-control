from uuid import UUID

from fastapi import APIRouter, status, Depends

from app.application.mediator import Mediator
from app.application.commands.employees import (
    CreateEmployeeCommand,
    DeleteEmployeeCommand,
    UpdateEmployeeCommand,
)
from app.application.queries.employees import ListEmployeesQuery, GetEmployeeByIdQuery
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.core.exceptions import NotFoundException, BadRequestException
from app.core.dependencies import get_mediator


router = APIRouter()


@router.get(
    "/",
    response_model=list[EmployeeResponse],
    status_code=status.HTTP_200_OK,
)
def list_employees(
    cafe_id: UUID | None = None,
    mediator: Mediator = Depends(get_mediator),
) -> list[EmployeeResponse]:
    """
    Return a list of employees, optionally filtered by cafe ID.

    Employees are ordered by number of days worked (descending), and then by name (ascending).
    """
    query = ListEmployeesQuery(cafe_id=cafe_id)
    return mediator.send(query)


@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(
    payload: EmployeeCreate,
    mediator: Mediator = Depends(get_mediator),
) -> EmployeeResponse:
    """Create a new employee, and optionally assign them to a cafe with a start date."""
    command = CreateEmployeeCommand(
        employee_id=payload.id,
        name=payload.name,
        email_address=payload.email_address,
        phone_number=payload.phone_number,
        gender=payload.gender,
        cafe_id=payload.cafe_id,
        start_date=payload.start_date or None,
    )
    employee = mediator.send(command)
    query = GetEmployeeByIdQuery(employee_id=employee.id)
    return mediator.send(query)


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
    status_code=status.HTTP_200_OK,
)
def update_employee(
    employee_id: str,
    payload: EmployeeUpdate,
    mediator: Mediator = Depends(get_mediator),
) -> EmployeeResponse:
    """Update an existing employee's details by ID."""
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        raise BadRequestException(detail="No fields provided for update")

    command = UpdateEmployeeCommand(
        employee_id=employee_id,
        data=update_data,
    )
    employee = mediator.send(command)

    if employee is None:
        raise NotFoundException(detail="Employee not found")
    
    query = GetEmployeeByIdQuery(employee_id=employee.id)
    return mediator.send(query)


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_employee(
    employee_id: str,
    mediator: Mediator = Depends(get_mediator),
) -> None:
    """Delete an employee by ID."""
    command = DeleteEmployeeCommand(employee_id=employee_id)
    deleted = mediator.send(command)

    if not deleted:
        raise NotFoundException(detail="Employee not found")
