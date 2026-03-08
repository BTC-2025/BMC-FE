from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ─── BOM ──────────────────────────────────────────────────────────────────────

class BOMItemCreate(BaseModel):
    raw_item_id: int
    quantity_required: float


class BOMCreate(BaseModel):
    name: str
    finished_item_id: int
    items: List[BOMItemCreate]


class BOMItemResponse(BaseModel):
    id: int
    raw_item_id: int
    quantity_required: float

    class Config:
        from_attributes = True


class BOMResponse(BaseModel):
    id: int
    name: str
    finished_item_id: int
    created_at: Optional[datetime]
    items: List[BOMItemResponse] = []

    class Config:
        from_attributes = True


# ─── WORK ORDER ───────────────────────────────────────────────────────────────

class WorkOrderCreate(BaseModel):
    bom_id: int
    quantity_to_produce: int


class WorkOrderUpdate(BaseModel):
    status: Optional[str] = None
    quantity_to_produce: Optional[int] = None


class WorkOrderResponse(BaseModel):
    id: int
    bom_id: int
    quantity_to_produce: int
    status: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── WORK CENTER ──────────────────────────────────────────────────────────────

class WorkCenterCreate(BaseModel):
    name: str
    capacity_per_day: int
    efficiency: Optional[float] = 100.0
    cost_per_hour: Optional[float] = 0.0


class WorkCenterUpdate(BaseModel):
    name: Optional[str] = None
    capacity_per_day: Optional[int] = None
    efficiency: Optional[float] = None
    cost_per_hour: Optional[float] = None


class WorkCenterResponse(BaseModel):
    id: int
    name: str
    capacity_per_day: int
    efficiency: float
    cost_per_hour: Optional[float]

    class Config:
        from_attributes = True


# ─── QUALITY INSPECTION ───────────────────────────────────────────────────────

class QualityInspectionResponse(BaseModel):
    id: int
    work_order_id: int
    inspector_id: int
    inspection_date: Optional[datetime]
    status: str

    class Config:
        from_attributes = True


# ─── COSTING ─────────────────────────────────────────────────────────────────

class CostingRecordResponse(BaseModel):
    id: int
    work_order_id: int
    material_cost_standard: float
    material_cost_actual: float
    labor_cost_standard: float
    labor_cost_actual: float
    overhead_cost: float
    total_cost_standard: float
    total_cost_actual: float
    variance: float
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── PRODUCTION SCHEDULE ──────────────────────────────────────────────────────

class ProductionScheduleResponse(BaseModel):
    id: int
    work_order_id: int
    work_center_id: int
    scheduled_start: datetime
    scheduled_end: datetime
    actual_start: Optional[datetime]
    actual_end: Optional[datetime]

    class Config:
        from_attributes = True
