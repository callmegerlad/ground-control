import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.core.database import SessionLocal, engine
from app.models.base import Base
from seeds.seed_database import seed_database


def clear_database():
    """Clear all data from the database."""
    db = SessionLocal()
    try:
        Base.metadata.drop_all(bind=engine)
        print("Database cleared successfully!")
    except Exception as e:
        print(f"Error clearing database: {e}")
        raise
    finally:
        db.close()


def reset_database():
    """Clear and re-seed the database."""
    print("Resetting database...")
    clear_database()
    print("Re-seeding database...")
    seed_database()


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python manage_db.py [seed|clear|reset]")
        print()
        print("Commands:")
        print("  seed   - Seed the database with initial data (if empty)")
        print("  clear  - Clear all data from the database")
        print("  reset  - Clear and re-seed the database")
        return

    command = sys.argv[1].lower()

    if command == "seed":
        seed_database()
    elif command == "clear":
        confirm = input("Are you sure you want to clear the database? (y/N): ")
        if confirm.lower() == "y":
            clear_database()
        else:
            print("Cancelled.")
    elif command == "reset":
        confirm = input("Are you sure you want to reset the database? (y/N): ")
        if confirm.lower() == "y":
            reset_database()
        else:
            print("Cancelled.")
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
