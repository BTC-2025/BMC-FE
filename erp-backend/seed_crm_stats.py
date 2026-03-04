from app.core.database import SessionLocal
from app.crm.models import Lead, Deal, Activity
from app.crm.service import convert_lead_to_deal, update_deal_stage

db = SessionLocal()

# Cleanup existing test data if needed (Optional, but safer for repeated tests)
# db.query(Activity).delete()
# db.query(Deal).delete()
# db.query(Lead).delete()
# db.commit()

# 1. Create 5 Leads
leads_data = [
    {"name": "Alice Smith", "email": "alice@example.com", "status": "QUALIFIED"},
    {"name": "Bob Jones", "email": "bob@example.com", "status": "QUALIFIED"},
    {"name": "Charlie Brown", "email": "charlie@example.com", "status": "NEW"},
    {"name": "Diana Ross", "email": "diana@example.com", "status": "CONTACTED"},
    {"name": "Edward Norton", "email": "edward@example.com", "status": "NEW"},
]

leads = []
for l_data in leads_data:
    lead = Lead(**l_data)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    leads.append(lead)

print(f"✅ Created {len(leads)} leads")

# 2. Convert 2 to Deals
# Alice (leads[0]) and Bob (leads[1]) are QUALIFIED
deal1 = convert_lead_to_deal(db, lead_id=leads[0].id, title="Enterprise Software License", value=100000, performed_by=1)
deal2 = convert_lead_to_deal(db, lead_id=leads[1].id, title="Consulting Retainer", value=50000, performed_by=1)

print(f"✅ Converted 2 leads to deals")

# 3. Set deal stages
# deal1: Move to PROPOSAL
update_deal_stage(db, deal_id=deal1.id, new_stage="PROPOSAL", performed_by=1)
# deal2: Move to WON (Need to go through stages if strictly enforced, but let's see if we can jump or if service allows it)
# In service.py: DEAL_FLOW = {"DISCOVERY": ["PROPOSAL"...], "PROPOSAL": ["NEGOTIATION"...], "NEGOTIATION": ["WON"...]}
# Default stage is DISCOVERY.
update_deal_stage(db, deal_id=deal2.id, new_stage="PROPOSAL", performed_by=1)
update_deal_stage(db, deal_id=deal2.id, new_stage="NEGOTIATION", performed_by=1)
update_deal_stage(db, deal_id=deal2.id, new_stage="WON", performed_by=1)

print(f"✅ Set deal stages (Deal 1: PROPOSAL, Deal 2: WON)")

db.close()
print("🚀 Seeding Complete")
