"""
Migration: Add new columns to hrm_appraisals table.
Safe to run multiple times - skips columns that already exist.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "erp.db")

NEW_COLUMNS = [
    ("review_period",       "TEXT"),
    ("review_type",         "TEXT DEFAULT 'MANAGER'"),
    ("communication_score", "REAL"),
    ("technical_score",     "REAL"),
    ("teamwork_score",      "REAL"),
    ("leadership_score",    "REAL"),
    ("goals_achieved",      "INTEGER"),
]

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Check existing columns
    cur.execute("PRAGMA table_info(hrm_appraisals)")
    existing = {row[1] for row in cur.fetchall()}
    print("Existing columns:", existing)

    for col_name, col_type in NEW_COLUMNS:
        if col_name not in existing:
            sql = f"ALTER TABLE hrm_appraisals ADD COLUMN {col_name} {col_type}"
            cur.execute(sql)
            print(f"  ✅ Added column: {col_name}")
        else:
            print(f"  ⏭  Already exists: {col_name}")

    # Also ensure feedback uses TEXT (not VARCHAR limit)
    conn.commit()
    conn.close()
    print("\nMigration complete!")

if __name__ == "__main__":
    migrate()
