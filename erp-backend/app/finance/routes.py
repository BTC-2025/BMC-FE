from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.auth.permissions import require_permission
from app.auth.dependencies import get_current_user
from app.finance import schemas
from app.finance.models import Account, Invoice
from app.finance.service import (
    post_journal_entry,
    create_invoice,
    post_invoice,
    get_trial_balance,
    get_profit_loss_summary,
    reconcile_bank_statement,
    record_payment
)
from app.finance.pdf_service import generate_invoice_pdf, generate_bill_pdf
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/finance", tags=["Finance"])

# 🟩 ACCOUNTS (Chart of Accounts)
@router.post("/accounts", response_model=schemas.AccountResponse, dependencies=[Depends(require_permission("finance.admin"))])
def create_account(
    data: schemas.AccountCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    account = Account(**data.dict(), tenant_id=tenant_id)
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


@router.get("/accounts", response_model=List[schemas.AccountResponse], dependencies=[Depends(require_permission("finance.view"))])
def list_accounts(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Account).filter(Account.tenant_id == tenant_id).all()


# 🟦 JOURNAL ENTRIES (General Ledger)
@router.post("/journal-entries", dependencies=[Depends(require_permission("finance.post"))])
def create_journal_entry(
    data: schemas.JournalEntryCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    items = [item.dict() for item in data.items]
    entry = post_journal_entry(
        db,
        tenant_id=tenant_id,
        description=data.description,
        reference=data.reference,
        posted_by=user.id,
        items=items
    )
    return {"message": "Journal entry posted", "entry_id": entry.id}


# 🟨 INVOICES (Accounts Receivable)
@router.post("/invoices", response_model=schemas.InvoiceResponse, dependencies=[Depends(require_permission("finance.invoice"))])
def create_invoice_endpoint(
    data: schemas.InvoiceCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    lines = [line.dict() for line in data.lines]
    invoice = create_invoice(
        db,
        tenant_id=tenant_id,
        customer_name=data.customer_name,
        created_by=user.id,
        lines=lines,
        reference=data.reference,
        due_date=data.due_date
    )

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=tenant_id,
        user_id=user.id,
        action="finance.invoice_created",
        module="finance",
        entity_type="Invoice",
        entity_id=invoice.id,
        after={"total": float(invoice.total_amount), "customer": invoice.customer_name},
    )

    return invoice


@router.get("/invoices", response_model=List[schemas.InvoiceResponse], dependencies=[Depends(require_permission("finance.view"))])
def list_invoices(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Invoice).filter(Invoice.tenant_id == tenant_id).all()


@router.post("/invoices/{invoice_id}/post", dependencies=[Depends(require_permission("finance.post"))])
def post_invoice_endpoint(
    invoice_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    invoice = post_invoice(db, invoice_id, user.id, tenant_id=tenant_id)

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=tenant_id,
        user_id=user.id,
        action="finance.invoice_posted",
        module="finance",
        entity_type="Invoice",
        entity_id=invoice.id,
        before={"status": "DRAFT"},
        after={"status": "POSTED"},
    )

    return {"message": "Invoice posted to GL", "status": invoice.status, "journal_entry_id": invoice.journal_entry_id}


@router.get("/invoices/{invoice_id}/pdf", dependencies=[Depends(require_permission("finance.view"))])
def export_invoice_pdf(
    invoice_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.tenant_id == tenant_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Ensure lines are loaded
    from app.finance.models import Tenant
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    tenant_name = tenant.name if tenant else "Enterprise ERP Core"

    pdf_content = generate_invoice_pdf(invoice, tenant_name=tenant_name)
    
    filename = f"Invoice_{invoice_id}.pdf"
    return StreamingResponse(
        iter([pdf_content]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


# 🟨 BILLS (Accounts Payable / Expenses)
@router.post("/bills", response_model=schemas.BillResponse, dependencies=[Depends(require_permission("finance.invoice"))])
def create_bill_endpoint(
    data: schemas.BillCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.service import create_bill
    lines = [line.dict() for line in data.lines]
    bill = create_bill(
        db,
        tenant_id=tenant_id,
        vendor_name=data.vendor_name,
        created_by=user.id,
        lines=lines,
        reference=data.reference,
        due_date=data.due_date
    )
    return bill


@router.get("/bills", response_model=List[schemas.BillResponse], dependencies=[Depends(require_permission("finance.view"))])
def list_bills(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.models import Bill
    return db.query(Bill).filter(Bill.tenant_id == tenant_id).all()


@router.post("/bills/{bill_id}/post", dependencies=[Depends(require_permission("finance.post"))])
def post_bill_endpoint(
    bill_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.service import post_bill
    bill = post_bill(db, bill_id, user.id, tenant_id=tenant_id)
    return {"message": "Bill posted to GL", "status": bill.status, "journal_entry_id": bill.journal_entry_id}


@router.get("/bills/{bill_id}/pdf", dependencies=[Depends(require_permission("finance.view"))])
def export_bill_pdf(
    bill_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.models import Bill, Tenant
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.tenant_id == tenant_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    tenant_name = tenant.name if tenant else "Enterprise ERP Core"

    pdf_content = generate_bill_pdf(bill, tenant_name=tenant_name)
    
    filename = f"Bill_{bill_id}.pdf"
    return StreamingResponse(
        iter([pdf_content]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.put("/bills/{bill_id}", response_model=schemas.BillResponse, dependencies=[Depends(require_permission("finance.invoice"))])
def update_bill_endpoint(
    bill_id: int,
    data: dict,  # Simplification
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.service import update_bill
    return update_bill(db, bill_id, tenant_id, data)


@router.delete("/bills/{bill_id}", dependencies=[Depends(require_permission("finance.invoice"))])
def delete_bill_endpoint(
    bill_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.service import delete_bill
    return delete_bill(db, bill_id, tenant_id)




# 🟥 REPORTS
from app.finance.report_service import (
    get_profit_and_loss,
    get_balance_sheet,
    get_trial_balance,
    get_detailed_pnl
)

@router.get("/reports/pnl", dependencies=[Depends(require_permission("finance.view"))])
def pnl_report(db: Session = Depends(get_db), tenant_id: int = Depends(get_current_tenant_id)):
    """Profit & Loss Statement"""
    return get_profit_and_loss(db, tenant_id=tenant_id)


@router.get("/reports/pnl/detailed", dependencies=[Depends(require_permission("finance.view"))])
def detailed_pnl_report(db: Session = Depends(get_db), tenant_id: int = Depends(get_current_tenant_id)):
    """Detailed P&L with account breakdown"""
    return get_detailed_pnl(db, tenant_id=tenant_id)


@router.get("/reports/balance-sheet", dependencies=[Depends(require_permission("finance.view"))])
def balance_sheet_report(db: Session = Depends(get_db), tenant_id: int = Depends(get_current_tenant_id)):
    """Balance Sheet"""
    return get_balance_sheet(db, tenant_id=tenant_id)


@router.get("/reports/trial-balance", dependencies=[Depends(require_permission("finance.view"))])
def trial_balance_report(db: Session = Depends(get_db), tenant_id: int = Depends(get_current_tenant_id)):
    """Trial Balance"""
    return get_trial_balance(db, tenant_id=tenant_id)

# 🟦 PAYMENTS & RECONCILIATION (STEP 3.2.4)
# -----------------------------

@router.post(
    "/invoices/{invoice_id}/pay",
    dependencies=[Depends(require_permission("finance.invoice"))],
)
def pay_invoice_endpoint(
    invoice_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Submits a payment for an invoice
    """
    return record_payment(
        db=db,
        tenant_id=tenant_id,
        invoice_id=invoice_id,
        amount=payload["amount"],
        payment_date=payload["date"],
        payment_method=payload["method"],
        reference=payload.get("reference"),
        user_id=user.id
    )

@router.post(
    "/bank-statements/{id}/reconcile",
    dependencies=[Depends(require_permission("finance.view"))],
)
def reconcile_endpoint(
    id: int,
    journal_entry_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Marks a bank statement line as reconciled
    """
    return reconcile_bank_statement(
        db=db,
        tenant_id=tenant_id,
        statement_id=id,
        journal_entry_id=journal_entry_id,
        user_id=user.id
    )

@router.post(
    "/bank-statements/sync",
    dependencies=[Depends(require_permission("finance.view"))],
)
def sync_bank_endpoint(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Triggers bank synchronization (Mock)
    """
    from app.finance.service import sync_bank_statements
    return sync_bank_statements(db, tenant_id=tenant_id, user_id=user.id)

@router.get(
    "/bank-statements",
    dependencies=[Depends(require_permission("finance.view"))],
)
def list_bank_statements(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.service import get_bank_statements
    return get_bank_statements(db, tenant_id=tenant_id)

@router.get("/payments", dependencies=[Depends(require_permission("finance.view"))])
def list_payments(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.finance.models import Payment
    return db.query(Payment).filter(Payment.tenant_id == tenant_id).all()
