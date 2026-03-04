from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.permissions import require_permission
from app.core.audit.models import AuditLog
from app.core.audit.schemas import AuditLogResponse

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("/logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    module: Optional[str] = None,
    action: Optional[str] = None,
    limit: int = 200,
    db: Session = Depends(get_db),
    user = Depends(require_permission("audit.view"))
):
    query = db.query(AuditLog).filter(AuditLog.tenant_id == user.tenant_id)
    
    if module:
        query = query.filter(AuditLog.module == module)
    if action:
        query = query.filter(AuditLog.action == action)
        
    return query.order_by(AuditLog.created_at.desc()).limit(limit).all()
