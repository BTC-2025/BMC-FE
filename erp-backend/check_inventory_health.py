from sqlalchemy import create_engine, inspect, text
from app.core.config import settings
import sys

def check_db():
    print(f"Connecting to: {settings.DATABASE_URL}")
    try:
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            # Users
            print("\n--- USERS ---")
            users = conn.execute(text("SELECT id, username, is_admin, tenant_id FROM users")).fetchall()
            for u in users:
                print(f"ID: {u.id}, Username: {u.username}, IsAdmin: {u.is_admin}, TenantID: {u.tenant_id}")
            
            # Categories
            print("\n--- CATEGORIES ---")
            cats = conn.execute(text("SELECT id, name, tenant_id FROM inventory_categories")).fetchall()
            for c in cats:
                print(f"ID: {c.id}, Name: {c.name}, TenantID: {c.tenant_id}")

            # Items
            print("\n--- ITEMS ---")
            items = conn.execute(text("SELECT id, name, sku, category_id FROM inventory_items")).fetchall()
            for i in items:
                print(f"ID: {i.id}, Name: {i.name}, SKU: {i.sku}, CategoryID: {i.category_id}")
                
            # Permissions
            print("\n--- PERMISSIONS ---")
            perms = conn.execute(text("SELECT id, code FROM permissions")).fetchall()
            print(f"Total Permissions: {len(perms)}")
            if len(perms) < 10:
                for p in perms:
                    print(f" - {p.code}")

    except Exception as e:
        print(f"CRITICAL DB ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_db()
