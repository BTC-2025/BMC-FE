from app.core.database import SessionLocal, Base, engine
from app.core.tenant.models import Tenant
from app.finance.models import Account, Currency

def seed_finance():
    db = SessionLocal()
    tenant_id = 1
    
    # Accounts
    accounts = [
        {"code": "1000", "name": "Cash", "type": "ASSET"},
        {"code": "1200", "name": "Accounts Receivable", "type": "ASSET"},
        {"code": "2100", "name": "Accounts Payable", "type": "LIABILITY"},
        {"code": "4000", "name": "Sales Income", "type": "INCOME"},
        {"code": "5000", "name": "Operating Expense", "type": "EXPENSE"},
    ]
    for acc_data in accounts:
        exists = db.query(Account).filter(Account.code == acc_data["code"], Account.tenant_id == tenant_id).first()
        if not exists:
            db.add(Account(**acc_data, tenant_id=tenant_id))
    
    # Currency
    exists = db.query(Currency).filter(Currency.is_base == True, Currency.tenant_id == tenant_id).first()
    if not exists:
        db.add(Currency(code="USD", name="US Dollar", symbol="$", is_base=True, tenant_id=tenant_id))
        
    db.commit()
    db.close()
    print("Finance seeding complete")

if __name__ == "__main__":
    seed_finance()
