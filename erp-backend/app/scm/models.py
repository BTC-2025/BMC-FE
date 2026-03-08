from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Numeric
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


# -----------------------------
# SUPPLIER
# -----------------------------
class Supplier(Base):
    __tablename__ = "scm_suppliers"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    # Enterprise-only extensions:
    rating = Column(Integer, nullable=True)
    bank_details = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")


# -----------------------------
# PURCHASE ORDER
# -----------------------------
class PurchaseOrder(Base):
    __tablename__ = "scm_purchase_orders"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("scm_suppliers.id"), nullable=False)

    status = Column(
        String,
        default="DRAFT",
        nullable=False
    )  
    # DRAFT → PENDING_APPROVAL → APPROVED → PARTIALLY_RECEIVED → CLOSED

    created_at = Column(DateTime, default=datetime.utcnow)
    approved_by = Column(Integer, nullable=True)

    supplier = relationship("Supplier", back_populates="purchase_orders")
    items = relationship(
        "PurchaseOrderItem",
        back_populates="purchase_order",
        cascade="all, delete-orphan"
    )


# -----------------------------
# PO ITEMS
# -----------------------------
class PurchaseOrderItem(Base):
    __tablename__ = "scm_po_items"

    id = Column(Integer, primary_key=True)
    # Inherits tenant context from PO
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True) 
    purchase_order_id = Column(
        Integer, ForeignKey("scm_purchase_orders.id"), nullable=False
    )

    item_id = Column(Integer, nullable=False)  # Inventory Item ID
    quantity_ordered = Column(Integer, nullable=False)
    quantity_received = Column(Integer, default=0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")


# -----------------------------
# GOODS RECEIPT (GRN)
# -----------------------------
class GoodsReceipt(Base):
    __tablename__ = "scm_goods_receipts"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    purchase_order_id = Column(Integer, ForeignKey("scm_purchase_orders.id"))
    received_by = Column(Integer, nullable=False)
    received_at = Column(DateTime, default=datetime.utcnow)


# -----------------------------
# SHIPMENT (Outbound)
# -----------------------------
class Shipment(Base):
    __tablename__ = "scm_shipments"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    
    tracking_number = Column(String, unique=True, nullable=False)
    origin_code = Column(String, nullable=False)  # e.g., SO-1204
    carrier = Column(String, nullable=False)       # FedEx, UPS, DHL, etc.
    status = Column(String, default="PACKED")      # PACKED → IN_TRANSIT → SHIPPED → DELIVERED
    
    shipping_date = Column(DateTime, nullable=True)
    estimated_arrival = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    initialized_by = Column(Integer, nullable=False)


# -----------------------------
# SALES ORDER (SO)
# -----------------------------
class SalesOrder(Base):
    __tablename__ = "scm_sales_orders"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Simple customer name or ID (can be expanded later)
    customer_name = Column(String, nullable=False)
    
    status = Column(
        String,
        default="PENDING",
        nullable=False
    )
    # PENDING → CONFIRMED → PROCESSING → FULFILLED → CANCELLED

    total_amount = Column(Numeric(12, 2), default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship(
        "SalesOrderItem",
        back_populates="sales_order",
        cascade="all, delete-orphan"
    )


class SalesOrderItem(Base):
    __tablename__ = "scm_so_items"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    sales_order_id = Column(Integer, ForeignKey("scm_sales_orders.id"), nullable=False)
    
    item_id = Column(Integer, nullable=False)  # Inventory Item ID
    quantity = Column(Numeric(12, 2), nullable=False)
    unit_price = Column(Numeric(12, 2), nullable=False)

    sales_order = relationship("SalesOrder", back_populates="items")
