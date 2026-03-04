"""Check table schemas"""
import sys
sys.path.insert(0, '.')
from sqlalchemy import text
from app.core.database import SessionLocal

db = SessionLocal()

tables = db.execute(text("SELECT name, sql FROM sqlite_master WHERE type='table' AND name LIKE 'finance_%'")).fetchall()
for t in tables:
    print(f"\n=== {t[0]} ===")
    print(t[1])

db.close()
