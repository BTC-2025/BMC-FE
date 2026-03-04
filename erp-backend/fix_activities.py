from app.core.database import engine
from sqlalchemy import text, inspect

def fix_activities_schema():
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('crm_activities')]
    
    with engine.connect() as conn:
        # Check for missing columns
        if 'type' not in columns:
            print("Adding column 'type' to crm_activities...")
            conn.execute(text("ALTER TABLE crm_activities ADD COLUMN type VARCHAR NOT NULL DEFAULT 'NOTE'"))
        if 'note' not in columns:
            print("Adding column 'note' to crm_activities...")
            conn.execute(text("ALTER TABLE crm_activities ADD COLUMN note TEXT"))
        if 'performed_by' not in columns:
            print("Adding column 'performed_by' to crm_activities...")
            conn.execute(text("ALTER TABLE crm_activities ADD COLUMN performed_by INTEGER"))
        if 'created_at' not in columns:
            print("Adding column 'created_at' to crm_activities...")
            conn.execute(text("ALTER TABLE crm_activities ADD COLUMN created_at DATETIME"))
        
        # Foreign keys
        if 'lead_id' not in columns:
            conn.execute(text("ALTER TABLE crm_activities ADD COLUMN lead_id INTEGER"))
        if 'deal_id' not in columns:
            conn.execute(text("ALTER TABLE crm_activities ADD COLUMN deal_id INTEGER"))
        if 'customer_id' not in columns:
            conn.execute(text("ALTER TABLE crm_activities ADD COLUMN customer_id INTEGER"))
            
        conn.commit()
    print("Activities schema check complete.")

if __name__ == "__main__":
    fix_activities_schema()
