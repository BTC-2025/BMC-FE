from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.permissions import require_permission
from app.notifications.models import EmailTemplate, NotificationPreference, NotificationLog
from app.notifications.schemas import EmailTemplateCreate, NotificationPreferenceCreate, SendEmailRequest, NotificationResponse
from typing import List, Optional
from app.notifications.service import send_email
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# ============================================================================
# EMAIL TEMPLATES
# ============================================================================

@router.post(
    "/templates",
    dependencies=[Depends(require_permission("admin"))]
)
def create_email_template(
    data: EmailTemplateCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """Create new email template (Admin only)"""
    # Check if template with same name exists for this tenant (or global)
    existing = db.query(EmailTemplate).filter(EmailTemplate.name == data.name, EmailTemplate.tenant_id == tenant_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Template with this name already exists")
    
    template = EmailTemplate(**data.dict(), tenant_id=tenant_id)
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.get(
    "/templates",
    dependencies=[Depends(require_permission("admin"))]
)
def list_email_templates(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """List all email templates (Admin only)"""
    return db.query(EmailTemplate).filter(EmailTemplate.tenant_id == tenant_id).all()


@router.get(
    "/templates/{template_name}",
    dependencies=[Depends(require_permission("admin"))]
)
def get_email_template(
    template_name: str, 
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """Get specific email template (Admin only)"""
    template = db.query(EmailTemplate).filter(EmailTemplate.name == template_name, EmailTemplate.tenant_id == tenant_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


# ============================================================================
# NOTIFICATION PREFERENCES
# ============================================================================

@router.post("/preferences")
def create_notification_preference(
    data: NotificationPreferenceCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """Create or update notification preference"""
    # Users can only set their own preferences
    if data.user_id != user.id and not user.is_admin:
        raise HTTPException(status_code=403, detail="Can only set your own preferences")
    
    # Check if preference exists
    existing = db.query(NotificationPreference).filter(
        NotificationPreference.user_id == data.user_id,
        NotificationPreference.event_type == data.event_type,
        NotificationPreference.tenant_id == tenant_id
    ).first()
    
    if existing:
        existing.email_enabled = data.email_enabled
        db.commit()
        db.refresh(existing)
        return existing
    else:
        pref = NotificationPreference(**data.dict(), tenant_id=tenant_id)
        db.add(pref)
        db.commit()
        db.refresh(pref)
        return pref


@router.get("/preferences")
def get_my_preferences(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """Get current user's notification preferences"""
    return db.query(NotificationPreference).filter(
        NotificationPreference.user_id == user.id,
        NotificationPreference.tenant_id == tenant_id
    ).all()


# ============================================================================
# SEND EMAIL (Manual Trigger)
# ============================================================================

@router.post(
    "/send",
    dependencies=[Depends(require_permission("admin"))]
)
def send_email_manual(
    data: SendEmailRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """Manually send email using template (Admin only)"""
    success = send_email(
        db=db,
        tenant_id=tenant_id,
        to=data.to,
        template_name=data.template_name,
        context=data.context,
        user_id=data.user_id
    )
    
    if success:
        return {"status": "sent", "message": "Email sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")


# ============================================================================
# IN-APP NOTIFICATIONS
# ============================================================================

@router.get("", response_model=List[NotificationResponse])
def get_my_notifications(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """Retrieve current user's in-app notifications"""
    from app.notifications.models import Notification
    return db.query(Notification).filter(
        Notification.user_id == user.id,
        Notification.tenant_id == tenant_id
    ).order_by(Notification.created_at.desc()).limit(50).all()

@router.post("/{id}/read")
def mark_notification_as_read(
    id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """Mark a notification as read"""
    from app.notifications.models import Notification
    n = db.query(Notification).filter(
        Notification.id == id,
        Notification.user_id == user.id,
        Notification.tenant_id == tenant_id
    ).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    n.is_read = True
    db.commit()
    return {"status": "ok"}
