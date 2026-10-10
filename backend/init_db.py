"""
Database initialization script.
Run this ONCE to create all tables (or use Alembic for full migration support).

Usage:
    cd backend
    python init_db.py
"""

import sys
import os

# Make app importable
sys.path.insert(0, os.path.dirname(__file__))

from app.database import Base, engine, check_db_connection
from app.config import get_settings

# Import all models so they are registered on Base.metadata
import app.models  # noqa: F401


def main():
    settings = get_settings()
    print(f"TNPlasticHub Database Initializer")
    print(f"   Target: {settings.DATABASE_URL.split('@')[-1]}")  # hide credentials

    if not check_db_connection():
        print("Cannot reach the database. Check your DATABASE_URL in .env")
        sys.exit(1)

    print("Database connection OK")
    print("Creating tables...")

    Base.metadata.create_all(bind=engine)

    tables = list(Base.metadata.tables.keys())
    print(f"{len(tables)} tables created/verified:")
    for t in sorted(tables):
        print(f"   - {t}")

    print("\nDatabase initialization complete.")
    print("   Next steps:")
    print("   1. uvicorn app.main:app --reload  (start the API)")
    print("   2. Visit http://127.0.0.1:8000/docs  (Swagger UI)")


if __name__ == "__main__":
    main()
