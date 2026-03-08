import psycopg2
try:
    conn = psycopg2.connect(
        host="localhost",
        port=5434,
        user="erp_user",
        password="erp_pass",
        dbname="erp"
    )
    print("SUCCESS: Connected to PostgreSQL on port 5434")
    conn.close()
except Exception as e:
    print(f"FAILURE: {e}")
