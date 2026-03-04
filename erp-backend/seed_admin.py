from app.core.database import SessionLocal, engine, Base
from app.auth import models
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if admin exists
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin:
        hashed_password = get_password_hash("admin123")
        admin = models.User(
            username="admin",
            email="admin@btc-enterprise.com",
            full_name="Master Admin",
            hashed_password=hashed_password,
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print("✅ Master Admin user created: admin / admin123")
    else:
        print("ℹ️ Admin user already exists.")
    
    db.close()

if __name__ == "__main__":
    init_db()
