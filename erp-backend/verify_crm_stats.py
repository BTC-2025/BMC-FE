import json
from app.core.database import SessionLocal
from app.crm.analytics_service import get_crm_stats

db = SessionLocal()
try:
    stats = get_crm_stats(db)
    print("--- CRM Stats Response ---")
    print(json.dumps(stats, indent=2))
    
    # Validation
    expected_pipeline = 150000.0
    if stats["pipeline_value"] == expected_pipeline:
        print("✅ Pipeline Value matches expected (150000)")
    else:
        print(f"❌ Pipeline Value mismatch: {stats['pipeline_value']} != {expected_pipeline}")

    if stats["lead_stats"]["total"] == 5:
        print("✅ Total Leads count matches (5)")
    
    if stats["lead_stats"]["converted"] == 2:
        print("✅ Converted Leads count matches (2)")
        
    if stats["lead_stats"]["rate"] == 40.0:
        print("✅ Conversion Rate matches (40.0%)")

finally:
    db.close()
