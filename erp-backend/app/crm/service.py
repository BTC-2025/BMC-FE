from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional

from app.crm.models import Lead, Deal, Activity, Customer, Contact, Quote, QuoteItem


LEAD_FLOW = {
    "NEW": ["CONTACTED", "LOST"], # Adjusted to allow LOST from NEW
    "CONTACTED": ["QUALIFIED", "LOST"],
    "QUALIFIED": ["CONVERTED", "LOST"],
    "CONVERTED": [],
    "LOST": ["NEW"], # Allow reactivation
}

DEAL_FLOW = {
    "DISCOVERY": ["PROPOSAL", "LOST"],
    "PROPOSAL": ["NEGOTIATION", "LOST"],
    "NEGOTIATION": ["WON", "LOST"],
    "WON": [],
    "LOST": ["DISCOVERY"], # Allow reactivation
}


def update_lead_status(
    db: Session,
    *,
    lead_id: int,
    new_status: str,
    performed_by: int,
    tenant_id: int,
):
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.tenant_id == tenant_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    allowed = LEAD_FLOW.get(lead.status, [])
    # Add check: if new_status == current_status, return (idempotency)
    if new_status == lead.status:
        return lead
        
    if new_status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status transition: {lead.status} → {new_status}"
        )

    lead.status = new_status

    activity = Activity(
        lead_id=lead.id,
        tenant_id=tenant_id,
        type="STATUS_CHANGE",
        note=f"Lead status changed to {new_status}",
        performed_by=performed_by,
    )

    db.add(activity)
    db.commit()
    db.refresh(lead)
    return lead


def convert_lead_to_deal(
    db: Session,
    *,
    lead_id: int,
    title: str,
    value: float,
    performed_by: int,
    tenant_id: int,
):
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.tenant_id == tenant_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead.status != "QUALIFIED":
        raise HTTPException(
            status_code=400,
            detail="Only QUALIFIED leads can be converted"
        )

    if lead.deal:
        raise HTTPException(status_code=400, detail="Lead already converted")

    try:
        deal = Deal(
            lead_id=lead.id,
            tenant_id=tenant_id,
            title=title,
            value=value,
            stage="DISCOVERY",
            probability=10
        )
        lead.status = "CONVERTED"

        activity = Activity(
            lead_id=lead.id,
            deal_id=None,
            tenant_id=tenant_id,
            type="CONVERT",
            note="Lead converted to deal",
            performed_by=performed_by,
        )

        db.add(deal)
        db.add(activity)
        db.commit()
        db.refresh(deal)
        db.refresh(lead)

        from app.notifications.service import notify
        notify(
            db,
            tenant_id=tenant_id,
            user_ids=[performed_by],
            title="Lead Converted",
            message=f"Success! Lead {lead.name} has been converted into Deal: {deal.title}.",
            module="crm",
            event="lead.converted"
        )

        return deal

    except Exception:
        db.rollback()
        raise


def update_deal_stage(
    db: Session,
    *,
    deal_id: int,
    new_stage: str,
    performed_by: int,
    tenant_id: int,
):
    deal = db.query(Deal).filter(Deal.id == deal_id, Deal.tenant_id == tenant_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    allowed = DEAL_FLOW.get(deal.stage, [])
    
    if new_stage == deal.stage:
        return deal

    if new_stage not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid stage transition: {deal.stage} → {new_stage}"
        )

    deal.stage = new_stage

    activity = Activity(
        deal_id=deal.id,
        tenant_id=tenant_id,
        type="STAGE_CHANGE",
        note=f"Deal moved to {new_stage}",
        performed_by=performed_by,
    )

    db.add(activity)
    db.commit()
    db.refresh(deal)

    if new_stage == "WON":
        from app.notifications.service import notify
        notify(
            db,
            tenant_id=tenant_id,
            user_ids=[performed_by],
            title="Deal Won! 🏆",
            message=f"Congratulations! Deal '{deal.title}' has been moved to WON stage.",
            module="crm",
            event="deal.won"
        )

    return deal


# --- MANUAL DEAL SERVICES ---
def create_deal(db: Session, tenant_id: int, data: dict):
    deal = Deal(**data, tenant_id=tenant_id)
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal

def get_deals(db: Session, tenant_id: int, skip: int = 0, limit: int = 100):
    return db.query(Deal).filter(Deal.tenant_id == tenant_id).offset(skip).limit(limit).all()

