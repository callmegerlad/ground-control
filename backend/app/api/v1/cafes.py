from uuid import UUID

from fastapi import APIRouter, status, Depends

from app.application.mediator import Mediator
from app.application.commands.cafes import (
    CreateCafeCommand,
    DeleteCafeCommand,
    UpdateCafeCommand,
)
from app.application.queries.cafes import ListCafesQuery
from app.schemas.cafe import CafeCreate, CafeResponse, CafeUpdate
from app.core.exceptions import NotFoundException, BadRequestException
from app.core.dependencies import get_mediator


router = APIRouter(prefix="/cafes", tags=["cafes"])


@router.get(
    "/",
    response_model=list[CafeResponse],
    status_code=status.HTTP_200_OK,
)
def list_cafes(
    location: str | None = None,
    mediator: Mediator = Depends(get_mediator),
) -> list[CafeResponse]:
    query = ListCafesQuery(location=location)
    return mediator.send(query)


@router.post(
    "/",
    response_model=CafeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_cafe(
    payload: CafeCreate,
    mediator: Mediator = Depends(get_mediator),
) -> CafeResponse:
    command = CreateCafeCommand(
        name=payload.name,
        description=payload.description,
        logo_path=payload.logo_path,
        location=payload.location,
    )
    return mediator.send(command)


@router.put(
    "/{cafe_id}",
    response_model=CafeResponse,
    status_code=status.HTTP_200_OK,
)
def update_cafe(
    cafe_id: UUID,
    payload: CafeUpdate,
    mediator: Mediator = Depends(get_mediator),
) -> CafeResponse:
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        raise BadRequestException(detail="No fields provided for update")

    command = UpdateCafeCommand(
        cafe_id=cafe_id,
        data=update_data,
    )
    cafe = mediator.send(command)

    if cafe is None:
        raise NotFoundException(detail="Cafe not found")

    return cafe


@router.delete(
    "/{cafe_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_cafe(
    cafe_id: UUID,
    mediator: Mediator = Depends(get_mediator),
) -> None:
    command = DeleteCafeCommand(cafe_id=cafe_id)
    deleted = mediator.send(command)

    if not deleted:
        raise NotFoundException(detail="Cafe not found")
