import sqlite3

db_path = "erp_v13.db"

def migrate():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print(f"Connecting to {db_path}...")
    
    try:
        # 1. Create inventory_categories table
        print("Creating inventory_categories table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS inventory_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT
            )
        """)
        
        # 2. Add category_id column to inventory_items
        print("Adding category_id column to inventory_items...")
        try:
            cursor.execute("ALTER TABLE inventory_items ADD COLUMN category_id INTEGER REFERENCES inventory_categories(id)")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("Column category_id already exists.")
            else:
                raise e
        
        conn.commit()
        print("Migration successful!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
