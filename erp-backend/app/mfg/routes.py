from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.permissions import get_current_user, require_permission
from app.mfg.models import BOM, BOMItem, WorkOrder
from app.mfg.schemas import BOMCreate, WorkOrderCreate
from app.mfg.service import process_production
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/mfg", tags=["Manufacturing"])

# 🟩 CREATE BOM
@router.post(
    "/boms",
    dependencies=[Depends(require_permission("mfg.manage_bom"))],
)
def create_bom(
    data: BOMCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    bom = BOM(
        name=data.name,
        finished_item_id=data.finished_item_id,
        tenant_id=tenant_id
    )
    db.add(bom)
    db.flush()

    for item in data.items:
        bom_item = BOMItem(
            bom_id=bom.id,
            tenant_id=tenant_id,
            raw_item_id=item.raw_item_id,
            quantity_required=item.quantity_required,
        )
        db.add(bom_item)

    db.commit()
    db.refresh(bom)
    return bom

# 🟦 CREATE WORK ORDER
@router.post(
    "/work-orders",
    dependencies=[Depends(require_permission("mfg.view"))],
)
def create_work_order(
    data: WorkOrderCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    wo = WorkOrder(
        bom_id=data.bom_id,
        quantity_to_produce=data.quantity_to_produce,
        tenant_id=tenant_id
    )
    db.add(wo)
    db.commit()
    db.refresh(wo)
    return wo

# 🟥 EXECUTE PRODUCTION (ATOMIC)
@router.post(
    "/work-orders/{wo_id}/produce",
    dependencies=[Depends(require_permission("mfg.produce"))],
)
def produce(
    wo_id: int,
    warehouse_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return process_production(
        db,
        tenant_id=tenant_id,
        work_order_id=wo_id,
        warehouse_id=warehouse_id,
        performed_by=user.id,
    )


# -----------------------------
# PRODUCTION SCHEDULING (STEP 2.1.3)
# -----------------------------
from datetime import datetime
from app.mfg.service import schedule_work_order

@router.post(
    "/work-orders/{id}/schedule",
    dependencies=[Depends(require_permission("mfg.produce"))],
)
def schedule_wo(
    id: int,
    start_date: datetime,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Triggers sequential routing and scheduling for a Work Order
    """
    return schedule_work_order(
        work_order_id=id,
        start_date=start_date,
        db=db,
        tenant_id=tenant_id
    )


# -----------------------------
# QUALITY CONTROL ROUTE (STEP 2.2.4)
# -----------------------------
from app.mfg.service import perform_quality_inspection

@router.post(
    "/work-orders/{id}/inspect",
    dependencies=[Depends(require_permission("mfg.produce"))],
)
def inspect_work_order(
    id: int,
    results: list,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Submits QC results and validates PASS/FAIL
    """
    return perform_quality_inspection(
        work_order_id=id,
        inspector_id=user.id,
        results=results,
        db=db,
        tenant_id=tenant_id
    )


# -----------------------------
# PRODUCTION COSTING ROUTE (STEP 2.3)
# -----------------------------
from app.mfg.models import CostingRecord

@router.get(
    "/work-orders/{id}/costing",
    dependencies=[Depends(require_permission("mfg.view"))],
)
def get_wo_costing(
    id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    """
    Retrieves standard vs actual costs for a work order
    """
    return (
        db.query(CostingRecord)
        .filter(
            CostingRecord.work_order_id == id,
            CostingRecord.tenant_id == user.tenant_id
        )
        .first()
    )
