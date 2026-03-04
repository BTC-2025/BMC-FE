from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)

    action = Column(String)        # "invoice.posted"
    module = Column(String)        # finance, inventory, hrm
    entity_type = Column(String)   # Invoice, Item, Employee
    entity_id = Column(Integer, nullable=True)

    before = Column(JSON, nullable=True)
    after = Column(JSON, nullable=True)

    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
