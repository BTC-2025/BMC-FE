from sqlalchemy import (
    Column, Integer, String, ForeignKey, Numeric, DateTime
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


# -----------------------------
# BILL OF MATERIALS (BOM)
# -----------------------------
# -----------------------------
# BILL OF MATERIALS (BOM)
# -----------------------------
class BOM(Base):
    __tablename__ = "mfg_boms"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    finished_item_id = Column(Integer, nullable=False)  # Inventory Item ID
    name = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship(
        "BOMItem",
        back_populates="bom",
        cascade="all, delete-orphan"
    )


# -----------------------------
# BOM ITEMS
# -----------------------------
class BOMItem(Base):
    __tablename__ = "mfg_bom_items"

    id = Column(Integer, primary_key=True)
    # Inherit tenant from BOM usually, but good to have
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    bom_id = Column(Integer, ForeignKey("mfg_boms.id"), nullable=False)

    raw_item_id = Column(Integer, nullable=False)  # Inventory Item ID
    quantity_required = Column(Numeric(10, 2), nullable=False)

    bom = relationship("BOM", back_populates="items")


# -----------------------------
# WORK ORDER
# -----------------------------
class WorkOrder(Base):
    __tablename__ = "mfg_work_orders"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    bom_id = Column(Integer, ForeignKey("mfg_boms.id"), nullable=False)

    quantity_to_produce = Column(Integer, nullable=False)
    status = Column(
        String,
        default="PLANNED",
        nullable=False
    )
    # PLANNED → IN_PROGRESS → COMPLETED

    created_at = Column(DateTime, default=datetime.utcnow)

    materials = relationship("WorkOrderMaterial", back_populates="work_order")


# -----------------------------
# WORK ORDER MATERIAL CONSUMPTION
# -----------------------------
class WorkOrderMaterial(Base):
    __tablename__ = "mfg_work_order_materials"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    work_order_id = Column(
        Integer, ForeignKey("mfg_work_orders.id"), nullable=False
    )

    raw_item_id = Column(Integer, nullable=False)
    quantity_consumed = Column(Numeric(10, 2), nullable=False)

    work_order = relationship("WorkOrder", back_populates="materials")


# -----------------------------
# WORK CENTERS & ROUTING (STEP 2.1)
# -----------------------------

class WorkCenter(Base):
    __tablename__ = "mfg_work_centers"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)

    name = Column(String, nullable=False)
    capacity_per_day = Column(Integer, nullable=False)
    efficiency = Column(Numeric(5, 2), default=100.0)
    cost_per_hour = Column(Numeric(10, 2))


class Operation(Base):
    __tablename__ = "mfg_operations"

    id = Column(Integer, primary_key=True)
    # Corrected tenant_id to match common pattern
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    bom_id = Column(Integer, ForeignKey("mfg_boms.id"), nullable=False)
    sequence = Column(Integer, nullable=False)  # 1, 2, 3...
    work_center_id = Column(Integer, ForeignKey("mfg_work_centers.id"), nullable=False)

    operation_name = Column(String, nullable=False)
    time_standard = Column(Numeric(10, 2), nullable=False)  # hours


class ProductionSchedule(Base):
    __tablename__ = "mfg_production_schedules"

    id = Column(Integer, primary_key=True)
    # Corrected tenant_id to match common pattern
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    work_order_id = Column(Integer, ForeignKey("mfg_work_orders.id"), nullable=False)
    work_center_id = Column(Integer, ForeignKey("mfg_work_centers.id"), nullable=False)

    scheduled_start = Column(DateTime, nullable=False)
    scheduled_end = Column(DateTime, nullable=False)

    actual_start = Column(DateTime, nullable=True)
    actual_end = Column(DateTime, nullable=True)


# -----------------------------
# QUALITY CONTROL (STEP 2.2)
# -----------------------------

class QualityParameter(Base):
    __tablename__ = "mfg_quality_parameters"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)

    parameter_name = Column(String, nullable=False)  # Weight, Dimension
    min_value = Column(Numeric(10, 2))
    max_value = Column(Numeric(10, 2))
    unit = Column(String)


class QualityInspection(Base):
    __tablename__ = "mfg_quality_inspections"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    work_order_id = Column(Integer, ForeignKey("mfg_work_orders.id"), nullable=False)
    inspector_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    inspection_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="PENDING")  # PASS | FAIL | PENDING


class QualityInspectionResult(Base):
    __tablename__ = "mfg_quality_results"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    inspection_id = Column(Integer, ForeignKey("mfg_quality_inspections.id"), nullable=False)
    parameter_id = Column(Integer, ForeignKey("mfg_quality_parameters.id"), nullable=False)

    measured_value = Column(Numeric(10, 2))
    result = Column(String)  # PASS | FAIL


# -----------------------------
# PRODUCTION COSTING (STEP 2.3)
# -----------------------------

class CostingRecord(Base):
    __tablename__ = "mfg_costing_records"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    work_order_id = Column(Integer, ForeignKey("mfg_work_orders.id"), nullable=False)

    material_cost_standard = Column(Numeric(12, 2), default=0.0)
    material_cost_actual = Column(Numeric(12, 2), default=0.0)

    labor_cost_standard = Column(Numeric(12, 2), default=0.0)
    labor_cost_actual = Column(Numeric(12, 2), default=0.0)

    overhead_cost = Column(Numeric(12, 2), default=0.0)

    total_cost_standard = Column(Numeric(12, 2), default=0.0)
    total_cost_actual = Column(Numeric(12, 2), default=0.0)
    variance = Column(Numeric(12, 2), default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)
