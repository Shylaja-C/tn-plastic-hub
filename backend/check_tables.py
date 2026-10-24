import sys
sys.path.insert(0, '.')
from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    rows = conn.execute(
        text("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
    ).fetchall()
    tables = [r[0] for r in rows]
    print(f"Tables in Render DB ({len(tables)}):")
    for t in tables:
        print(f"  [OK] {t}")