def get_deal(db: Session, deal_id: int, tenant_id: int):
    return db.query(Deal).filter(Deal.id == deal_id, Deal.tenant_id == tenant_id).first()

def update_deal(db: Session, deal_id: int, tenant_id: int, data: dict):
    deal = db.query(Deal).filter(Deal.id == deal_id, Deal.tenant_id == tenant_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    for key, value in data.items():
        setattr(deal, key, value)
    db.commit()
    db.refresh(deal)
    return deal

def delete_deal(db: Session, deal_id: int, tenant_id: int):
    deal = db.query(Deal).filter(Deal.id == deal_id, Deal.tenant_id == tenant_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    db.delete(deal)
    db.commit()
    return {"message": "Deal deleted"}


def log_activity(
    db: Session,
    *,
    lead_id: Optional[int] = None,
    deal_id: Optional[int] = None,
    customer_id: Optional[int] = None,
    activity_type: str,
    note: str,
    performed_by: int,
    tenant_id: int,
):
    if not lead_id and not deal_id and not customer_id:
        raise HTTPException(status_code=400, detail="Activity must link to lead, deal or customer")

    activity = Activity(
        lead_id=lead_id,
        deal_id=deal_id,
        customer_id=customer_id,
        tenant_id=tenant_id,
        type=activity_type,
        note=note,
        performed_by=performed_by,
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

def get_activities(db: Session, tenant_id: int, skip: int = 0, limit: int = 100):
    from app.crm.models import Activity
    return db.query(Activity).filter(Activity.tenant_id == tenant_id).order_by(Activity.created_at.desc()).offset(skip).limit(limit).all()

# --- CUSTOMER SERVICES ---
def create_customer(db: Session, tenant_id: int, data: dict):
    customer = Customer(**data, tenant_id=tenant_id)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

def get_customers(db: Session, tenant_id: int, skip: int = 0, limit: int = 100):
    return db.query(Customer).filter(Customer.tenant_id == tenant_id).offset(skip).limit(limit).all()

def update_customer(db: Session, customer_id: int, tenant_id: int, data: dict):
    customer = db.query(Customer).filter(Customer.id == customer_id, Customer.tenant_id == tenant_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, value in data.items():
        setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer

# --- CONTACT SERVICES ---
def create_contact(db: Session, tenant_id: int, data: dict):
    contact = Contact(**data, tenant_id=tenant_id)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

def get_contacts(db: Session, tenant_id: int, skip: int = 0, limit: int = 100):
    return db.query(Contact).filter(Contact.tenant_id == tenant_id).offset(skip).limit(limit).all()

def update_contact(db: Session, contact_id: int, tenant_id: int, data: dict):
    contact = db.query(Contact).filter(Contact.id == contact_id, Contact.tenant_id == tenant_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for key, value in data.items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact
def update_lead(
    db: Session,
    lead_id: int,
    data: dict,
    tenant_id: int
):
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.tenant_id == tenant_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    for key, value in data.items():
        if value is not None:
            setattr(lead, key, value)
            
    db.commit()
    db.refresh(lead)
    return lead


# --- QUOTATION SERVICES ---
def create_quote(db: Session, tenant_id: int, data: dict):
    items_data = data.pop("items", [])
    
    # Calculate total
    total = sum(float(i.get("subtotal", 0.0)) for i in items_data)
    
    quote = Quote(
        **data,
        tenant_id=tenant_id,
        total_amount=total,
        status="DRAFT"
    )
    db.add(quote)
    db.flush() # Get quote ID
    
    for item in items_data:
        q_item = QuoteItem(
            **item,
            quote_id=quote.id,
            tenant_id=tenant_id
        )
        db.add(q_item)
    
    db.commit()
    db.refresh(quote)
    return quote

def get_quotes(db: Session, tenant_id: int, skip: int = 0, limit: int = 100):
    return db.query(Quote).filter(Quote.tenant_id == tenant_id).offset(skip).limit(limit).all()

def update_quote_status(db: Session, quote_id: int, tenant_id: int, status: str):
    quote = db.query(Quote).filter(Quote.id == quote_id, Quote.tenant_id == tenant_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    quote.status = status
    db.commit()
    db.refresh(quote)
    return quote
