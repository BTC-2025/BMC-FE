import sqlite3
import pandas as pd
import os

db_path = os.path.join(os.getcwd(), 'erp.db')

def view_items():
    try:
        conn = sqlite3.connect(db_path)
        # Assuming id, name, sku are always present
        query = "SELECT * FROM inventory_items LIMIT 10;"
        df = pd.read_sql_query(query, conn)
        print("\n=== [INVENTORY ITEMS] ===")
        # Drop columns with all NaN or just show first few
        cols = ['id', 'sku', 'name', 'unit']
        existing = [c for c in cols if c in df.columns]
        print(df[existing].to_string(index=False))
        conn.close()
    except Exception as e:
        print(f"Error reading items: {e}")

def view_movements():
    try:
        conn = sqlite3.connect(db_path)
        query = "SELECT * FROM inventory_stock_movements LIMIT 10;"
        df = pd.read_sql_query(query, conn)
        print("\n=== [STOCK MOVEMENTS (LATEST)] ===")
        cols = ['id', 'item_id', 'warehouse_id', 'quantity', 'movement_type', 'created_at']
        existing = [c for c in cols if c in df.columns]
        print(df[existing].to_string(index=False))
        conn.close()
    except Exception as e:
        print(f"Error reading movements: {e}")

if __name__ == "__main__":
    view_items()
    view_movements()
