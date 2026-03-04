from app.core.database import engine
from sqlalchemy import text

print("Dropping bills tables...")
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS finance_bill_lines"))
    conn.execute(text("DROP TABLE IF EXISTS finance_bills"))
    conn.commit()
print("Tables dropped successfully.")
