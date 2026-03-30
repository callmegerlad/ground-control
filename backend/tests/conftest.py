import os
import uuid
import pytest
from datetime import date, datetime, timezone

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.main import app
from app.core.database import get_db
from app.core.config import Settings
from app.models.base import Base
from app.models.cafe import Cafe
from app.models.employee import Employee, GenderEnum
from app.models.cafe_employee import CafeEmployee


def get_test_settings() -> Settings:
    """Get settings configured for testing."""
    return Settings(
        DB_HOST=os.environ.get("DB_HOST", "localhost"),
        DB_PORT=int(os.environ.get("DB_PORT", "5432")),
        DB_NAME=os.environ.get("DB_NAME", "groundcontrol"),
        DB_USER=os.environ.get("DB_USER", "user"),
        DB_PASSWORD=os.environ.get("DB_PASSWORD", "password"),
    )


@pytest.fixture(scope="session")
def engine():
    """Create a test database engine."""
    settings = get_test_settings()
    engine = create_engine(settings.DATABASE_URL)

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        pytest.skip(f"Database not available: {e}")

    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(engine) -> Session:  # type: ignore
    """Create a new database session for each test with transaction rollback."""
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    yield session  # type: ignore

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session: Session) -> TestClient:  # type: ignore
    """Create a FastAPI test client with database dependency override."""

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client  # type: ignore

    app.dependency_overrides.clear()


def create_cafe(
    db: Session,
    name: str = "Test Cafe",
    description: str = "A test cafe",
    location: str = "Singapore",
    logo_path: str | None = None,
) -> Cafe:
    """Factory function to create a Cafe."""
    cafe = Cafe(
        id=uuid.uuid4(),
        name=name,
        description=description,
        location=location,
        logo_path=logo_path,
    )
    db.add(cafe)
    db.commit()
    db.refresh(cafe)
    return cafe


def create_employee(
    db: Session,
    employee_id: str | None = None,
    name: str = "Test Employee",
    email_address: str | None = None,
    phone_number: str = "91234567",
    gender: GenderEnum = GenderEnum.male,
) -> Employee:
    """Factory function to create an Employee."""
    if employee_id is None:
        employee_id = f"UI{uuid.uuid4().hex[:7].upper()}"
    if email_address is None:
        email_address = f"{uuid.uuid4().hex[:8]}@test.com"

    employee = Employee(
        id=employee_id,
        name=name,
        email_address=email_address,
        phone_number=phone_number,
        gender=gender,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def assign_employee_to_cafe(
    db: Session,
    employee: Employee,
    cafe: Cafe,
    start_date: date | None = None,
) -> CafeEmployee:
    """Factory function to assign an employee to a cafe."""
    if start_date is None:
        start_date = datetime.now(timezone.utc)

    assignment = CafeEmployee(
        cafe_id=cafe.id,
        employee_id=employee.id,
        start_date=start_date,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
