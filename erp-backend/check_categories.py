from sqlalchemy import create_engine, inspect
from app.core.config import settings

def check_db():
    print(f"Connecting to: {settings.DATABASE_URL}")
    engine = create_engine(settings.DATABASE_URL)
    inspector = inspect(engine)
    
    tables = inspector.get_table_names()
    print(f"Tables found: {tables}")
    
    if "inventory_categories" in tables:
        with engine.connect() as conn:
            from sqlalchemy import text
            result = conn.execute(text("SELECT COUNT(*) FROM inventory_categories")).scalar()
            print(f"Number of categories: {result}")
    else:
        print("Table 'inventory_categories' DOES NOT EXIST!")

if __name__ == "__main__":
    check_db()
