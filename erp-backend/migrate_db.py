from app.core.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        print("Checking for missing columns...")
        # Add 'role' column if it doesn't exist
        try:
            conn.execute(text("ALTER TABLE hrm_employees ADD COLUMN role VARCHAR;"))
            conn.commit()
            print("Added 'role' column to hrm_employees.")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("'role' column already exists.")
            else:
                print(f"Error adding 'role': {e}")
        
        # Double check basic_salary or other new columns if any
        # department_id was added earlier, but let's be sure
        try:
            conn.execute(text("ALTER TABLE hrm_employees ADD COLUMN department_id INTEGER REFERENCES hrm_departments(id);"))
            conn.commit()
            print("Added 'department_id' column to hrm_employees.")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("'department_id' column already exists.")
            else:
                print(f"Error adding 'department_id': {e}")

if __name__ == "__main__":
    migrate()
