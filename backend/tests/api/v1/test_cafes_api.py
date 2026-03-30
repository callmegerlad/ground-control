import uuid

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import create_cafe, create_employee, assign_employee_to_cafe


class TestListCafes:
    def test_list_cafes_empty(self, client: TestClient):
        response = client.get("/api/v1/cafes")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_cafes_returns_all(self, client: TestClient, db_session: Session):
        create_cafe(db_session, name="Cafe A", location="Singapore")
        create_cafe(db_session, name="Cafe B", location="Kuala Lumpur")

        response = client.get("/api/v1/cafes")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        names = {c["name"] for c in data}
        assert names == {"Cafe A", "Cafe B"}

    def test_list_cafes_filter_by_location(self, client: TestClient, db_session: Session):
        create_cafe(db_session, name="Singapore Cafe", location="Singapore")
        create_cafe(db_session, name="KL Cafe", location="Kuala Lumpur")

        response = client.get("/api/v1/cafes?location=Singapore")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Singapore Cafe"

    def test_list_cafes_invalid_location_returns_empty(self, client: TestClient, db_session: Session):
        create_cafe(db_session, name="Singapore Cafe", location="Singapore")

        response = client.get("/api/v1/cafes?location=SomeInvalidLocation")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_cafes_sorted_by_employee_count(self, client: TestClient, db_session: Session):
        cafe_few = create_cafe(
            db_session, name="Cafe with Few Employees", location="Singapore")
        cafe_many = create_cafe(
            db_session, name="Cafe with Many Employees", location="Singapore")

        emp1 = create_employee(db_session, name="Employee 1")
        emp2 = create_employee(db_session, name="Employee 2")
        emp3 = create_employee(db_session, name="Employee 3")

        assign_employee_to_cafe(db_session, emp1, cafe_many)
        assign_employee_to_cafe(db_session, emp2, cafe_many)
        assign_employee_to_cafe(db_session, emp3, cafe_few)

        response = client.get("/api/v1/cafes")
        assert response.status_code == 200
        data = response.json()
        assert data[0]["name"] == "Cafe with Many Employees"
        assert data[1]["name"] == "Cafe with Few Employees"


class TestCreateCafe:
    def test_create_cafe_success(self, client: TestClient):
        payload = {
            "name": "New Cafe",
            "description": "A brand new cafe",
            "location": "Singapore",
        }
        response = client.post("/api/v1/cafes", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Cafe"
        assert data["description"] == "A brand new cafe"
        assert data["location"] == "Singapore"
        assert "id" in data
        assert data["logo_path"] is None

    def test_create_cafe_with_logo(self, client: TestClient):
        payload = {
            "name": "Logo Cafe",
            "description": "Cafe with logo",
            "location": "Singapore",
            "logo_path": "/images/logo.png",
        }
        response = client.post("/api/v1/cafes", json=payload)
        assert response.status_code == 201
        assert response.json()["logo_path"] == "/images/logo.png"

    def test_create_cafe_missing_required_fields(self, client: TestClient):
        payload = {
            "name": "Incomplete Cafe",
        }
        response = client.post("/api/v1/cafes", json=payload)
        assert response.status_code == 422


class TestUpdateCafe:
    def test_update_cafe_success(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session, name="OG Cafe Name")

        payload = {"name": "Updated Cafe Name"}
        response = client.put(f"/api/v1/cafes/{cafe.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Cafe Name"

    def test_update_cafe_multiple_fields(self, client: TestClient, db_session: Session):
        cafe = create_cafe(
            db_session, name="OG Cafe Name", description="OG description")

        payload = {
            "name": "New Cafe Name",
            "description": "New description"
        }
        response = client.put(f"/api/v1/cafes/{cafe.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "New Cafe Name"
        assert data["description"] == "New description"

    def test_update_cafe_not_found(self, client: TestClient):
        fake_cafe_id = uuid.uuid4()
        payload = {"name": "Updated Cafe Name"}
        response = client.put(f"/api/v1/cafes/{fake_cafe_id}", json=payload)
        assert response.status_code == 404

    def test_update_cafe_empty_payload(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session)

        response = client.put(f"/api/v1/cafes/{cafe.id}", json={})
        assert response.status_code == 400


class TestDeleteCafe:
    def test_delete_cafe_success(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session)

        response = client.delete(f"/api/v1/cafes/{cafe.id}")
        assert response.status_code == 204

        get_response = client.get("/api/v1/cafes")
        assert len(get_response.json()) == 0

    def test_delete_cafe_not_found(self, client: TestClient):
        fake_cafe_id = uuid.uuid4()
        response = client.delete(f"/api/v1/cafes/{fake_cafe_id}")
        assert response.status_code == 404

    def test_delete_cafe_cascades_to_employees(self, client: TestClient, db_session: Session):
        cafe = create_cafe(db_session)
        employee = create_employee(db_session)
        assign_employee_to_cafe(db_session, employee, cafe)

        response = client.delete(f"/api/v1/cafes/{cafe.id}")
        assert response.status_code == 204

        employees_response = client.get(f"/api/v1/employees?cafe_id={cafe.id}")
        assert employees_response.json() == []
