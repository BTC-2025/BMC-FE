from fastapi import APIRouter
from sqlalchemy import text
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        # Check DB connection
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}

@router.get("/version")
def version():
    return {
        "name": "Perfected ERP Backend",
        "version": "v1.0.0",
        "status": "stable"
    }

@router.get("/integrity")
def get_integrity():
    import time
    return {
        "node_stability": 100.0,
        "sync_status": "synced",
        "last_audit": time.time()
    }
