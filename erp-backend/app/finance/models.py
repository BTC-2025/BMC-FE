from sqlalchemy import (
    Column, Integer, String, Date, ForeignKey, Numeric, Boolean, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import date
import enum

from app.core.database import Base


class Account(Base):
    __tablename__ = "finance_accounts"
    __table_args__ = (
        UniqueConstraint("code", "tenant_id", name="uq_account_code_tenant"),
    )

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    type = Column(String, nullable=False)  # ASSET, LIABILITY, INCOME, EXPENSE, EQUITY
    parent_id = Column(Integer, ForeignKey("finance_accounts.id"), nullable=True)

    parent = relationship("Account", remote_side=[id])
    journal_items = relationship("JournalItem", back_populates="account")


class JournalEntry(Base):
    __tablename__ = "finance_journal_entries"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    entry_date = Column(Date, default=date.today)
    description = Column(String, nullable=False)
    reference = Column(String, nullable=True)
    posted_by = Column(Integer, nullable=False)  # user_id
    created_at = Column(Date, default=date.today)

    items = relationship(
        "JournalItem",
        back_populates="entry",
        cascade="all, delete-orphan"
    )


class JournalItem(Base):
    __tablename__ = "finance_journal_items"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    entry_id = Column(Integer, ForeignKey("finance_journal_entries.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("finance_accounts.id"), nullable=False)

    debit = Column(Numeric(12, 2), default=0)
    credit = Column(Numeric(12, 2), default=0)

    entry = relationship("JournalEntry", back_populates="items")
    account = relationship("Account", back_populates="journal_items")


class InvoiceStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    POSTED = "POSTED"
    PAID = "PAID"
    VOID = "VOID"


class Invoice(Base):
    __tablename__ = "finance_invoices"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    customer_name = Column(String, nullable=False)
    invoice_date = Column(Date, default=date.today)
    due_date = Column(Date, nullable=True)
    status = Column(String, default=InvoiceStatus.DRAFT)
    total_amount = Column(Numeric(12, 2), default=0)
    reference = Column(String, nullable=True)

    # Multi-Currency Fields
    currency = Column(String(3), nullable=False, default="INR")
    exchange_rate = Column(Numeric(18, 6), default=1.0)
    total_amount_foreign = Column(Numeric(12, 2), default=0)
    total_amount_base = Column(Numeric(12, 2), default=0)
    amount_paid = Column(Numeric(12, 2), default=0)
    
    # Audit & GL Link
    created_by = Column(Integer, nullable=False)
    posted_by = Column(Integer, nullable=True)
    journal_entry_id = Column(Integer, nullable=True)  # Links to JournalEntry.id
    
    # Lines
    lines = relationship("InvoiceLine", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceLine(Base):
    __tablename__ = "finance_invoice_lines"

    id = Column(Integer, primary_key=True)
    # Lines inherit tenant context from Invoice usually, but safe to add for reporting
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True) 
    invoice_id = Column(Integer, ForeignKey("finance_invoices.id"), nullable=False)
    description = Column(String, nullable=False)
    item_id = Column(Integer, nullable=True)
    quantity = Column(Numeric(10, 2), default=1)
    unit_price = Column(Numeric(12, 2), default=0)
    amount = Column(Numeric(12, 2), default=0)
    
    invoice = relationship("Invoice", back_populates="lines")


class Bill(Base):
    __tablename__ = "finance_bills"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    vendor_name = Column(String, nullable=False)
    bill_date = Column(Date, default=date.today)
    due_date = Column(Date, nullable=True)
    status = Column(String, default="DRAFT")
    total_amount = Column(Numeric(12, 2), default=0)
    reference = Column(String, nullable=True)

    # Multi-Currency Fields
    currency = Column(String(3), nullable=False, default="INR")
    exchange_rate = Column(Numeric(18, 6), default=1.0)
    total_amount_foreign = Column(Numeric(12, 2), default=0)
    total_amount_base = Column(Numeric(12, 2), default=0)
    
    # Audit & GL Link
    created_by = Column(Integer, nullable=False)
    posted_by = Column(Integer, nullable=True)
    journal_entry_id = Column(Integer, nullable=True)  # Links to JournalEntry.id
    
    # Lines
    lines = relationship("BillLine", back_populates="bill", cascade="all, delete-orphan")


class BillLine(Base):
    __tablename__ = "finance_bill_lines"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    bill_id = Column(Integer, ForeignKey("finance_bills.id"), nullable=False)
    description = Column(String, nullable=False)
    quantity = Column(Numeric(10, 2), default=1)
    unit_price = Column(Numeric(12, 2), default=0)
    amount = Column(Numeric(12, 2), default=0)
    
    bill = relationship("Bill", back_populates="lines")


# -----------------------------
# MULTI-CURRENCY (STEP 3.1.1)
# -----------------------------

class Currency(Base):
    __tablename__ = "finance_currencies"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    code = Column(String(3), nullable=False)  # USD, EUR, INR
    name = Column(String, nullable=False)
    symbol = Column(String)
    is_base = Column(Boolean, default=False)


class ExchangeRate(Base):
    __tablename__ = "finance_exchange_rates"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    from_currency = Column(String(3), nullable=False)
    to_currency = Column(String(3), nullable=False)
    rate = Column(Numeric(18, 6), nullable=False)
    effective_date = Column(Date, nullable=False)


# -----------------------------
# PAYMENTS & RECONCILIATION (STEP 3.2.1)
# -----------------------------

class Payment(Base):
    __tablename__ = "finance_payments"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    invoice_id = Column(Integer, ForeignKey("finance_invoices.id"), nullable=False)

    amount = Column(Numeric(12, 2), nullable=False)
    payment_date = Column(Date, nullable=False)
    payment_method = Column(String)  # CASH, BANK, CARD
    reference = Column(String)

    journal_entry_id = Column(Integer, ForeignKey("finance_journal_entries.id"), nullable=True)


class BankStatement(Base):
    __tablename__ = "finance_bank_statements"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    bank_account_id = Column(Integer, ForeignKey("finance_accounts.id"), nullable=True)
    transaction_date = Column(Date, nullable=False)
    description = Column(String)
    amount = Column(Numeric(12, 2), nullable=False)

    reconciled = Column(Boolean, default=False)
    journal_entry_id = Column(Integer, ForeignKey("finance_journal_entries.id"), nullable=True)
