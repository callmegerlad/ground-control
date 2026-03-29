from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.application.mediator import Mediator
from app.application.commands.cafes import (
    CreateCafeCommand,
    CreateCafeHandler,
    DeleteCafeCommand,
    DeleteCafeHandler,
    UpdateCafeCommand,
    UpdateCafeHandler,
)
from app.application.queries.cafes import (
    ListCafesQuery,
    ListCafesHandler,
)
from app.application.commands.employees import (
    CreateEmployeeCommand,
    CreateEmployeeHandler,
    DeleteEmployeeCommand,
    DeleteEmployeeHandler,
    UpdateEmployeeCommand,
    UpdateEmployeeHandler,
)
from app.application.queries.employees import (
    ListEmployeesQuery,
    ListEmployeesHandler,
    GetEmployeeByIdQuery,
    GetEmployeeByIdHandler
)


def get_mediator(db: Session = Depends(get_db)) -> Mediator:
    """Dependency to get mediator with all registered handlers."""

    return Mediator(
        handlers={
            CreateCafeCommand: CreateCafeHandler(db),
            UpdateCafeCommand: UpdateCafeHandler(db),
            DeleteCafeCommand: DeleteCafeHandler(db),
            ListCafesQuery: ListCafesHandler(db),
            CreateEmployeeCommand: CreateEmployeeHandler(db),
            UpdateEmployeeCommand: UpdateEmployeeHandler(db),
            DeleteEmployeeCommand: DeleteEmployeeHandler(db),
            ListEmployeesQuery: ListEmployeesHandler(db),
            GetEmployeeByIdQuery: GetEmployeeByIdHandler(db),
        }
    )
