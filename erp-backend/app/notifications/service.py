import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from app.core.config import settings
from app.notifications.models import EmailTemplate, NotificationLog, NotificationPreference


def get_template(db: Session, template_name: str, tenant_id: int) -> Optional[EmailTemplate]:
    """Retrieve email template by name"""
    # Prefer tenant-specific template, fallback to global (tenant_id is Null)
    return db.query(EmailTemplate).filter(
        EmailTemplate.name == template_name,
        (EmailTemplate.tenant_id == tenant_id) | (EmailTemplate.tenant_id.is_(None))
    ).order_by(EmailTemplate.tenant_id.desc()).first()


def render_template(template: EmailTemplate, context: Dict[str, Any]) -> tuple[str, str]:
    """Render Jinja2 template with context"""
    subject = Template(template.subject).render(**context)
    body_html = Template(template.body_html).render(**context)
    return subject, body_html


def send_email(
    db: Session,
    tenant_id: int,
    to: str,
    template_name: str,
    context: Dict[str, Any],
    user_id: Optional[int] = None
) -> bool:
    """
    Send email using template
    
    Args:
        db: Database session
        to: Recipient email
        template_name: Name of email template
        context: Template context variables
        user_id: Optional user ID for logging
    
    Returns:
        True if sent successfully, False otherwise
    """
    
    # Check user preferences if user_id provided
    if user_id:
        pref = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == user_id,
            NotificationPreference.tenant_id == tenant_id,
            NotificationPreference.event_type == template_name.split('_')[0]  # e.g., "invoice" from "invoice_created"
        ).first()
        
        if pref and not pref.email_enabled:
            # User has disabled email notifications for this event type
            return False
    
    # Get template
    template = get_template(db, template_name, tenant_id=tenant_id)
    if not template:
        print(f"Template '{template_name}' not found")
        return False
    
    # Render template
    subject, body_html = render_template(template, context)
    
    # Create log entry
    log = NotificationLog(
        tenant_id=tenant_id,
        user_id=user_id,
        recipient_email=to,
        event_type=template_name,
        template_name=template_name,
        subject=subject,
        status="PENDING"
    )
    db.add(log)
    db.commit()
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = settings.SMTP_FROM
        msg['To'] = to
        
        # Attach HTML body
        msg.attach(MIMEText(body_html, 'html'))
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        # Update log
        log.status = "SENT"
        log.sent_at = datetime.utcnow()
        db.commit()
        
        return True
        
    except Exception as e:
        # Update log with error
        log.status = "FAILED"
        log.error_message = str(e)
        db.commit()
        
        print(f"Failed to send email: {e}")
        return False


def notify(
    db: Session,
    *,
    tenant_id: int,
    user_ids: list[int],
    title: str,
    message: str,
    module: str,
    event: str,
    email_template: Optional[str] = None,
    email_context: Optional[Dict[str, Any]] = None
):
    """
    Centralized notification dispatcher.
    Handles In-App persistence and optional Email triggers.
    """
    from app.notifications.models import Notification
    from app.auth.models import User

    # 1. Persist In-App Notifications
    for uid in user_ids:
        n = Notification(
            tenant_id=tenant_id,
            user_id=uid,
            title=title,
            message=message,
            module=module,
            event=event
        )
        db.add(n)
    
    db.commit()

    # 2. Trigger External Channels (Email)
    if email_template:
        users = db.query(User).filter(User.id.in_(user_ids)).all()
        for u in users:
            if u.email:
                send_email(
                    db=db,
                    tenant_id=tenant_id,
                    to=u.email,
                    template_name=email_template,
                    context=email_context or {},
                    user_id=u.id
                )

def send_invoice_created_notification(db: Session, tenant_id: int, invoice_id: int, customer_email: str):
    """Send notification when invoice is created"""
    from app.finance.models import Invoice
    
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.tenant_id == tenant_id).first()
    if not invoice:
        return
    
    context = {
        "invoice_id": invoice.id,
        "customer_name": invoice.customer_name,
        "total_amount": float(invoice.total_amount),
        "invoice_date": invoice.invoice_date.strftime("%Y-%m-%d"),
        "due_date": invoice.due_date.strftime("%Y-%m-%d") if invoice.due_date else "N/A"
    }
    
    # Send both in-app (to creator) and email (to customer)
    notify(
        db,
        tenant_id=tenant_id,
        user_ids=[invoice.created_by],
        title="Invoice Created",
        message=f"Invoice #{invoice.id} for {invoice.customer_name} has been initialized.",
        module="finance",
        event="invoice.created",
        email_template="invoice_created",
        email_context=context
    )

def send_leave_approved_notification(db: Session, tenant_id: int, leave_id: int):
    """Send notification when leave is approved"""
    from app.hrm.models import LeaveRequest, Employee
    
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id, LeaveRequest.tenant_id == tenant_id).first()
    if not leave:
        return
    
    employee = db.query(Employee).filter(Employee.id == leave.employee_id, Employee.tenant_id == tenant_id).first()
    if not employee:
        return
    
    context = {
        "employee_name": employee.name,
        "leave_type": leave.leave_type,
        "start_date": leave.start_date.strftime("%Y-%m-%d"),
        "end_date": leave.end_date.strftime("%Y-%m-%d"),
        "days": (leave.end_date - leave.start_date).days + 1
    }
    
    notify(
        db,
        tenant_id=tenant_id,
        user_ids=[employee.id], # Assuming employee ID matches User ID for simplistic notification link
        title="Leave Approved",
        message=f"Your {leave.leave_type} leave from {context['start_date']} is approved.",
        module="hrm",
        event="leave.approved",
        email_template="leave_approved",
        email_context=context
    )
