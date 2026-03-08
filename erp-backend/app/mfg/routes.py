from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.auth.permissions import get_current_user, require_permission
from app.mfg.models import (
    BOM, BOMItem, WorkOrder, WorkCenter, WorkOrderMaterial,
    CostingRecord, ProductionSchedule, QualityInspection
)
from app.mfg.schemas import (
    BOMCreate, BOMResponse,
    WorkOrderCreate, WorkOrderUpdate, WorkOrderResponse,
    WorkCenterCreate, WorkCenterUpdate, WorkCenterResponse,
    QualityInspectionResponse,
    CostingRecordResponse,
    ProductionScheduleResponse,
)
from app.mfg.service import process_production, schedule_work_order, perform_quality_inspection
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/mfg", tags=["Manufacturing"])


# ─────────────────────────────────────────────
# BOM ROUTES
# ─────────────────────────────────────────────

@router.post("/boms", response_model=BOMResponse, dependencies=[Depends(require_permission("mfg.manage_bom"))])
def create_bom(
    data: BOMCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    bom = BOM(name=data.name, finished_item_id=data.finished_item_id, tenant_id=tenant_id)
    db.add(bom)
    db.flush()

    for item in data.items:
        db.add(BOMItem(
            bom_id=bom.id,
            tenant_id=tenant_id,
            raw_item_id=item.raw_item_id,
            quantity_required=item.quantity_required,
        ))

    db.commit()
    db.refresh(bom)
    return bom


@router.get("/boms", response_model=List[BOMResponse], dependencies=[Depends(require_permission("mfg.view"))])
def list_boms(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return db.query(BOM).filter(BOM.tenant_id == tenant_id).offset(skip).limit(limit).all()


@router.get("/boms/{bom_id}", response_model=BOMResponse, dependencies=[Depends(require_permission("mfg.view"))])
def get_bom(
    bom_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    bom = db.query(BOM).filter(BOM.id == bom_id, BOM.tenant_id == tenant_id).first()
    if not bom:
        raise HTTPException(status_code=404, detail="BOM not found")
    return bom


@router.delete("/boms/{bom_id}", dependencies=[Depends(require_permission("mfg.manage_bom"))])
def delete_bom(
    bom_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    bom = db.query(BOM).filter(BOM.id == bom_id, BOM.tenant_id == tenant_id).first()
    if not bom:
        raise HTTPException(status_code=404, detail="BOM not found")
    db.delete(bom)
    db.commit()
    return {"detail": "BOM deleted"}


# ─────────────────────────────────────────────
# WORK ORDER ROUTES
# ─────────────────────────────────────────────

@router.post("/work-orders", response_model=WorkOrderResponse, dependencies=[Depends(require_permission("mfg.view"))])
def create_work_order(
    data: WorkOrderCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    bom = db.query(BOM).filter(BOM.id == data.bom_id, BOM.tenant_id == tenant_id).first()
    if not bom:
        raise HTTPException(status_code=404, detail="BOM not found")
    wo = WorkOrder(bom_id=data.bom_id, quantity_to_produce=data.quantity_to_produce, tenant_id=tenant_id)
    db.add(wo)
    db.commit()
    db.refresh(wo)
    return wo


@router.get("/work-orders", response_model=List[WorkOrderResponse], dependencies=[Depends(require_permission("mfg.view"))])
def list_work_orders(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return db.query(WorkOrder).filter(WorkOrder.tenant_id == tenant_id).order_by(WorkOrder.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/work-orders/{wo_id}", response_model=WorkOrderResponse, dependencies=[Depends(require_permission("mfg.view"))])
def get_work_order(
    wo_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    wo = db.query(WorkOrder).filter(WorkOrder.id == wo_id, WorkOrder.tenant_id == tenant_id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work Order not found")
    return wo


@router.patch("/work-orders/{wo_id}", response_model=WorkOrderResponse, dependencies=[Depends(require_permission("mfg.view"))])
def update_work_order(
    wo_id: int,
    data: WorkOrderUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    wo = db.query(WorkOrder).filter(WorkOrder.id == wo_id, WorkOrder.tenant_id == tenant_id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work Order not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(wo, field, value)
    db.commit()
    db.refresh(wo)
    return wo


@router.delete("/work-orders/{wo_id}", dependencies=[Depends(require_permission("mfg.produce"))])
def delete_work_order(
    wo_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    wo = db.query(WorkOrder).filter(WorkOrder.id == wo_id, WorkOrder.tenant_id == tenant_id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work Order not found")
    db.delete(wo)
    db.commit()
    return {"detail": "Work Order deleted"}


@router.post("/work-orders/{wo_id}/produce", dependencies=[Depends(require_permission("mfg.produce"))])
def produce(
    wo_id: int,
    warehouse_id: int = 1,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return process_production(db, tenant_id=tenant_id, work_order_id=wo_id, warehouse_id=warehouse_id, performed_by=user.id)


@router.post("/work-orders/{wo_id}/schedule", dependencies=[Depends(require_permission("mfg.produce"))])
def schedule_wo(
    wo_id: int,
    start_date: datetime,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return schedule_work_order(work_order_id=wo_id, start_date=start_date, db=db, tenant_id=tenant_id)


@router.post("/work-orders/{wo_id}/inspect", dependencies=[Depends(require_permission("mfg.produce"))])
def inspect_work_order(
    wo_id: int,
    results: list,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return perform_quality_inspection(work_order_id=wo_id, inspector_id=user.id, results=results, db=db, tenant_id=tenant_id)


@router.get("/work-orders/{wo_id}/costing", response_model=CostingRecordResponse, dependencies=[Depends(require_permission("mfg.view"))])
def get_wo_costing(
    wo_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    record = db.query(CostingRecord).filter(CostingRecord.work_order_id == wo_id, CostingRecord.tenant_id == tenant_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Costing record not found")
    return record


# ─────────────────────────────────────────────
# WORK CENTER ROUTES
# ─────────────────────────────────────────────

@router.get("/work-centers", response_model=List[WorkCenterResponse], dependencies=[Depends(require_permission("mfg.view"))])
def list_work_centers(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(WorkCenter).filter(WorkCenter.tenant_id == tenant_id).all()


@router.post("/work-centers", response_model=WorkCenterResponse, dependencies=[Depends(require_permission("mfg.manage_bom"))])
def create_work_center(
    data: WorkCenterCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    wc = WorkCenter(**data.dict(), tenant_id=tenant_id)
    db.add(wc)
    db.commit()
    db.refresh(wc)
    return wc


@router.patch("/work-centers/{wc_id}", response_model=WorkCenterResponse, dependencies=[Depends(require_permission("mfg.manage_bom"))])
def update_work_center(
    wc_id: int,
    data: WorkCenterUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    wc = db.query(WorkCenter).filter(WorkCenter.id == wc_id, WorkCenter.tenant_id == tenant_id).first()
    if not wc:
        raise HTTPException(status_code=404, detail="Work Center not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(wc, field, value)
    db.commit()
    db.refresh(wc)
    return wc


@router.delete("/work-centers/{wc_id}", dependencies=[Depends(require_permission("mfg.manage_bom"))])
def delete_work_center(
    wc_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    wc = db.query(WorkCenter).filter(WorkCenter.id == wc_id, WorkCenter.tenant_id == tenant_id).first()
    if not wc:
        raise HTTPException(status_code=404, detail="Work Center not found")
    db.delete(wc)
    db.commit()
    return {"detail": "Work Center deleted"}


# ─────────────────────────────────────────────
# QUALITY INSPECTION LIST
# ─────────────────────────────────────────────

@router.get("/quality-inspections", response_model=List[QualityInspectionResponse], dependencies=[Depends(require_permission("mfg.view"))])
def list_quality_inspections(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return db.query(QualityInspection).filter(QualityInspection.tenant_id == tenant_id).order_by(QualityInspection.inspection_date.desc()).offset(skip).limit(limit).all()


# ─────────────────────────────────────────────
# COSTING RECORDS LIST
# ─────────────────────────────────────────────

@router.get("/costing", response_model=List[CostingRecordResponse], dependencies=[Depends(require_permission("mfg.view"))])
def list_costing_records(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return db.query(CostingRecord).filter(CostingRecord.tenant_id == tenant_id).order_by(CostingRecord.created_at.desc()).offset(skip).limit(limit).all()


# ─────────────────────────────────────────────
# PRODUCTION SCHEDULES LIST
# ─────────────────────────────────────────────

@router.get("/schedules", response_model=List[ProductionScheduleResponse], dependencies=[Depends(require_permission("mfg.view"))])
def list_schedules(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(ProductionSchedule).filter(ProductionSchedule.tenant_id == tenant_id).order_by(ProductionSchedule.scheduled_start).all()
