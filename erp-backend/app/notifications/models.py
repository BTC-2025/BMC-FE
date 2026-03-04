from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base


class EmailTemplate(Base):
    """Email templates with Jinja2 support"""
    __tablename__ = "email_templates"
    
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True, index=True) # Null = System/Global
    name = Column(String, unique=True, nullable=False, index=True)  # e.g., "invoice_created"
    subject = Column(String, nullable=False)
    body_html = Column(Text, nullable=False)  # Jinja2 template
    body_text = Column(Text, nullable=True)   # Plain text fallback
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class NotificationPreference(Base):
    """User notification preferences"""
    __tablename__ = "notification_preferences"
    
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    event_type = Column(String, nullable=False)  # "invoice", "leave", "task"
    
    email_enabled = Column(Boolean, default=True)
    # Future: sms_enabled, push_enabled
    
    created_at = Column(DateTime, default=datetime.utcnow)


class NotificationLog(Base):
    """Log of all sent notifications for audit"""
    __tablename__ = "notification_logs"
    
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    recipient_email = Column(String, nullable=False)
    
    event_type = Column(String, nullable=False)
    template_name = Column(String, nullable=False)
    
    subject = Column(String, nullable=False)
    status = Column(String, nullable=False)  # SENT, FAILED, PENDING
    
    error_message = Column(Text, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    """In-app notifications"""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)

    title = Column(String)
    message = Column(String)
    module = Column(String)       # finance, hrm, crm
    event = Column(String)        # invoice.posted

    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
