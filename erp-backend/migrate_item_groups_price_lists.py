"""
Migration script to add Item Groups and Price Lists tables and columns
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    print("🔧 Starting database migration...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Create Item Groups table
        print("Creating inventory_item_groups table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS inventory_item_groups (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER NOT NULL REFERENCES tenants(id),
                name VARCHAR NOT NULL,
                description VARCHAR,
                is_active BOOLEAN DEFAULT TRUE,
                CONSTRAINT fk_item_groups_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            )
        """))
        conn.commit()
        
        # Create Price Lists table
        print("Creating inventory_price_lists table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS inventory_price_lists (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER NOT NULL REFERENCES tenants(id),
                name VARCHAR NOT NULL,
                type VARCHAR NOT NULL,
                currency VARCHAR DEFAULT 'USD',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_price_lists_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            )
        """))
        conn.commit()
        
        # Create Price List Items table
        print("Creating inventory_price_list_items table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS inventory_price_list_items (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER NOT NULL REFERENCES tenants(id),
                price_list_id INTEGER NOT NULL REFERENCES inventory_price_lists(id),
                item_id INTEGER NOT NULL REFERENCES inventory_items(id),
                price NUMERIC(12, 2) NOT NULL,
                CONSTRAINT fk_price_list_items_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
                CONSTRAINT fk_price_list_items_list FOREIGN KEY (price_list_id) REFERENCES inventory_price_lists(id),
                CONSTRAINT fk_price_list_items_item FOREIGN KEY (item_id) REFERENCES inventory_items(id)
            )
        """))
        conn.commit()
        
        # Add item_group_id column to inventory_items if it doesn't exist
        print("Adding item_group_id column to inventory_items...")
        try:
            conn.execute(text("""
                ALTER TABLE inventory_items 
                ADD COLUMN IF NOT EXISTS item_group_id INTEGER REFERENCES inventory_item_groups(id)
            """))
            conn.commit()
            print("✅ Column added successfully")
        except Exception as e:
            print(f"Column might already exist: {e}")
            conn.rollback()
        
        print("✅ Migration completed successfully!")

if __name__ == "__main__":
    migrate()
