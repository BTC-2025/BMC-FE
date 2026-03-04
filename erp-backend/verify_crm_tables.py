from sqlalchemy import create_engine, inspect
from app.core.database import DATABASE_URL

def verify_tables():
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    required = ["crm_leads", "crm_deals", "crm_activities"]
    missing = [t for t in required if t not in tables]
    
    if missing:
        print(f"FAILED: Missing tables: {missing}")
        exit(1)
    else:
        print("SUCCESS: All CRM tables exist.")
        # Check columns for Deal (sanity check)
        columns = [c['name'] for c in inspector.get_columns("crm_deals")]
        if "value" in columns and "stage" in columns:
            print("SUCCESS: Deal columns verified.")
        else:
            print("FAILED: Deal columns incorrect.")
            exit(1)

if __name__ == "__main__":
    verify_tables()
