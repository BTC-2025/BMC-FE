from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime
from app.core.database import Base
import enum

class TenantStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    domain = Column(String, unique=True, nullable=True, index=True)
    status = Column(String, default=TenantStatus.ACTIVE.value)  # ACTIVE | SUSPENDED
    created_at = Column(DateTime, default=datetime.utcnow)
