from pydantic import BaseModel
from typing import List


class SupplierCreate(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None

class SupplierUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None


class POItemCreate(BaseModel):
    item_id: int
    quantity: int


class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    items: List[POItemCreate]

class PurchaseOrderUpdate(BaseModel):
    status: str | None = None


class POItemResponse(BaseModel):
    id: int
    item_id: int
    quantity_ordered: int
    quantity_received: int

    class Config:
        from_attributes = True


class PurchaseOrderResponse(BaseModel):
    id: int
    supplier_id: int
    status: str
    created_at: object
    items: List[POItemResponse]

    class Config:
        from_attributes = True


class ReceiveGoodsRequest(BaseModel):
    purchase_order_id: int
    warehouse_id: int


class ShipmentCreate(BaseModel):
    origin_code: str
    carrier: str
    status: str | None = "PACKED"

class ShipmentUpdate(BaseModel):
    origin_code: str | None = None
    carrier: str | None = None
    status: str | None = None


class ShipmentResponse(BaseModel):
    id: int
    tracking_number: str
    origin_code: str
    carrier: str
    status: str
    created_at: object

    class Config:
        from_attributes = True


# Sales Order
class SalesOrderItemCreate(BaseModel):
    item_id: int
    quantity: float
    unit_price: float

class SalesOrderItemResponse(BaseModel):
    id: int
    item_id: int
    quantity: float
    unit_price: float

    class Config:
        from_attributes = True

class SalesOrderCreate(BaseModel):
    customer_name: str
    items: List[SalesOrderItemCreate]

class SalesOrderUpdate(BaseModel):
    customer_name: str | None = None
    status: str | None = None

class SalesOrderResponse(BaseModel):
    id: int
    customer_name: str
    status: str
    total_amount: float
    created_at: object
    items: List[SalesOrderItemResponse]

    class Config:
        from_attributes = True
