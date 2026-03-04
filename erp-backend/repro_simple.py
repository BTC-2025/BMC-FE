from app.core.database import SessionLocal
import app.crm.models as models
import app.crm.service as service
import traceback

def test():
    db = SessionLocal()
    try:
        print("Starting test...")
        # Check if we can query Lead
        lead = db.query(models.Lead).first()
        print(f"Found lead: {lead.id if lead else 'None'}")
        
        # Call log_activity
        res = service.log_activity(
            db,
            lead_id=lead.id if lead else 1,
            activity_type='CALL',
            note='repro',
            performed_by=1,
            tenant_id=1
        )
        print(f"SUCCESS! Activity ID: {res.id}")
    except Exception:
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test()
