from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class AuditLogResponse(BaseModel):
    id: int
    tenant_id: int
    user_id: int
    action: str
    module: str
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    before: Optional[Any] = None
    after: Optional[Any] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
