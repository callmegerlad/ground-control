import sys
import uuid
from pathlib import Path
from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine
from app.models import Cafe, Employee, CafeEmployee
from app.models.employee import GenderEnum
from app.models.base import Base


sys.path.insert(0, str(Path(__file__).parent.parent))


def create_cafes() -> list[dict]:
    """Create cafe data."""
    return [
        {
            "id": uuid.uuid4(),
            "name": "Joji's Diner",
            "description": "A cozy neighborhood diner with vintage vibes, serving artisanal coffee and homemade comfort food. Known for their signature espresso blends and Sunday brunches.",
            "location": "Tiong Bahru, Singapore",
            "logo_path": ""
        },
        {
            "id": uuid.uuid4(),
            "name": "Tiong Bahru Bakery",
            "description": "Award-winning French-inspired bakery featuring fresh pastries and artisan bread. A staple in the Tiong Bahru area with a minimalist aesthetic and excellent specialty coffee.",
            "location": "Tiong Bahru, Singapore",
            "logo_path": ""
        },
        {
            "id": uuid.uuid4(),
            "name": "Hvala",
            "description": "Hvala is a popular Japanese-inspired teahouse in Singapore celebrated for its minimalist, zen-like aesthetic and premium ceremonial-grade matcha.",
            "location": "North Bridge Rd, Singapore",
            "logo_path": ""
        },
        {
            "id": uuid.uuid4(),
            "name": "Symmetry Café",
            "description": "Contemporary café design with Nordic influences, featuring specialty coffee, light bites, and a curated selection of merchandise. Perfect for remote work.",
            "location": "Everton Park, Singapore",
            "logo_path": ""
        },
        {
            "id": uuid.uuid4(),
            "name": "The Pinnacle@Duxton Café",
            "description": "Modern urban café located in downtown Singapore with panoramic city views. Serves premium coffee, all-day brunch, and innovative cocktails.",
            "location": "Duxton Road, Singapore",
            "logo_path": ""
        },
        {
            "id": uuid.uuid4(),
            "name": "Chye Seng Huat Hardware",
            "description": "Trendy café disguised as a vintage hardware store. Famous for exceptional single-origin coffee and cakes in a uniquely Instagram-worthy setting.",
            "location": "Bukit Merah, Singapore",
            "logo_path": ""
        },
        {
            "id": uuid.uuid4(),
            "name": "Café de la Paix",
            "description": "French-styled café offering traditional pastries and artisan coffee. Elegant ambiance perfect for business meetings or casual catch-ups.",
            "location": "Tanglin, Singapore",
            "logo_path": ""
        },
        {
            "id": uuid.uuid4(),
            "name": "Workshop Coffee",
            "description": "Industrial-style café with a serious focus on coffee craftsmanship. Offers both espresso drinks and pour-overs in a relaxed warehouse setting.",
            "location": "Kampong Bugis, Singapore",
            "logo_path": ""
        }
    ]


def create_employees() -> list[dict]:
    """Create employee data."""
    return [
        {
            "id": "UI12345AB",
            "name": "Sarah Chen",
            "email_address": "sarah.chen@groundcontrol.sg",
            "phone_number": "87654321",
            "gender": GenderEnum.female
        },
        {
            "id": "UI23456BC",
            "name": "Marcus Lee",
            "email_address": "marcus.lee@groundcontrol.sg",
            "phone_number": "91234567",
            "gender": GenderEnum.male
        },
        {
            "id": "UI34567CD",
            "name": "Elena Rossi",
            "email_address": "elena.rossi@groundcontrol.sg",
            "phone_number": "89876543",
            "gender": GenderEnum.female
        },
        {
            "id": "UI45678DE",
            "name": "David Tan",
            "email_address": "david.tan@groundcontrol.sg",
            "phone_number": "92345678",
            "gender": GenderEnum.male
        },
        {
            "id": "UI56789EF",
            "name": "Sophie Wong",
            "email_address": "sophie.wong@groundcontrol.sg",
            "phone_number": "88123456",
            "gender": GenderEnum.female
        },
        {
            "id": "UI67890FG",
            "name": "James Kumar",
            "email_address": "james.kumar@groundcontrol.sg",
            "phone_number": "93456789",
            "gender": GenderEnum.male
        },
        {
            "id": "UI78901GH",
            "name": "Isabella Martinez",
            "email_address": "isabella.m@groundcontrol.sg",
            "phone_number": "87654310",
            "gender": GenderEnum.female
        },
        {
            "id": "UI89012HI",
            "name": "Ryan Goh",
            "email_address": "ryan.goh@groundcontrol.sg",
            "phone_number": "94567890",
            "gender": GenderEnum.male
        },
        {
            "id": "UI90123IJ",
            "name": "Fiona Lim",
            "email_address": "fiona.lim@groundcontrol.sg",
            "phone_number": "88765432",
            "gender": GenderEnum.female
        },
        {
            "id": "UI01234JK",
            "name": "Christopher Tan",
            "email_address": "chris.tan@groundcontrol.sg",
            "phone_number": "95678901",
            "gender": GenderEnum.male
        },
        {
            "id": "UI11234KL",
            "name": "Amelia Ng",
            "email_address": "amelia.ng@groundcontrol.sg",
            "phone_number": "87777777",
            "gender": GenderEnum.female
        },
        {
            "id": "UI22234LM",
            "name": "Adrian Loh",
            "email_address": "adrian.loh@groundcontrol.sg",
            "phone_number": "96789012",
            "gender": GenderEnum.male
        }
    ]


