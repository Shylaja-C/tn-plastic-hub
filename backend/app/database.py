"""
Database engine, session factory, and declarative base.
All models import Base from here.
"""

from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.config import get_settings

settings = get_settings()

# Use NullPool only in test/CI environments to avoid connection leaks;
# default is QueuePool which is fine for production.
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,          # SQL logging in dev mode
    pool_pre_ping=True,            # verify connection health before use
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""
    pass


# ── Dependency ────────────────────────────────────────────────────────────────

def get_db():
    """
    FastAPI dependency that yields a database session and
    guarantees the session is closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Health check ─────────────────────────────────────────────────────────────

def check_db_connection() -> bool:
    """Return True if the database is reachable."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
