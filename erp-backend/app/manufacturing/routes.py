from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.auth.permissions import require_permission
from app.manufacturing import models, schemas
from app.auth.models import User

router = APIRouter()

@router.post("/work-orders", response_model=schemas.WorkOrder)
async def create_work_order(
    wo: schemas.WorkOrderCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_permission("mfg.manage_work_orders"))
):
    new_wo = models.WorkOrder(**wo.dict())
    db.add(new_wo)
    db.commit()
    db.refresh(new_wo)
    return new_wo

@router.get("/work-orders", response_model=List[schemas.WorkOrder])
async def list_work_orders(
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_permission("mfg.view"))
):
    return db.query(models.WorkOrder).all()

@router.post("/bom", response_model=schemas.BOM)
async def create_bom(
    bom: schemas.BOMCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_permission("mfg.manage_bom"))
):
    new_bom = models.BillOfMaterials(**bom.dict())
    db.add(new_bom)
    db.commit()
    db.refresh(new_bom)
    return new_bom

@router.get("/bom", response_model=List[schemas.BOM])
async def list_bom(
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_permission("mfg.view"))
):
    return db.query(models.BillOfMaterials).all()
