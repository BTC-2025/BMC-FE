import sqlite3

# Connect to the database
conn = sqlite3.connect('erp_v2.db')
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = cursor.fetchall()

print("\n" + "="*60)
print("✅ STEP 8 VERIFICATION - DB SCHEMA")
print("="*60)
print(f"\n📊 Database: erp_v2.db")
print(f"📊 Total Tables: {len(tables)}\n")

# Check for auth tables specifically
required_tables = [
    'users', 'roles', 'permissions', 'user_roles', 'role_permissions',
    'inventory_items', 'inventory_warehouses', 'inventory_stock_movements'
]
print("🔐 REQUIRED TABLES:")
print("-" * 60)

for table in required_tables:
    if any(t[0] == table for t in tables):
        print(f"  ✅ {table}")
    else:
        print(f"  ❌ {table} - MISSING!")

print("\n📋 ALL TABLES IN DATABASE:")
print("-" * 60)
for table in tables:
    print(f"  • {table[0]}")

print("\n" + "="*60)

conn.close()
