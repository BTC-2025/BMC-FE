from pydantic import BaseModel
from typing import List


class BOMItemCreate(BaseModel):
    raw_item_id: int
    quantity_required: float


class BOMCreate(BaseModel):
    name: str
    finished_item_id: int
    items: List[BOMItemCreate]


class WorkOrderCreate(BaseModel):
    bom_id: int
    quantity_to_produce: int
