from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.finance.models import (
    JournalEntry, JournalItem, Invoice, InvoiceLine, InvoiceStatus, Account,
    Currency, ExchangeRate, Payment, BankStatement
)
from datetime import date

# --- GENERAL LEDGER CORE ---

def post_journal_entry(
    db: Session,
    *,
    description: str,
    reference: str | None,
    posted_by: int,
    tenant_id: int,
    items: list[dict]
):
    total_debit = sum(item["debit"] for item in items)
    total_credit = sum(item["credit"] for item in items)

    if round(total_debit, 2) != round(total_credit, 2):
        raise HTTPException(
            status_code=400,
            detail=f"Journal entry not balanced. Debit: {total_debit}, Credit: {total_credit}"
        )

    entry = JournalEntry(
        tenant_id=tenant_id,
        description=description,
        reference=reference,
        posted_by=posted_by,
    )

    db.add(entry)
    db.flush()  # get entry.id

    for item in items:
        ji = JournalItem(
            tenant_id=tenant_id,
            entry_id=entry.id,
            account_id=item["account_id"],
            debit=item["debit"],
            credit=item["credit"],
        )
        db.add(ji)

    db.commit()
    db.refresh(entry)

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=tenant_id,
        user_id=posted_by,
        action="finance.gl_entry_posted",
        module="finance",
        entity_type="JournalEntry",
        entity_id=entry.id,
        after={"description": entry.description},
    )

    return entry

# --- COMMERCIAL DOCUMENTS (INVOICING) ---

def create_invoice(
    db: Session,
    *,
    customer_name: str,
    tenant_id: int,
    created_by: int,
    lines: list[dict],
    reference: str = None,
    due_date: date = None,
    currency: str = "INR"
):
    total_amount_foreign = sum(line["quantity"] * line["unit_price"] for line in lines)
    
    invoice = Invoice(
        tenant_id=tenant_id,
        customer_name=customer_name,
        created_by=created_by,
        total_amount=total_amount_foreign, # Initially foreign
        total_amount_foreign=total_amount_foreign,
        currency=currency,
        reference=reference,
        due_date=due_date,
        status=InvoiceStatus.DRAFT
    )
    db.add(invoice)
    db.flush()
    
    for line in lines:
        amount = line["quantity"] * line["unit_price"]
        inv_line = InvoiceLine(
            tenant_id=invoice.tenant_id,
            invoice_id=invoice.id,
            description=line["description"],
            item_id=line.get("item_id"),
            quantity=line["quantity"],
            unit_price=line["unit_price"],
            amount=amount
        )
        db.add(inv_line)
        
    db.commit()
    db.refresh(invoice)
    
    # 🔔 STEP 1.1.8 - EMAIL NOTIFICATION EVENT HOOK
    try:
        from app.notifications.service import send_email
        
        send_email(
            db=db,
            to=f"{customer_name.lower().replace(' ', '')}@example.com",
            template_name="invoice_created",
            context={
                "invoice_id": invoice.id,
                "customer_name": customer_name,
                "total_amount": float(total_amount_foreign),
                "invoice_date": invoice.invoice_date.strftime("%Y-%m-%d") if invoice.invoice_date else date.today().strftime("%Y-%m-%d"),
                "due_date": due_date.strftime("%Y-%m-%d") if due_date else "N/A"
            },
            user_id=created_by
        )
    except Exception as e:
        # Don't fail invoice creation if email fails
        print(f"⚠️ Email notification failed: {e}")
    
    return invoice

