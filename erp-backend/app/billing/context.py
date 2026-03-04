from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.tenant.context import get_current_tenant_id
from app.billing.models import Subscription, Plan, SubscriptionStatus
from app.core.database import get_db
from app.auth.models import User

def get_active_subscription(
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Subscription:
    """
    Dependency that ensures the tenant has an active subscription.
    Returns the subscription object.
    """
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.tenant_id == tenant_id,
            Subscription.status == SubscriptionStatus.ACTIVE.value
        )
        .first()
    )

    if not sub:
        # For development/seed, if no sub exists, we might default to FREE or raise error.
        # Strict mode: Raise error.
        raise HTTPException(
            status_code=402, 
            detail="Payment Required: No active subscription found for this tenant."
        )

    return sub

def require_bi_access(
    sub: Subscription = Depends(get_active_subscription),
    db: Session = Depends(get_db),
):
    """
    Dependency to verify BI module access.
    """
    # Fetch Plan details
    plan = db.query(Plan).get(sub.plan_id)
    if not plan or not plan.has_module("bi"):
        raise HTTPException(
            status_code=403,
            detail="Feature Not Included: BI Analytics is not part of your current plan."
        )
    return True

def check_user_limit(
    tenant_id: int,
    db: Session,
):
    """
    Helper to check if a new user can be added.
    """
    # 1. Get Subscription manually (not as dependency, called from service)
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.tenant_id == tenant_id,
            Subscription.status == SubscriptionStatus.ACTIVE.value
        )
        .first()
    )
    
    if not sub:
        raise HTTPException(status_code=402, detail="No active subscription")

    plan = db.query(Plan).get(sub.plan_id)
    
    # 2. Count current users
    current_count = db.query(User).filter(User.tenant_id == tenant_id).count()
    
    if current_count >= plan.max_users:
        raise HTTPException(
            status_code=403,
            detail=f"User Limit Reached: Your plan allows maximum {plan.max_users} users. Upgrade to add more."
        )
    return True
