import sqlite3

def check():
    conn = sqlite3.connect('erp.db')
    cursor = conn.cursor()
    
    print("--- finance_journal_items ---")
    cursor.execute("SELECT sql FROM sqlite_master WHERE name='finance_journal_items'")
    row = cursor.fetchone()
    if row:
        print(row[0])
    
    print("\n--- finance_bank_statements ---")
    cursor.execute("SELECT sql FROM sqlite_master WHERE name='finance_bank_statements'")
    row = cursor.fetchone()
    if row:
        print(row[0])
        
    print("\n--- finance_accounts ---")
    cursor.execute("SELECT sql FROM sqlite_master WHERE name='finance_accounts'")
    row = cursor.fetchone()
    if row:
        print(row[0])

    print("\n--- Testing FK Integrity ---")
    cursor.execute("PRAGMA foreign_keys = ON")
    try:
        # Try to insert a journal item for an existing account and entry
        # First ensure they exist for tenant 2
        cursor.execute("SELECT id FROM finance_journal_entries WHERE tenant_id=2 LIMIT 1")
        je = cursor.fetchone()
        cursor.execute("SELECT id FROM finance_accounts WHERE tenant_id=2 LIMIT 1")
        acc = cursor.fetchone()
        
        if je and acc:
            print(f"Testing insert into journal_items with JE={je[0]}, Account={acc[0]}")
            cursor.execute("INSERT INTO finance_journal_items (tenant_id, entry_id, account_id, debit, credit) VALUES (2, ?, ?, 100, 0)", (je[0], acc[0]))
            print("Insert SUCCESS!")
        else:
            print("Cannot test insert: Missing JE or Account for tenant 2")
            
    except Exception as e:
        print(f"Insert FAILED: {e}")
    
    conn.close()

if __name__ == "__main__":
    check()
