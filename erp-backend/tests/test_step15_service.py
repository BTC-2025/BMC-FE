import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import DATABASE_URL
from app.crm import service
from app.crm.models import Lead, Deal
from fastapi import HTTPException

# Setup DB
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_service_logic():
    print("STEP 15 INTERNAL VERIFICATION")
    print("="*60)
    
    db = SessionLocal()
    try:
        # cleanup
        db.query(Deal).delete()
        db.query(Lead).delete()
        db.commit()

        # 1. Create Lead (Direct DB)
        lead = Lead(name="Test Co", status="NEW")
        db.add(lead)
        db.commit()
        db.refresh(lead)
        print(f"[SETUP] Created Lead {lead.id} (NEW)")
        
        # 2. Test Allowed: NEW -> CONTACTED
        print("\n[TEST] NEW -> CONTACTED")
        service.update_lead_status(db, lead_id=lead.id, new_status="CONTACTED", performed_by=1)
        print("  [OK] Success")
        
        # 3. Test Blocked: CONTACTED -> CONVERTED (Skip QUALIFIED)
        print("\n[TEST] CONTACTED -> CONVERTED (Should Fail)")
        try:
            service.update_lead_status(db, lead_id=lead.id, new_status="CONVERTED", performed_by=1)
            print("  [FAIL] Transition was allowed!")
            sys.exit(1)
        except HTTPException as e:
            print(f"  [PASS] Blocked: {e.detail}")

        # 4. Test Allowed: CONTACTED -> QUALIFIED
        print("\n[TEST] CONTACTED -> QUALIFIED")
        service.update_lead_status(db, lead_id=lead.id, new_status="QUALIFIED", performed_by=1)
        print("  [OK] Success")
        
        # 5. Test Conversion (Atomic)
        print("\n[TEST] QUALIFIED -> CONVERTED (Atomic Deal)")
        deal = service.convert_lead_to_deal(db, lead_id=lead.id, title="Big Project", value=50000, performed_by=1)
        print(f"  [OK] Deal Created: {deal.title}")
        
        # Verify Lead Status
        db.refresh(lead)
        if lead.status == "CONVERTED":
            print("  [OK] Lead Status is CONVERTED")
        else:
            print(f"  [FAIL] Lead Status is {lead.status}")
            sys.exit(1)
            
        # 6. Test Deal Stage: DISCOVERY -> PROPOSAL
        print("\n[TEST] Deal DISCOVERY -> PROPOSAL")
        service.update_deal_stage(db, deal_id=deal.id, new_stage="PROPOSAL", performed_by=1)
        print("  [OK] Success")
        
        # 7. Test Deal Jump: PROPOSAL -> WON (Skip NEGOTIATION)
        print("\n[TEST] PROPOSAL -> WON (Should Fail)")
        try:
            service.update_deal_stage(db, deal_id=deal.id, new_stage="WON", performed_by=1)
            print("  [FAIL] Jump was allowed!")
            sys.exit(1)
        except HTTPException as e:
            print(f"  [PASS] Blocked: {e.detail}")
            
        print("\n" + "="*60)
        print("ALL SERVICE RULES VERIFIED")
        
    except Exception as e:
        print(f"\n[CRITICAL FAIL] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    test_service_logic()
