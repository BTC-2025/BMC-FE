from sqlalchemy import create_engine, text

db_url = "sqlite:///./erp_v13.db"
engine = create_engine(db_url)

def list_usernames():
    with engine.connect() as conn:
        results = conn.execute(text("SELECT username FROM users")).fetchall()
        print(f"Users in DB: {[r[0] for r in results]}")

if __name__ == "__main__":
    list_usernames()
