from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.permissions import get_current_user, require_permission
from app.crm.models import Lead, Deal
from app.crm.schemas import (
    LeadCreate,
    LeadUpdate,
    LeadStatusUpdate,
    DealCreate,
    DealUpdate,
    DealResponse,
    DealStageUpdate,
    ActivityCreate,
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
    ContactCreate,
    ContactUpdate,
    ContactResponse,
    QuoteCreate,
    QuoteResponse,
    QuoteStatusUpdate,
    ActivityResponse,
)
from app.crm.service import (
    update_lead_status,
    convert_lead_to_deal,
    update_deal_stage,
    log_activity,
    get_activities,
    create_customer,
    get_customers,
    update_customer,
    create_contact,
    get_contacts,
    update_contact,
    create_deal,
    get_deals,
    get_deal,
    update_deal,
    delete_deal,
    create_quote,
    get_quotes,
    update_quote_status,
)
from app.crm.analytics_service import get_crm_stats
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/crm", tags=["CRM"])

# 🟩 CREATE LEAD
@router.post(
    "/leads",
    dependencies=[Depends(require_permission("crm.edit"))],
)
def create_lead(
    data: LeadCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    lead = Lead(**data.dict(), tenant_id=tenant_id)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

# 🟦 LIST LEADS (LITE HUB)
@router.get(
    "/leads",
    dependencies=[Depends(require_permission("crm.view"))],
)
def list_leads(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 50
):
    return db.query(Lead).filter(Lead.tenant_id == tenant_id).offset(skip).limit(limit).all()

# 🟨 UPDATE LEAD STATUS
@router.post(
    "/leads/{lead_id}/status",
    dependencies=[Depends(require_permission("crm.edit"))],
)
def update_status(
    lead_id: int,
    data: LeadStatusUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return update_lead_status(
        db,
        lead_id=lead_id,
        new_status=data.status,
        performed_by=user.id,
        tenant_id=tenant_id
    )

# 🟥 CONVERT LEAD → DEAL (ATOMIC)
@router.post(
    "/leads/{lead_id}/convert",
    response_model=DealResponse,
    dependencies=[Depends(require_permission("crm.edit"))],
)
def convert_lead(
    lead_id: int,
    data: DealCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return convert_lead_to_deal(
        db,
        lead_id=lead_id,
        title=data.title,
        value=data.value,
        performed_by=user.id,
        tenant_id=tenant_id,
    )

# 🟪 UPDATE DEAL STAGE (PIPELINE)
@router.post(
    "/deals/{deal_id}/stage",
    response_model=DealResponse,
    dependencies=[Depends(require_permission("crm.edit"))],
)
def move_deal(
    deal_id: int,
    data: DealStageUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return update_deal_stage(
        db,
        deal_id=deal_id,
        new_stage=data.stage,
        performed_by=user.id,
        tenant_id=tenant_id,
    )

# --- MANUAL DEAL ROUTES ---
@router.post("/deals", response_model=DealResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_create_deal(
    data: DealCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return create_deal(db, tenant_id=tenant_id, data=data.dict())

@router.get("/deals", response_model=List[DealResponse], dependencies=[Depends(require_permission("crm.view"))])
def api_get_deals(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return get_deals(db, tenant_id=tenant_id, skip=skip, limit=limit)

@router.patch("/deals/{deal_id}", response_model=DealResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_update_deal(
    deal_id: int,
    data: DealUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return update_deal(db, deal_id=deal_id, tenant_id=tenant_id, data=data.dict(exclude_unset=True))

@router.delete("/deals/{deal_id}", dependencies=[Depends(require_permission("crm.edit"))])
def api_delete_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return delete_deal(db, deal_id=deal_id, tenant_id=tenant_id)

# 🟫 LOG ACTIVITY
@router.post(
    "/activities",
    dependencies=[Depends(require_permission("crm.edit"))],
)
def create_activity(
    data: ActivityCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return log_activity(
        db,
        lead_id=data.lead_id,
        deal_id=data.deal_id,
        customer_id=data.customer_id,
        activity_type=data.type,
        note=data.note,
        performed_by=user.id,
        tenant_id=tenant_id
    )

@router.get("/activities", response_model=List[ActivityResponse], dependencies=[Depends(require_permission("crm.view"))])
def api_get_activities(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return get_activities(db, tenant_id=tenant_id, skip=skip, limit=limit)

# --- CUSTOMER ROUTES ---
@router.post("/customers", response_model=CustomerResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return create_customer(db, tenant_id=tenant_id, data=data.dict())

@router.get("/customers", response_model=List[CustomerResponse], dependencies=[Depends(require_permission("crm.view"))])
def api_get_customers(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return get_customers(db, tenant_id=tenant_id, skip=skip, limit=limit)

@router.patch("/customers/{customer_id}", response_model=CustomerResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return update_customer(db, customer_id=customer_id, tenant_id=tenant_id, data=data.dict(exclude_unset=True))

# --- CONTACT ROUTES ---
@router.post("/contacts", response_model=ContactResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_create_contact(
    data: ContactCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return create_contact(db, tenant_id=tenant_id, data=data.dict())

@router.get("/contacts", response_model=List[ContactResponse], dependencies=[Depends(require_permission("crm.view"))])
def api_get_contacts(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return get_contacts(db, tenant_id=tenant_id, skip=skip, limit=limit)

@router.patch("/contacts/{contact_id}", response_model=ContactResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_update_contact(
    contact_id: int,
    data: ContactUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return update_contact(db, contact_id=contact_id, tenant_id=tenant_id, data=data.dict(exclude_unset=True))

# 🟩 CRM STATS ENDPOINT
@router.get(
    "/stats",
    dependencies=[Depends(require_permission("crm.view_stats"))],
)
def crm_stats(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return get_crm_stats(db, tenant_id=tenant_id)
@router.patch(
    "/leads/{lead_id}",
    dependencies=[Depends(require_permission("crm.edit"))],
)
def patch_lead(
    lead_id: int,
    data: LeadUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.crm.service import update_lead
    return update_lead(
        db,
        lead_id=lead_id,
        data=data.dict(exclude_unset=True),
        tenant_id=tenant_id
    )

# --- QUOTATION ROUTES ---
@router.post("/quotes", response_model=QuoteResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_create_quote(
    data: QuoteCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return create_quote(db, tenant_id=tenant_id, data=data.dict())

@router.get("/quotes", response_model=List[QuoteResponse], dependencies=[Depends(require_permission("crm.view"))])
def api_get_quotes(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return get_quotes(db, tenant_id=tenant_id, skip=skip, limit=limit)

@router.post("/quotes/{quote_id}/status", response_model=QuoteResponse, dependencies=[Depends(require_permission("crm.edit"))])
def api_update_quote_status(
    quote_id: int,
    data: QuoteStatusUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return update_quote_status(db, quote_id=quote_id, tenant_id=tenant_id, status=data.status)
