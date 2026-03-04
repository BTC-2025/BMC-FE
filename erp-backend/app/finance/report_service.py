from sqlalchemy.orm import Session
from sqlalchemy import func
from app.finance.models import Account, JournalItem


def get_profit_and_loss(db: Session, tenant_id: int):
    """
    Profit & Loss Statement
    Income (Credit - Debit) - Expense (Debit - Credit) = Net Profit
    """
    rows = (
        db.query(
            Account.type,
            func.sum(JournalItem.debit).label("total_debit"),
            func.sum(JournalItem.credit).label("total_credit"),
        )
        .join(JournalItem, JournalItem.account_id == Account.id)
        .filter(Account.tenant_id == tenant_id)
        .filter(Account.type.in_(["INCOME", "EXPENSE"]))
        .group_by(Account.type)
        .all()
    )

    pnl = {"total_income": 0, "total_expense": 0}

    for row in rows:
        if row.type == "INCOME":
            pnl["total_income"] = float(row.total_credit or 0) - float(row.total_debit or 0)
        if row.type == "EXPENSE":
            pnl["total_expense"] = float(row.total_debit or 0) - float(row.total_credit or 0)

    pnl["net_profit"] = pnl["total_income"] - pnl["total_expense"]
    return pnl


def get_balance_sheet(db: Session, tenant_id: int):
    """
    Balance Sheet
    Assets = Liabilities + Equity
    Asset: Debit - Credit (positive = asset value)
    Liability: Credit - Debit (positive = liability value)
    Equity: Credit - Debit (positive = equity value)
    """
    rows = (
        db.query(
            Account.type,
            func.sum(JournalItem.debit).label("total_debit"),
            func.sum(JournalItem.credit).label("total_credit"),
        )
        .join(JournalItem, JournalItem.account_id == Account.id)
        .filter(Account.tenant_id == tenant_id)
        .filter(Account.type.in_(["ASSET", "LIABILITY", "EQUITY"]))
        .group_by(Account.type)
        .all()
    )

    balance = {"ASSET": 0, "LIABILITY": 0, "EQUITY": 0}

    for row in rows:
        if row.type == "ASSET":
            balance["ASSET"] = float(row.total_debit or 0) - float(row.total_credit or 0)
        elif row.type == "LIABILITY":
            balance["LIABILITY"] = float(row.total_credit or 0) - float(row.total_debit or 0)
        elif row.type == "EQUITY":
            balance["EQUITY"] = float(row.total_credit or 0) - float(row.total_debit or 0)

    # Verify accounting equation
    balance["equation_check"] = balance["ASSET"] - (balance["LIABILITY"] + balance["EQUITY"])
    
    return balance


def get_trial_balance(db: Session, tenant_id: int):
    """
    Trial Balance - All accounts with their debit/credit totals
    Sum of all debits must equal sum of all credits
    """
    rows = (
        db.query(
            Account.code,
            Account.name,
            Account.type,
            func.sum(JournalItem.debit).label("debit"),
            func.sum(JournalItem.credit).label("credit"),
        )
        .join(JournalItem, JournalItem.account_id == Account.id)
        .filter(Account.tenant_id == tenant_id)
        .group_by(Account.id, Account.code, Account.name, Account.type)
        .order_by(Account.code)
        .all()
    )

    trial_balance = []
    total_debit = 0
    total_credit = 0

    for row in rows:
        debit = float(row.debit or 0)
        credit = float(row.credit or 0)
        total_debit += debit
        total_credit += credit
        
        trial_balance.append({
            "code": row.code,
            "account": row.name,
            "type": row.type,
            "debit": debit,
            "credit": credit,
            "balance": debit - credit
        })

    return {
        "accounts": trial_balance,
        "total_debit": total_debit,
        "total_credit": total_credit,
        "balanced": round(total_debit, 2) == round(total_credit, 2)
    }


def get_detailed_pnl(db: Session, tenant_id: int):
    """
    Detailed P&L with account-level breakdown
    """
    rows = (
        db.query(
            Account.code,
            Account.name,
            Account.type,
            func.sum(JournalItem.debit).label("total_debit"),
            func.sum(JournalItem.credit).label("total_credit"),
        )
        .join(JournalItem, JournalItem.account_id == Account.id)
        .filter(Account.tenant_id == tenant_id)
        .filter(Account.type.in_(["INCOME", "EXPENSE"]))
        .group_by(Account.id, Account.code, Account.name, Account.type)
        .order_by(Account.type, Account.code)
        .all()
    )

    income_accounts = []
    expense_accounts = []
    total_income = 0
    total_expense = 0

    for row in rows:
        debit = float(row.total_debit or 0)
        credit = float(row.total_credit or 0)
        
        if row.type == "INCOME":
            amount = credit - debit
            total_income += amount
            income_accounts.append({
                "code": row.code,
                "account": row.name,
                "amount": amount
            })
        elif row.type == "EXPENSE":
            amount = debit - credit
            total_expense += amount
            expense_accounts.append({
                "code": row.code,
                "account": row.name,
                "amount": amount
            })

    return {
        "income": {
            "accounts": income_accounts,
            "total": total_income
        },
        "expense": {
            "accounts": expense_accounts,
            "total": total_expense
        },
        "net_profit": total_income - total_expense
    }
