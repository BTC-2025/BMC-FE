from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class ItemCreate(BaseModel):
    name: str
    sku: str
    unit: str
    reorder_level: int = 0
    valuation_rate: Optional[float] = 0.0
    category_id: Optional[int] = None
    item_group_id: Optional[int] = None

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    reorder_level: Optional[int] = None
    valuation_rate: Optional[float] = None
    is_active: Optional[int] = None
    category_id: Optional[int] = None
    item_group_id: Optional[int] = None

class WarehouseCreate(BaseModel):
    name: str
    parent_id: Optional[int] = None

class WarehouseResponse(BaseModel):
    id: int
    name: str
    parent_id: Optional[int] = None

    class Config:
        from_attributes = True


class StockAdjust(BaseModel):
    item_id: int
    warehouse_id: int
    bin_id: Optional[int] = None
    quantity: float
    reference: Optional[str] = None


class StockTransfer(BaseModel):
    item_id: int
    from_warehouse: int
    to_warehouse: int
    from_bin: Optional[int] = None
    to_bin: Optional[int] = None
    quantity: float


class StockAuditRow(BaseModel):
    item_id: int
    warehouse_id: int
    bin_id: Optional[int] = None
    quantity: float
    movement_type: str
    ref_type: Optional[str] = None
    reference: Optional[str]
    performed_by: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Item Groups
class ItemGroupCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ItemGroupResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


# Price Lists
class PriceListCreate(BaseModel):
    name: str
    type: str  # SALES, PURCHASE, INTERNAL
    currency: str = "USD"

class PriceListResponse(BaseModel):
    id: int
    name: str
    type: str
    currency: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PriceListItemCreate(BaseModel):
    item_id: int
    price: float

class PriceListItemResponse(BaseModel):
    id: int
    price_list_id: int
    item_id: int
    price: float

    class Config:
        from_attributes = True


# Assemblies
class ItemSmallResponse(BaseModel):
    id: int
    name: str
    sku: str

    class Config:
        from_attributes = True

class AssemblyBOMItem(BaseModel):
    component_item_id: int
    quantity: float

class AssemblyBOMResponse(BaseModel):
    id: int
    component_item_id: int
    quantity: float
    component_item: ItemSmallResponse

    class Config:
        from_attributes = True

class AssemblyCreate(BaseModel):
    name: str
    finished_item_id: int
    items: list[AssemblyBOMItem]

class AssemblyResponse(BaseModel):
    id: int
    name: str
    finished_item_id: int
    finished_item: ItemSmallResponse
    bom_items: list[AssemblyBOMResponse]
    created_at: datetime

    class Config:
        from_attributes = True

class AssemblyBuildRequest(BaseModel):
    assembly_id: int
    quantity: float
    warehouse_id: int
