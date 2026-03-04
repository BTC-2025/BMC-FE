from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentCreate(BaseModel):
    entity_type: str
    entity_id: int
    description: Optional[str] = None


class DocumentResponse(BaseModel):
    id: int
    entity_type: str
    entity_id: int
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    version: int
    description: Optional[str]
    uploaded_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True