def create_cafe_employee_assignments(
    cafes: list[Cafe],
    employees: list[Employee]
) -> list[dict]:
    """Create cafe-employee assignments with realistic start dates."""
    assignments = []
    base_date = date.today()

    # Joji's Diner
    assignments.extend([
        {"cafe": cafes[0], "employee": employees[0], "start_date": base_date},
        {"cafe": cafes[0], "employee": employees[1], "start_date": base_date - timedelta(days=30)},
        {"cafe": cafes[0], "employee": employees[4], "start_date": base_date - timedelta(days=60)},
    ])

    # Tiong Bahru Bakery
    assignments.extend([
        {"cafe": cafes[1], "employee": employees[2], "start_date": base_date},
        {"cafe": cafes[1], "employee": employees[3], "start_date": base_date - timedelta(days=30)},
        {"cafe": cafes[1], "employee": employees[6], "start_date": base_date - timedelta(days=45)},
    ])

    # Hvala
    assignments.extend([
        {"cafe": cafes[2], "employee": employees[5], "start_date": base_date},
        {"cafe": cafes[2], "employee": employees[7], "start_date": base_date - timedelta(days=15)},
        {"cafe": cafes[2], "employee": employees[9], "start_date": base_date - timedelta(days=60)},
        {"cafe": cafes[2], "employee": employees[4], "start_date": base_date - timedelta(days=35)},
    ])

    # Symmetry Café
    assignments.extend([
        {"cafe": cafes[3], "employee": employees[8], "start_date": base_date - timedelta(days=10)},
        {"cafe": cafes[3], "employee": employees[10], "start_date": base_date - timedelta(days=20)},
    ])

    # The Pinnacle@Duxton Café
    assignments.extend([
        {"cafe": cafes[4], "employee": employees[1], "start_date": base_date - timedelta(days=90)},
        {"cafe": cafes[4], "employee": employees[9], "start_date": base_date - timedelta(days=100)},
    ])

    # Chye Seng Huat Hardware
    assignments.extend([
        {"cafe": cafes[5], "employee": employees[3], "start_date": base_date - timedelta(days=50)},
        {"cafe": cafes[5], "employee": employees[5], "start_date": base_date - timedelta(days=70)},
    ])

    # Café de la Paix
    assignments.extend([
        {"cafe": cafes[6], "employee": employees[2], "start_date": base_date - timedelta(days=40)},
        {"cafe": cafes[6], "employee": employees[11], "start_date": base_date - timedelta(days=55)},
    ])

    # Workshop Coffee
    assignments.extend([
        {"cafe": cafes[7], "employee": employees[7], "start_date": base_date - timedelta(days=80)},
    ])

    return assignments


def seed_database():
    """Seed the database with initial data."""
    # Create tables
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # Check if data already exists
        existing_cafes = db.query(Cafe).count()
        if existing_cafes > 0:
            print("Database already seeded. Skipping...")
            return

        # Create cafes
        cafe_data = create_cafes()
        cafes = []
        for cafe_info in cafe_data:
            cafe = Cafe(**cafe_info)
            db.add(cafe)
            cafes.append(cafe)

        db.commit()
        print(f"✓ Created {len(cafes)} cafes")

        # Create employees
        employee_data = create_employees()
        employees = []
        for emp_info in employee_data:
            employee = Employee(**emp_info)
            db.add(employee)
            employees.append(employee)

        db.commit()
        print(f"✓ Created {len(employees)} employees")

        # Create cafe-employee assignments
        assignments = create_cafe_employee_assignments(cafes, employees)
        for assignment in assignments:
            cafe_employee = CafeEmployee(
                cafe_id=assignment["cafe"].id,
                employee_id=assignment["employee"].id,
                start_date=assignment["start_date"]
            )
            db.add(cafe_employee)

        db.commit()
        print(f"Successfully created {len(assignments)} cafe-employee assignments")
        print("\n🌱 Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
