from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class WorkOrderBase(BaseModel):
    wo_number: str
    item_id: int
    quantity_planned: float
    status: Optional[str] = "Draft"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class WorkOrderCreate(WorkOrderBase):
    pass

class WorkOrder(WorkOrderBase):
    id: int
    quantity_produced: float
    timestamp: datetime
    class Config:
        from_attributes = True

class BOMBase(BaseModel):
    item_id: int
    name: str
    components: List[dict] # {item_id: int, quantity: float}

class BOMCreate(BOMBase):
    pass

class BOM(BOMBase):
    id: int
    class Config:
        from_attributes = True
