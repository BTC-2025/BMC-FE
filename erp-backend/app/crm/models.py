from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Numeric
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


# -----------------------------
# LEAD
# -----------------------------
class Lead(Base):
    __tablename__ = "crm_leads"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    company = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    source = Column(String, nullable=True)

    status = Column(
        String,
        default="NEW",
        nullable=False
    )  # NEW → CONTACTED → QUALIFIED → CONVERTED / LOST

    created_at = Column(DateTime, default=datetime.utcnow)

    deal = relationship("Deal", back_populates="lead", uselist=False)
    activities = relationship("Activity", back_populates="lead")
    contacts = relationship("Contact", back_populates="lead")


# -----------------------------
# DEAL
# -----------------------------
class Deal(Base):
    __tablename__ = "crm_deals"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    lead_id = Column(Integer, ForeignKey("crm_leads.id"), unique=True)

    title = Column(String, nullable=False)
    value = Column(Numeric(12, 2), nullable=False)

    stage = Column(
        String,
        default="DISCOVERY",
        nullable=False
    )  # DISCOVERY → PROPOSAL → NEGOTIATION → WON / LOST

    probability = Column(Integer, default=10) 
    expected_close_date = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="deal")
    activities = relationship("Activity", back_populates="deal")


# -----------------------------
# CUSTOMER (Commercial Entity)
# -----------------------------
class Customer(Base):
    __tablename__ = "crm_customers"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    
    company_name = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # Financial Link (for future integration)
    finance_account_id = Column(Integer, nullable=True) 

    created_at = Column(DateTime, default=datetime.utcnow)

    contacts = relationship("Contact", back_populates="customer")


# -----------------------------
# CONTACT (Person)
# -----------------------------
class Contact(Base):
    __tablename__ = "crm_contacts"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    job_title = Column(String, nullable=True)

    customer_id = Column(Integer, ForeignKey("crm_customers.id"), nullable=True)
    lead_id = Column(Integer, ForeignKey("crm_leads.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="contacts")
    lead = relationship("Lead", back_populates="contacts")


# -----------------------------
# ACTIVITY
# -----------------------------
class Activity(Base):
    __tablename__ = "crm_activities"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)

    lead_id = Column(Integer, ForeignKey("crm_leads.id"), nullable=True)
    deal_id = Column(Integer, ForeignKey("crm_deals.id"), nullable=True)
    customer_id = Column(Integer, ForeignKey("crm_customers.id"), nullable=True)

    type = Column(String, nullable=False)  # CALL | EMAIL | MEETING | NOTE
    note = Column(String, nullable=True)

    performed_by = Column(Integer, nullable=False)  # user_id
    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="activities")
    deal = relationship("Deal", back_populates="activities")


# -----------------------------
# QUOTATION
# -----------------------------
class Quote(Base):
    __tablename__ = "crm_quotes"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    
    deal_id = Column(Integer, ForeignKey("crm_deals.id"), nullable=True)
    customer_id = Column(Integer, ForeignKey("crm_customers.id"), nullable=True)
    
    status = Column(String, default="DRAFT")  # DRAFT | SENT | ACCEPTED | REJECTED
    total_amount = Column(Numeric(12, 2), default=0.0)
    valid_until = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    deal = relationship("Deal")
    customer = relationship("Customer")
    items = relationship("QuoteItem", back_populates="quote", cascade="all, delete-orphan")


class QuoteItem(Base):
    __tablename__ = "crm_quote_items"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    quote_id = Column(Integer, ForeignKey("crm_quotes.id"), nullable=False)
    
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False)
    unit_price = Column(Numeric(12, 2), nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)

    quote = relationship("Quote", back_populates="items")