def post_invoice(db: Session, invoice_id: int, user_id: int, tenant_id: int):
    # 1. Get Invoice
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.tenant_id == tenant_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    if invoice.status != InvoiceStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Invoice already posted or void")
        
    # 2. Get/Create Required Accounts (Lite Mode Auto-Wiring)
    ar_account = db.query(Account).filter(Account.code == "1200", Account.tenant_id == tenant_id).first() # 1200 = Accounts Receivable
    income_account = db.query(Account).filter(Account.code == "4000", Account.tenant_id == tenant_id).first() # 4000 = Sales Income
    
    if not ar_account or not income_account:
        # In a real app, we'd seed this. For safety here:
        raise HTTPException(status_code=500, detail="Default accounts (1200, 4000) missing. Run seeding.")

    # Dr Accounts Receivable (Asset increases)
    # Cr Sales Income (Income increases)
    
    # --- MULTI-CURRENCY CONVERSION ---
    base_currency_obj = db.query(Currency).filter(Currency.is_base == True, Currency.tenant_id == tenant_id).first()
    rate = 1.0
    
    if base_currency_obj and invoice.currency != base_currency_obj.code:
        rate = get_exchange_rate(
            from_currency=invoice.currency,
            to_currency=base_currency_obj.code,
            txn_date=invoice.invoice_date,
            db=db,
            tenant_id=tenant_id
        )
    
    invoice.exchange_rate = float(rate)
    invoice.total_amount_base = float(invoice.total_amount_foreign) * float(rate)
    
    je_items = [
        {"account_id": ar_account.id, "debit": invoice.total_amount_base, "credit": 0},
        {"account_id": income_account.id, "debit": 0, "credit": invoice.total_amount_base}
    ]
    
    try:
        entry = post_journal_entry(
            db,
            description=f"Invoice #{invoice.id} - {invoice.customer_name}",
            reference=invoice.reference or f"INV-{invoice.id}",
            posted_by=user_id,
            tenant_id=invoice.tenant_id,
            items=je_items
        )
        
        # 4. Update Invoice Status & Link to Journal Entry
        invoice.status = InvoiceStatus.POSTED
        invoice.posted_by = user_id
        invoice.journal_entry_id = entry.id
        db.commit()
        db.refresh(invoice)

        from app.core.audit.service import log_action
        log_action(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            action="finance.invoice_posted",
            module="finance",
            entity_type="Invoice",
            entity_id=invoice.id,
            before={"status": "DRAFT"},
            after={"status": "POSTED"},
        )

        return invoice
        
    except Exception as e:
        db.rollback()
        raise e


def create_bill(
    db: Session,
    *,
    vendor_name: str,
    tenant_id: int,
    created_by: int,
    lines: list[dict],
    reference: str = None,
    due_date: date = None
):
    from app.finance.models import Bill, BillLine
    
    total_amount = sum(line["quantity"] * line["unit_price"] for line in lines)
    
    bill = Bill(
        tenant_id=tenant_id,
        vendor_name=vendor_name,
        created_by=created_by,
        total_amount=total_amount,
        reference=reference,
        due_date=due_date,
        status="DRAFT"
    )
    db.add(bill)
    db.flush()
    
    for line in lines:
        amount = line["quantity"] * line["unit_price"]
        bill_line = BillLine(
            bill_id=bill.id,
            description=line["description"],
            tenant_id=tenant_id, # If missing in model, need to check if added below. Model showed tenant_id nullable=False for Account/JE/JI/Invoice/Bill/Line usually. Let's check BillLine.
            quantity=line["quantity"],
            unit_price=line["unit_price"],
            amount=amount
        )
        db.add(bill_line)
        
    db.commit()
    db.refresh(bill)
    return bill


def post_bill(db: Session, bill_id: int, user_id: int, tenant_id: int):
    from app.finance.models import Bill
    
    # 1. Get Bill
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.tenant_id == tenant_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    if bill.status != "DRAFT":
        raise HTTPException(status_code=400, detail="Bill already posted")
        
    # 2. Get Required Accounts
    expense_account = db.query(Account).filter(Account.code == "5000", Account.tenant_id == tenant_id).first() # 5000 = Operating Expense
    ap_account = db.query(Account).filter(Account.code == "2100", Account.tenant_id == tenant_id).first() # 2100 = Accounts Payable
    
    if not expense_account or not ap_account:
        raise HTTPException(status_code=500, detail="Default accounts (5000, 2100) missing. Run seeding.")

    # 3. Create Journal Entry
    # Dr Operating Expense (Expense increases)
    # Cr Accounts Payable (Liability increases)
    
    je_items = [
        {"account_id": expense_account.id, "debit": bill.total_amount, "credit": 0},
        {"account_id": ap_account.id, "debit": 0, "credit": bill.total_amount}
    ]
    
    try:
        entry = post_journal_entry(
            db,
            description=f"Bill #{bill.id} - {bill.vendor_name}",
            reference=bill.reference or f"BILL-{bill.id}",
            posted_by=user_id,
            tenant_id=bill.tenant_id,
            items=je_items
        )
        
        # 4. Update Bill Status & Link to Journal Entry
        bill.status = "POSTED"
        bill.posted_by = user_id
        bill.journal_entry_id = entry.id
        db.commit()
        db.refresh(bill)

        from app.core.audit.service import log_action
        log_action(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            action="finance.bill_posted",
            module="finance",
            entity_type="Bill",
            entity_id=bill.id,
            before={"status": "DRAFT"},
            after={"status": "POSTED"},
        )

        return bill
        
    except Exception as e:
        db.rollback()
        raise e


