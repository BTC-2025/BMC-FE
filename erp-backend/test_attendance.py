from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.hrm.models import Employee, Attendance
from app.hrm.service import process_attendance
from app.core.tenant.models import Tenant

def test_attendance_flow():
    db = SessionLocal()
    try:
        tenant = db.query(Tenant).first()
        emp = db.query(Employee).filter(Employee.tenant_id == tenant.id).first()
        
        if not emp:
            print("No employee found to test attendance.")
            return

        print(f"Testing attendance for {emp.name}...")
        
        # Test Punch In
        try:
            res_in = process_attendance(db, tenant_id=tenant.id, employee_id=emp.id, action="IN")
            print(f"Punch In: {res_in['message']}")
        except Exception as e:
            print(f"Punch In Error (maybe already punched?): {e}")

        # Test Punch Out
        res_out = process_attendance(db, tenant_id=tenant.id, employee_id=emp.id, action="OUT")
        print(f"Punch Out: {res_out['message']}")

        # Verify record
        att = db.query(Attendance).filter(Attendance.employee_id == emp.id).order_by(Attendance.punch_in.desc()).first()
        print(f"Verification: ID={att.id}, IN={att.punch_in}, OUT={att.punch_out}, Status={att.status}")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_attendance_flow()
