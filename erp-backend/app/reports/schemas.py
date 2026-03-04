from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class ReportTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    query_type: str
    query_config: Dict[str, Any]
    default_format: str = "excel"
    is_public: bool = False


class ReportTemplateResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category: str
    query_type: str
    default_format: str
    is_public: bool
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class RunReportRequest(BaseModel):
    template_id: Optional[int] = None
    report_name: str
    format: str = "excel"  # "excel", "pdf", "csv"
    parameters: Dict[str, Any] = {}


class ScheduledReportCreate(BaseModel):
    template_id: int
    schedule_type: str  # "daily", "weekly", "monthly"
    schedule_config: Optional[Dict[str, Any]] = None
    recipients: List[str]
    is_active: bool = True