def update_bill(
    db: Session,
    bill_id: int,
    tenant_id: int,
    data: dict
):
    from app.finance.models import Bill, BillLine
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.tenant_id == tenant_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    if bill.status != "DRAFT":
        raise HTTPException(status_code=400, detail="Cannot edit a posted bill")

    # Update basic fields
    if "vendor_name" in data:
        bill.vendor_name = data["vendor_name"]
    if "reference" in data:
        bill.reference = data["reference"]
    if "due_date" in data:
        bill.due_date = data["due_date"]

    # Update total amount (simple implementation for now, assuming one line)
    if "amount" in data:
        bill.total_amount = data["amount"]
        # Update the first line description/amount if it exists
        line = db.query(BillLine).filter(BillLine.bill_id == bill.id).first()
        if line:
            line.unit_price = data["amount"]
            line.amount = data["amount"]
    
    db.commit()
    db.refresh(bill)
    return bill


def delete_bill(db: Session, bill_id: int, tenant_id: int):
    from app.finance.models import Bill, BillLine
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.tenant_id == tenant_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    if bill.status != "DRAFT":
        raise HTTPException(status_code=400, detail="Cannot delete a posted bill")

    # Delete lines first
    db.query(BillLine).filter(BillLine.bill_id == bill_id).delete()
    # Delete the bill
    db.delete(bill)
    db.commit()
    return {"message": "Bill deleted successfully"}

# --- REPORTING (PHASE 3) ---

def get_trial_balance(db: Session, tenant_id: int):
    """
    Returns sum of Debits and Credits per Account.
    Used for P&L, BS, and Trial Balance.
    """
    results = db.query(
        Account.code,
        Account.name,
        Account.type,
        func.sum(JournalItem.debit).label("total_debit"),
        func.sum(JournalItem.credit).label("total_credit")
    ).join(JournalItem).filter(Account.tenant_id == tenant_id).group_by(Account.id).all()
    
    return [
        {
            "code": r.code,
            "account": r.name,
            "type": r.type,
            "debit": r.total_debit,
            "credit": r.total_credit,
            "net_balance": r.total_debit - r.total_credit # Dr - Cr (Asset/Exp positive, Liab/Inc negative)
        }
        for r in results
    ]

def get_profit_loss_summary(db: Session, tenant_id: int):
    """
    Simulated P&L based on Trial Balance.
    Income = Credit Balance (usually), Expense = Debit Balance.
    """
    tb = get_trial_balance(db, tenant_id=tenant_id)
    income = sum(item['credit'] - item['debit'] for item in tb if item['type'] == 'INCOME')
    expense = sum(item['debit'] - item['credit'] for item in tb if item['type'] == 'EXPENSE')
    net_profit = income - expense
    
    return {
        "total_income": income,
        "total_expense": expense,
        "net_profit": net_profit,
        "details": [x for x in tb if x['type'] in ('INCOME', 'EXPENSE')]
    }
# -----------------------------
# MULTI-CURRENCY SERVICE (STEP 3.1.3)
# -----------------------------

def get_exchange_rate(
    from_currency: str,
    to_currency: str,
    txn_date,
    db: Session,
    tenant_id: int
):
    """
    Retrieves the most recent exchange rate on or before the transaction date.
    """
    if from_currency == to_currency:
        return 1.0

    rate = (
        db.query(ExchangeRate)
        .filter(
            ExchangeRate.from_currency == from_currency,
            ExchangeRate.to_currency == to_currency,
            ExchangeRate.effective_date <= txn_date,
            ExchangeRate.tenant_id == tenant_id
        )
        .order_by(ExchangeRate.effective_date.desc())
        .first()
    )

    if not rate:
        # Fallback for identity if not found
        if from_currency == to_currency: return 1.0
        raise HTTPException(status_code=400, detail=f"Exchange rate not found for {from_currency} -> {to_currency} on {txn_date}")

    return rate.rate


# -----------------------------
# PAYMENTS & RECONCILIATION (STEP 3.2.2 & 3.2.3)
# -----------------------------

