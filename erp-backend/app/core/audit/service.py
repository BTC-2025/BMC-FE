from sqlalchemy.orm import Session
from app.core.audit.models import AuditLog

def log_action(
    db: Session,
    *,
    tenant_id: int,
    user_id: int,
    action: str,
    module: str,
    entity_type: str = None,
    entity_id: int = None,
    before: dict = None,
    after: dict = None,
    request = None
):
    log = AuditLog(
        tenant_id=tenant_id,
        user_id=user_id,
        action=action,
        module=module,
        entity_type=entity_type,
        entity_id=entity_id,
        before=before,
        after=after,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get("user-agent") if request else None,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
