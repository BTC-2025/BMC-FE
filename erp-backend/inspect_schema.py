import sqlite3
import os

db_path = os.path.join(os.getcwd(), 'erp.db')

def inspect_table(table_name):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        print(f"\n--- Schema: {table_name} ---")
        for col in columns:
            print(col)
        conn.close()
    except Exception as e:
        print(f"Error inspecting {table_name}: {e}")

if __name__ == "__main__":
    inspect_table("inventory_stock_movements")