def record_payment(
    db: Session,
    *,
    tenant_id: int,
    invoice_id: int,
    amount: float,
    payment_date,
    payment_method: str,
    reference: str | None,
    user_id: int,
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.tenant_id == tenant_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    if invoice.status not in [InvoiceStatus.POSTED, "PARTIALLY_PAID"]:
        raise HTTPException(status_code=400, detail="Cannot pay unposted or already paid invoice")

    # 1. Resolve Accounts (Cash/Bank vs Accounts Receivable)
    # Defaulting to 1000 (Bank/Cash) and 1200 (AR)
    bank_account = db.query(Account).filter(Account.code == "1000", Account.tenant_id == tenant_id).first()
    ar_account = db.query(Account).filter(Account.code == "1200", Account.tenant_id == tenant_id).first()

    if not bank_account or not ar_account:
        raise HTTPException(status_code=500, detail="Default accounts (1000, 1200) missing")

    # 2. Post Journal Entry (Dr Bank, Cr Accounts Receivable)
    je_items = [
        {"account_id": bank_account.id, "debit": float(amount), "credit": 0},
        {"account_id": ar_account.id, "debit": 0, "credit": float(amount)}
    ]
    
    entry = post_journal_entry(
        db,
        description=f"Payment for Invoice #{invoice.id}",
        reference=reference or f"PAY-{invoice.id}",
        posted_by=user_id,
        tenant_id=invoice.tenant_id,
        items=je_items
    )

    # 3. Create Payment Record
    payment = Payment(
        tenant_id=invoice.tenant_id,
        invoice_id=invoice.id,
        amount=amount,
        payment_date=payment_date,
        payment_method=payment_method,
        reference=reference,
        journal_entry_id=entry.id
    )
    db.add(payment)

    # 4. Update Invoice Status
    invoice.amount_paid = float(invoice.amount_paid or 0) + float(amount)
    
    if invoice.amount_paid >= invoice.total_amount_base:
        invoice.status = InvoiceStatus.PAID
    else:
        invoice.status = "PARTIALLY_PAID"

    db.commit()
    db.refresh(payment)

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=tenant_id,
        user_id=user_id,
        action="finance.payment_recorded",
        module="finance",
        entity_type="Payment",
        entity_id=payment.id,
        after={"amount": float(amount), "method": payment_method, "invoice_id": invoice_id},
    )

    return payment


def reconcile_bank_statement(
    db: Session,
    *,
    tenant_id: int,
    statement_id: int,
    journal_entry_id: int,
    user_id: int,
):
    stmt = db.query(BankStatement).filter(BankStatement.id == statement_id, BankStatement.tenant_id == tenant_id).first()
    if not stmt:
        raise HTTPException(status_code=404, detail="Bank statement line not found")

    stmt.reconciled = True
    stmt.journal_entry_id = journal_entry_id
    
    db.commit()
    db.refresh(stmt)
    return stmt

def sync_bank_statements(
    db: Session,
    *,
    tenant_id: int,
    user_id: int
):
    """
    MOCK: Simulates fetching transactions from a connected bank account.
    Generates random transactions for demonstration.
    """
    import random
    from datetime import timedelta

    # 1. Find Bank Account (Default 1000)
    bank_acc = db.query(Account).filter(Account.code == "1000", Account.tenant_id == tenant_id).first()
    if not bank_acc:
        # Create it if missing for demo
        bank_acc = Account(
            tenant_id=tenant_id, name="Main Bank (Demo)", code="1000", type="ASSET", parent_id=None
        )
        db.add(bank_acc)
        db.commit()
        db.refresh(bank_acc)

    # 2. Generate Random Mock Transactions
    descriptions = [
        "AWS Service Charge", "Client Payment - TechCorp", "Office Supplies - Staples", 
        "Subscription - Adobe", "Wire Transfer Incoming", "Uber Ride - Client Meeting"
    ]
    
    new_stmts = []
    for _ in range(random.randint(2, 5)):
        amount = random.uniform(10.0, 5000.0)
        is_credit = random.choice([True, False])
        if not is_credit:
            amount = -amount # Debit (expense)
            
        stmt = BankStatement(
            tenant_id=tenant_id,
            bank_account_id=bank_acc.id,
            transaction_date=date.today() - timedelta(days=random.randint(0, 30)),
            description=random.choice(descriptions),
            amount=round(amount, 2),
            reconciled=False
        )
        db.add(stmt)
        new_stmts.append(stmt)
        
    db.commit()
    return new_stmts

def get_bank_statements(db: Session, tenant_id: int):
    return db.query(BankStatement).filter(BankStatement.tenant_id == tenant_id).order_by(BankStatement.transaction_date.desc()).all()
