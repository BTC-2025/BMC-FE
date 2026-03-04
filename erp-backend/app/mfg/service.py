from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.mfg.models import (
    BOM, WorkOrder, WorkOrderMaterial, 
    QualityInspection, QualityInspectionResult, QualityParameter,
    CostingRecord, Operation, WorkCenter
)
from app.inventory.models import Item
from app.inventory.service import (
    get_current_stock,
    create_stock_movement
)
from app.inventory.models import StockMovement


def process_production(
    db: Session,
    *,
    tenant_id: int,
    work_order_id: int,
    warehouse_id: int,
    performed_by: int,
):
    wo = db.query(WorkOrder).filter(WorkOrder.id == work_order_id, WorkOrder.tenant_id == tenant_id).first()
    if not wo or wo.status != "PLANNED":
        raise HTTPException(status_code=400, detail="Invalid work order")

    bom = db.query(BOM).filter(BOM.id == wo.bom_id, BOM.tenant_id == tenant_id).first()
    if not bom:
        raise HTTPException(status_code=404, detail="BOM not found")

    # -------------------------
    # CHECK QUALITY CONTROL (STEP 2.2.3)
    # -------------------------
    inspection = (
        db.query(QualityInspection)
        .filter(
            QualityInspection.work_order_id == work_order_id,
            QualityInspection.tenant_id == wo.tenant_id
        )
        .order_by(QualityInspection.inspection_date.desc())
        .first()
    )
    
    if not inspection or inspection.status != "PASS":
        raise HTTPException(
            status_code=400, 
            detail="Production blocked: No PASSING Quality Inspection found for this Work Order."
        )

    # -------------------------
    # VERIFY RAW MATERIALS
    # -------------------------
    for item in bom.items:
        required_qty = item.quantity_required * wo.quantity_to_produce
        available = get_current_stock(
            db,
            tenant_id=wo.tenant_id,
            item_id=item.raw_item_id,
            warehouse_id=warehouse_id,
        )
        if available < required_qty:
            raise HTTPException(
                status_code=409,
                detail=f"Insufficient stock for item {item.raw_item_id}"
            )

    try:
        wo.status = "IN_PROGRESS"

        # -------------------------
        # CONSUME RAW MATERIALS
        # -------------------------
        for item in bom.items:
            qty = float(item.quantity_required * wo.quantity_to_produce)

            # Retrieve unit cost for costing
            raw_item = db.query(Item).filter(Item.id == item.raw_item_id, Item.tenant_id == tenant_id).first()
            unit_cost = float(raw_item.valuation_rate or 0)

            create_stock_movement(
                db,
                tenant_id=wo.tenant_id,
                item_id=item.raw_item_id,
                warehouse_id=warehouse_id,
                quantity=-qty,
                movement_type="OUT",
                performed_by=performed_by,
                reference=f"WO-{wo.id}",
                work_order_id=wo.id,
                unit_cost=unit_cost,
            )

            wom = WorkOrderMaterial(
                work_order_id=wo.id,
                tenant_id=tenant_id,
                raw_item_id=item.raw_item_id,
                quantity_consumed=qty,
            )
            db.add(wom)

        # -------------------------
        # PRODUCE FINISHED GOOD
        # -------------------------
        # Retrieve unit cost for finished good
        fg_item = db.query(Item).filter(Item.id == bom.finished_item_id, Item.tenant_id == tenant_id).first()
        fg_unit_cost = float(fg_item.valuation_rate or 0)

        create_stock_movement(
            db,
            tenant_id=wo.tenant_id,
            item_id=bom.finished_item_id,
            warehouse_id=warehouse_id,
            quantity=float(wo.quantity_to_produce),
            movement_type="IN",
            performed_by=performed_by,
            reference=f"WO-{wo.id}",
            work_order_id=wo.id,
            unit_cost=fg_unit_cost,
        )

        wo.status = "COMPLETED"

        db.commit()
        db.refresh(wo)

        # -------------------------
        # CALCULATE COSTING (STEP 2.3)
        # -------------------------
        calculate_production_cost(db=db, work_order_id=wo.id, tenant_id=tenant_id)

        from app.core.audit.service import log_audit
        log_audit(
            db,
            tenant_id=tenant_id,
            module="MANUFACTURING",
            action="PRODUCTION_COMPLETE",
            reference_id=str(wo.id),
            user_id=performed_by
        )

        return wo

    except Exception:
        db.rollback()
        raise


# -----------------------------
# PRODUCTION SCHEDULING (STEP 2.1.2)
# -----------------------------
from datetime import timedelta
from app.mfg.models import Operation, ProductionSchedule

