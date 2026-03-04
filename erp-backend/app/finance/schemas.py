from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class AccountCreate(BaseModel):
    name: str
    code: str
    type: str  # ASSET, LIABILITY, INCOME, EXPENSE, EQUITY
    parent_id: Optional[int] = None


class AccountResponse(BaseModel):
    id: int
    name: str
    code: str
    type: str
    parent_id: Optional[int]
    
    class Config:
        from_attributes = True


class JournalEntryItemCreate(BaseModel):
    account_id: int
    debit: float
    credit: float


class JournalEntryCreate(BaseModel):
    description: str
    reference: Optional[str] = None
    items: List[JournalEntryItemCreate]


class InvoiceLineCreate(BaseModel):
    description: str
    quantity: float
    unit_price: float
    item_id: Optional[int] = None


class InvoiceCreate(BaseModel):
    customer_name: str
    reference: Optional[str] = None
    due_date: Optional[date] = None
    lines: List[InvoiceLineCreate]


class InvoiceResponse(BaseModel):
    id: int
    customer_name: str
    invoice_date: date
    due_date: Optional[date]
    status: str
    total_amount: float
    reference: Optional[str]
    journal_entry_id: Optional[int]
    
    class Config:
        from_attributes = True


class BillLineCreate(BaseModel):
    description: str
    quantity: float
    unit_price: float


class BillCreate(BaseModel):
    vendor_name: str
    reference: Optional[str] = None
    due_date: Optional[date] = None
    lines: List[BillLineCreate]


class BillResponse(BaseModel):
    id: int
    vendor_name: str
    bill_date: date
    due_date: Optional[date]
    status: str
    total_amount: float
    reference: Optional[str]
    journal_entry_id: Optional[int]
    
    class Config:
        from_attributes = True
