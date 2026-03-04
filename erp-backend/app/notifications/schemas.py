from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any


class EmailTemplateCreate(BaseModel):
    name: str
    subject: str
    body_html: str
    body_text: Optional[str] = None


class NotificationPreferenceCreate(BaseModel):
    user_id: int
    event_type: str
    email_enabled: bool = True


from datetime import datetime

class SendEmailRequest(BaseModel):
    to: EmailStr
    template_name: str
    context: Dict[str, Any]
    user_id: Optional[int] = None


class NotificationResponse(BaseModel):
    id: int
    tenant_id: int
    user_id: int
    title: str
    message: str
    module: str
    event: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
