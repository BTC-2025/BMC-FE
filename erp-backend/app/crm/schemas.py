from pydantic import BaseModel
from datetime import datetime


class LeadCreate(BaseModel):
    name: str
    company: str | None = None
    email: str | None = None
    phone: str | None = None
    source: str | None = "Web"
    status: str | None = "NEW"


class LeadStatusUpdate(BaseModel):
    status: str


class DealCreate(BaseModel):
    title: str
    value: float
    stage: str | None = "DISCOVERY"
    probability: int | None = 10
    expected_close_date: datetime | None = None
    lead_id: int | None = None

class DealUpdate(BaseModel):
    title: str | None = None
    value: float | None = None
    stage: str | None = None
    probability: int | None = None
    expected_close_date: datetime | None = None

class DealResponse(BaseModel):
    id: int
    tenant_id: int
    title: str
    value: float
    stage: str
    probability: int
    expected_close_date: datetime | None = None
    lead_id: int | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class DealStageUpdate(BaseModel):
    stage: str


class ActivityCreate(BaseModel):
    lead_id: int | None = None
    deal_id: int | None = None
    customer_id: int | None = None
    type: str
    note: str

class ActivityResponse(BaseModel):
    id: int
    tenant_id: int
    lead_id: int | None = None
    deal_id: int | None = None
    customer_id: int | None = None
    type: str
    note: str | None = None
    performed_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class LeadUpdate(BaseModel):
    name: str | None = None
    company: str | None = None
    email: str | None = None
    phone: str | None = None
    source: str | None = None
    status: str | None = None

# --- CUSTOMER SCHEMAS ---
class CustomerCreate(BaseModel):
    company_name: str
    industry: str | None = None
    website: str | None = None

class CustomerUpdate(BaseModel):
    company_name: str | None = None
    industry: str | None = None
    website: str | None = None

class CustomerResponse(CustomerCreate):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- CONTACT SCHEMAS ---
class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: str | None = None
    phone: str | None = None
    job_title: str | None = None
    customer_id: int | None = None
    lead_id: int | None = None

class ContactUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    job_title: str | None = None

class ContactResponse(ContactCreate):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- QUOTATION SCHEMAS ---
class QuoteItemBase(BaseModel):
    item_id: int
    quantity: float
    unit_price: float
    subtotal: float

class QuoteItemCreate(QuoteItemBase):
    pass

class QuoteItemResponse(QuoteItemBase):
    id: int
    quote_id: int
    tenant_id: int

    class Config:
        from_attributes = True

class QuoteCreate(BaseModel):
    deal_id: int | None = None
    customer_id: int | None = None
    valid_until: datetime | None = None
    items: list[QuoteItemCreate]

    from pydantic import validator
    @validator("valid_until", pre=True)
    def handle_empty_date(cls, v):
        if v == "":
            return None
        return v

class QuoteResponse(BaseModel):
    id: int
    tenant_id: int
    deal_id: int | None = None
    customer_id: int | None = None
    status: str
    total_amount: float
    valid_until: datetime | None = None
    created_at: datetime
    items: list[QuoteItemResponse]

    class Config:
        from_attributes = True

class QuoteStatusUpdate(BaseModel):
    status: str
