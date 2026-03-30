import uuid
from datetime import datetime, timezone, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import create_cafe, create_employee, assign_employee_to_cafe


class TestListEmployees:
    def test_list_employees_empty(self, client: TestClient):
        response = client.get("/api/v1/employees")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_employees_returns_all(self, client: TestClient, db_session: Session):
        create_employee(db_session, name="Employee A")
        create_employee(db_session, name="Employee B")

        response = client.get("/api/v1/employees")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        names = {e["name"] for e in data}
        assert names == {"Employee A", "Employee B"}

    def test_list_employees_filter_by_cafe(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session, name="Test Cafe")
        emp_in_cafe = create_employee(db_session, name="In Cafe")
        emp_no_cafe = create_employee(db_session, name="No Cafe")
        assign_employee_to_cafe(db_session, emp_in_cafe, cafe)

        response = client.get(f"/api/v1/employees?cafe_id={cafe.id}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "In Cafe"

    def test_list_employees_sorted_by_days_worked(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session)
        senior = create_employee(db_session, name="Senior")
        junior = create_employee(db_session, name="Junior")

        assign_employee_to_cafe(
            db_session,
            senior,
            cafe,
            start_date=(
                datetime.now(timezone.utc) - timedelta(days=100)),
        )
        assign_employee_to_cafe(
            db_session,
            junior,
            cafe,
            start_date=datetime.now(timezone.utc),
        )

        response = client.get("/api/v1/employees")
        assert response.status_code == 200
        data = response.json()
        assert data[0]["name"] == "Senior"
        assert data[0]["days_worked"] >= 100
        assert data[1]["name"] == "Junior"
        assert data[1]["days_worked"] == 0

    def test_list_employees_shows_cafe_name(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session, name="My Cafe")
        employee = create_employee(db_session, name="My Worker")
        assign_employee_to_cafe(db_session, employee, cafe)

        response = client.get("/api/v1/employees")
        assert response.status_code == 200
        data = response.json()
        assert data[0]["cafe"] == "My Cafe"

    def test_list_employees_without_cafe_shows_null(self, client: TestClient, db_session: Session):
        create_employee(db_session, name="Unassigned Employee")

        response = client.get("/api/v1/employees")
        assert response.status_code == 200
        data = response.json()
        assert data[0]["cafe"] is None
        assert data[0]["days_worked"] == 0


class TestCreateEmployee:
    def test_create_employee_success(self, client: TestClient):
        payload = {
            "id": "UI1234567",
            "name": "John Doe",
            "email_address": "john@example.com",
            "phone_number": "91234567",
            "gender": "male",
        }
        response = client.post("/api/v1/employees", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["id"] == "UI1234567"
        assert data["name"] == "John Doe"
        assert data["cafe"] is None
        assert data["days_worked"] == 0

    def test_create_employee_with_cafe_assignment(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session, name="Assigned Cafe")

        payload = {
            "id": "UI1234567",
            "name": "Jane Doe",
            "email_address": "jane@example.com",
            "phone_number": "81234567",
            "gender": "female",
            "cafe_id": str(cafe.id),
            "start_date": datetime.now(timezone.utc).isoformat(),
        }
        response = client.post("/api/v1/employees", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["cafe"] == "Assigned Cafe"

    def test_create_employee_invalid_id_format(self, client: TestClient):
        payload = {
            "id": "INVALID",
            "name": "Bad ID",
            "email_address": "bad@example.com",
            "phone_number": "91234567",
            "gender": "male",
        }
        response = client.post("/api/v1/employees", json=payload)
        assert response.status_code == 422

    def test_create_employee_invalid_phone(self, client: TestClient):
        payload = {
            "id": "UI1234567",
            "name": "Bad Phone",
            "email_address": "phone@example.com",
            "phone_number": "71234567",
            "gender": "male",
        }
        response = client.post("/api/v1/employees", json=payload)
        assert response.status_code == 422

    def test_create_employee_invalid_email(self, client: TestClient):
        payload = {
            "id": "UI1234567",
            "name": "Bad Email",
            "email_address": "not-an-email",
            "phone_number": "91234567",
            "gender": "male",
        }
        response = client.post("/api/v1/employees", json=payload)
        assert response.status_code == 422

    def test_create_employee_nonexistent_cafe(self, client: TestClient):
        payload = {
            "id": "UI1234567",
            "name": "Ghost Cafe",
            "email_address": "ghost@example.com",
            "phone_number": "91234567",
            "gender": "male",
            "cafe_id": str(uuid.uuid4()),
        }
        response = client.post("/api/v1/employees", json=payload)
        assert response.status_code == 404


class TestUpdateEmployee:
    def test_update_employee_success(self, client: TestClient, db_session: Session):
        employee = create_employee(db_session, name="Original Name")

        payload = {"name": "Updated Name"}
        response = client.put(f"/api/v1/employees/{employee.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Name"

    def test_update_employee_change_cafe(self, client: TestClient, db_session: Session):
        cafe1 = create_cafe(db_session, name="Cafe 1")
        cafe2 = create_cafe(db_session, name="Cafe 2")
        employee = create_employee(db_session)
        assign_employee_to_cafe(db_session, employee, cafe1)

        payload = {"cafe_id": str(cafe2.id)}
        response = client.put(f"/api/v1/employees/{employee.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["cafe"] == "Cafe 2"

    def test_update_employee_assign_to_cafe(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session, name="New Cafe")
        employee = create_employee(db_session)

        payload = {
            "cafe_id": str(cafe.id),
            "start_date": datetime.now(timezone.utc).isoformat(),
        }
        response = client.put(f"/api/v1/employees/{employee.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["cafe"] == "New Cafe"

    def test_update_employee_remove_from_cafe(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session)
        employee = create_employee(db_session)
        assign_employee_to_cafe(db_session, employee, cafe)

        payload = {"cafe_id": None}
        response = client.put(f"/api/v1/employees/{employee.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["cafe"] is None

    def test_update_employee_not_found(self, client: TestClient):
        payload = {"name": "Updated"}
        response = client.put("/api/v1/employees/UI9999999", json=payload)
        assert response.status_code == 404

    def test_update_employee_empty_payload(self, client: TestClient, db_session: Session):
        employee = create_employee(db_session)

        response = client.put(f"/api/v1/employees/{employee.id}", json={})
        assert response.status_code == 400


class TestDeleteEmployee:
    def test_delete_employee_success(self, client: TestClient, db_session: Session):
        employee = create_employee(db_session)

        response = client.delete(f"/api/v1/employees/{employee.id}")
        assert response.status_code == 204

        get_response = client.get("/api/v1/employees")
        assert len(get_response.json()) == 0

    def test_delete_employee_not_found(self, client: TestClient):
        response = client.delete("/api/v1/employees/UI9999999")
        assert response.status_code == 404

    def test_delete_employee_removes_cafe_assignment(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session)
        employee = create_employee(db_session)
        assign_employee_to_cafe(db_session, employee, cafe)

        response = client.delete(f"/api/v1/employees/{employee.id}")
        assert response.status_code == 204

        employees_response = client.get(f"/api/v1/employees?cafe_id={cafe.id}")
        assert employees_response.json() == []
