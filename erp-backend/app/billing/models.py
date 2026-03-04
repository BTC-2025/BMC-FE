from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from datetime import datetime, timedelta
from app.core.database import Base
import enum

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)  # FREE, STARTER, ENTERPRISE
    price = Column(Integer, nullable=False)  # monthly price in cents or smallest currency unit
    max_users = Column(Integer, nullable=False)
    modules = Column(String, nullable=False)  # CSV: inventory,crm,bi,...
    
    # Validation helpers
    def has_module(self, module_name: str) -> bool:
        return module_name.lower() in [m.strip().lower() for m in self.modules.split(",")]


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    SUSPENDED = "SUSPENDED"
    CANCELLED = "CANCELLED"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), unique=True) # One active sub per tenant ideally
    plan_id = Column(Integer, ForeignKey("plans.id"))

    status = Column(String, default=SubscriptionStatus.ACTIVE.value)
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True) # Null = Lifetime/Manual
    
    # Payment gateway reference
    stripe_subscription_id = Column(String, nullable=True)