def schedule_work_order(
    *,
    work_order_id: int,
    start_date,
    db: Session,
    tenant_id: int,
):
    """
    Schedules production steps sequentially based on BOM Operations
    """
    work_order = db.query(WorkOrder).filter(WorkOrder.id == work_order_id, WorkOrder.tenant_id == tenant_id).first()
    if not work_order:
        raise HTTPException(status_code=404, detail="Work order not found")

    operations = (
        db.query(Operation)
        .filter(Operation.bom_id == work_order.bom_id, Operation.tenant_id == tenant_id)
        .order_by(Operation.sequence)
        .all()
    )

    current_time = start_date

    for op in operations:
        duration = timedelta(hours=float(op.time_standard))

        schedule = ProductionSchedule(
            tenant_id=work_order.tenant_id,
            work_order_id=work_order_id,
            work_center_id=op.work_center_id,
            scheduled_start=current_time,
            scheduled_end=current_time + duration,
        )

        db.add(schedule)
        current_time += duration

    db.commit()
    return {"status": "scheduled", "steps": len(operations)}


# -----------------------------
# QUALITY CONTROL SERVICE (STEP 2.2.2)
# -----------------------------

def perform_quality_inspection(
    *,
    work_order_id: int,
    inspector_id: int,
    results: list,
    db: Session,
    tenant_id: int,
):
    """
    Validates production quality against defined parameters
    """
    wo = db.query(WorkOrder).filter(WorkOrder.id == work_order_id, WorkOrder.tenant_id == tenant_id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found")

    inspection = QualityInspection(
        tenant_id=wo.tenant_id,
        work_order_id=work_order_id,
        inspector_id=inspector_id,
    )
    db.add(inspection)
    db.flush()

    overall_status = "PASS"

    for res in results:
        param = db.query(QualityParameter).filter(QualityParameter.id == res["parameter_id"], QualityParameter.tenant_id == tenant_id).first()
        if not param:
            continue

        status = (
            "PASS"
            if param.min_value <= res["measured_value"] <= param.max_value
            else "FAIL"
        )

        if status == "FAIL":
            overall_status = "FAIL"

        db.add(
            QualityInspectionResult(
                tenant_id=wo.tenant_id,
                inspection_id=inspection.id,
                parameter_id=param.id,
                measured_value=res["measured_value"],
                result=status,
            )
        )

    inspection.status = overall_status
    db.commit()
    return {
        "inspection_id": inspection.id,
        "status": inspection.status,
        "date": inspection.inspection_date
    }


# -----------------------------
# PRODUCTION COSTING SERVICE (STEP 2.3)
# -----------------------------

def calculate_production_cost(
    *,
    work_order_id: int,
    db: Session,
    tenant_id: int,
):
    """
    Computes Standard vs Actual production costs (Refined)
    """
    wo = db.query(WorkOrder).filter(WorkOrder.id == work_order_id, WorkOrder.tenant_id == tenant_id).first()
    bom = db.query(BOM).filter(BOM.id == wo.bom_id, BOM.tenant_id == tenant_id).first()
    
    # 1. Material Cost (Standard)
    material_standard = 0.0
    for bi in bom.items:
        item = db.query(Item).filter(Item.id == bi.raw_item_id, Item.tenant_id == tenant_id).first()
        if item:
            material_standard += float(bi.quantity_required) * float(item.valuation_rate or 0)
    material_standard *= float(wo.quantity_to_produce)

    # 2. Labor Cost (Standard)
    labor_standard = 0.0
    operations = db.query(Operation).filter(Operation.bom_id == bom.id, Operation.tenant_id == tenant_id).all()
    for op in operations:
        wc = db.query(WorkCenter).filter(WorkCenter.id == op.work_center_id, WorkCenter.tenant_id == tenant_id).first()
        if wc:
            labor_standard += float(op.time_standard) * float(wc.cost_per_hour or 0)
    labor_standard *= float(wo.quantity_to_produce)

    # 3. ACTUAL COST (Query from movements)
    # Sum of quantity * unit_cost for this WO
    actual_material_cost = (
        db.query(func.sum(StockMovement.quantity * StockMovement.unit_cost))
        .filter(
            StockMovement.work_order_id == wo.id,
            StockMovement.movement_type == "OUT",
        )
        .scalar()
        or 0
    )
    # We take the absolute value since 'OUT' movements have negative quantity
    actual_material_cost = abs(float(actual_material_cost))

    actual_labor_cost = labor_standard  # Placeholder (can be extended with actual time tracking later)
    
    overhead_cost = float(labor_standard) * 0.10  # 10% overhead rule
    
    total_std = material_standard + labor_standard + overhead_cost
    total_actual = actual_material_cost + actual_labor_cost + overhead_cost
    
    record = CostingRecord(
        tenant_id=wo.tenant_id,
        work_order_id=wo.id,
        material_cost_standard=material_standard,
        material_cost_actual=actual_material_cost,
        labor_cost_standard=labor_standard,
        labor_cost_actual=actual_labor_cost,
        overhead_cost=overhead_cost,
        total_cost_standard=total_std,
        total_cost_actual=total_actual,
        variance=total_actual - total_std
    )
    db.add(record)
    db.commit()
    return record
