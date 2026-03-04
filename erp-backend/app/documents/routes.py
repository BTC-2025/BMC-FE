from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.dependencies import get_current_user # Fixed import to match codebase
from app.documents.service import upload_file
from app.documents.models import Document
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/documents", tags=["Documents"])

# 📤 Upload Document
@router.post("/upload")
async def upload_document(
    file: UploadFile,
    entity_type: str,
    entity_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return await upload_file(
        file=file,
        tenant_id=tenant_id,
        entity_type=entity_type,
        entity_id=entity_id,
        user_id=user.id,
        db=db,
    )

# 📥 List Documents for Entity
@router.get("/{entity_type}/{entity_id}")
def list_documents(
    entity_type: str,
    entity_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return (
        db.query(Document)
        .filter(
            Document.tenant_id == tenant_id,
            Document.entity_type == entity_type,
            Document.entity_id == entity_id,
        )
        .all()
    )
