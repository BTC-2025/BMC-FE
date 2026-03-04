from app.core.database import SessionLocal
from app.crm.service import log_activity
from app.crm.models import Lead, Activity, Deal, Customer, Contact
from app.auth.models import User
import sys

def test_log_activity_failure():
    db = SessionLocal()
    try:
        # Get a sample lead
        lead = db.query(Lead).first()
        if not lead:
            print("No lead found to test with.")
            # Create a dummy lead
            from app.crm.models import Lead
            lead = Lead(name="Test Lead", company="Test Co", tenant_id=1)
            db.add(lead)
            db.commit()
            db.refresh(lead)
            print(f"Created dummy lead with ID: {lead.id}")
            
        # Get a sample user
        from app.auth.models import User
        user = db.query(User).first()
        if not user:
            print("No user found. Creating dummy user...")
            user = User(username="testuser", email="test@test.com", password_hash="...", role="admin")
            db.add(user)
            db.commit()
            db.refresh(user)

        print(f"Testing log_activity for Lead ID: {lead.id}, User ID: {user.id}")
        
        # This is what routes.py calls
        activity = log_activity(
            db,
            lead_id=lead.id,
            activity_type="CALL",
            note="Test note",
            performed_by=user.id,
            tenant_id=lead.tenant_id
        )
        print(f"Success! Activity logged with ID: {activity.id}")
        
    except Exception as e:
        print(f"FAILURE CAUGHT: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_log_activity_failure()
