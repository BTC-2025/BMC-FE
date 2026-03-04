from sqlalchemy import (
    Column, Integer, String, ForeignKey, DateTime, Numeric, Date, Boolean
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class Category(Base):
    __tablename__ = "inventory_categories"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    items = relationship("Item", back_populates="category")


class ItemGroup(Base):
    __tablename__ = "inventory_item_groups"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    items = relationship("Item", back_populates="item_group")


class PriceList(Base):
    __tablename__ = "inventory_price_lists"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # SALES, PURCHASE, INTERNAL
    currency = Column(String, default="USD")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    price_items = relationship("PriceListItem", back_populates="price_list")


class PriceListItem(Base):
    __tablename__ = "inventory_price_list_items"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    price_list_id = Column(Integer, ForeignKey("inventory_price_lists.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)

    price_list = relationship("PriceList", back_populates="price_items")
    item = relationship("Item")


class Item(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=False, index=True)
    unit = Column(String, nullable=False)
    reorder_level = Column(Integer, default=0)
    valuation_rate = Column(Numeric(12, 2), default=0.0)
    barcode_value = Column(String, unique=True, nullable=True) # Defaults to SKU if not set
    track_type = Column(String, default="STANDARD") # STANDARD, BATCH, SERIAL
    is_active = Column(Integer, default=1)
    
    category_id = Column(Integer, ForeignKey("inventory_categories.id"), nullable=True)
    category = relationship("Category", back_populates="items")
    
    item_group_id = Column(Integer, ForeignKey("inventory_item_groups.id"), nullable=True)
    item_group = relationship("ItemGroup", back_populates="items")

    movements = relationship("StockMovement", back_populates="item")


class Warehouse(Base):
    __tablename__ = "inventory_warehouses"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("inventory_warehouses.id"), nullable=True)

    parent = relationship("Warehouse", remote_side=[id])
    movements = relationship("StockMovement", back_populates="warehouse")
    bins = relationship("Bin", back_populates="warehouse")


class Bin(Base):
    __tablename__ = "inventory_bins"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    warehouse_id = Column(Integer, ForeignKey("inventory_warehouses.id"), nullable=False)
    code = Column(String, nullable=False)

    warehouse = relationship("Warehouse", back_populates="bins")


class StockMovement(Base):
    __tablename__ = "inventory_stock_movements"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("inventory_warehouses.id"), nullable=False)

    quantity = Column(Numeric(12, 2), nullable=False)  # +IN / -OUT
    movement_type = Column(String, nullable=False)  # IN | OUT | TRANSFER | ADJUST (ref_type)

    # Reference Tracking
    ref_type = Column(String, nullable=True) # PO, SO, ADJUST, TRANSFER
    ref_id = Column(Integer, nullable=True)
    
    reference = Column(String, nullable=True)
    work_order_id = Column(Integer, nullable=True) # For mfg costing integration
    unit_cost = Column(Numeric(12, 2), default=0.0)
    
    # Granular Tracking (Phase 4.1)
    bin_id = Column(Integer, ForeignKey("inventory_bins.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("inventory_batches.id"), nullable=True)
    serial_id = Column(Integer, ForeignKey("inventory_serial_numbers.id"), nullable=True)

    performed_by = Column(Integer, nullable=False)  # user_id
    created_at = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item", back_populates="movements")
    warehouse = relationship("Warehouse", back_populates="movements")
    bin = relationship("Bin")


# -----------------------------
# BATCH & SERIAL TRACKING (STEP 4.1.1)
# -----------------------------

class Batch(Base):
    __tablename__ = "inventory_batches"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)

    batch_number = Column(String, nullable=False) # Removed unique here, usually unique per tenant+item
    manufacturing_date = Column(Date)
    expiry_date = Column(Date)
    
    # Current stock in this batch
    quantity = Column(Numeric(12, 2), default=0) 

    # Audit
    created_at = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item")


class SerialNumber(Base):
    __tablename__ = "inventory_serial_numbers"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)

    serial_number = Column(String, nullable=False)
    status = Column(String, default="IN_STOCK")  # IN_STOCK, SOLD, DEFECTIVE, SCRAPPED
    
    # Link to movement when it was created/last moved
    last_movement_id = Column(Integer, ForeignKey("inventory_stock_movements.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item")


# -----------------------------
# ASSEMBLIES (STEP 5.1)
# -----------------------------

class Assembly(Base):
    __tablename__ = "inventory_assemblies"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    
    # The item that is produced (Finished Good)
    finished_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    finished_item = relationship("Item", foreign_keys=[finished_item_id])
    bom_items = relationship("AssemblyBOM", back_populates="assembly", cascade="all, delete-orphan")


class AssemblyBOM(Base):
    __tablename__ = "inventory_assembly_bom"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    assembly_id = Column(Integer, ForeignKey("inventory_assemblies.id"), nullable=False)
    
    # Component item
    component_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False)

    assembly = relationship("Assembly", back_populates="bom_items")
    component_item = relationship("Item", foreign_keys=[component_item_id])
