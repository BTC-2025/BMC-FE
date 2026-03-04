import os
import uuid
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.documents.models import Document

BASE_UPLOAD_DIR = "uploads"


async def upload_file(
    *,
    file: UploadFile,
    tenant_id: int,
    entity_type: str,
    entity_id: int,
    user_id: int,
    db: Session,
) -> Document:

    os.makedirs(f"{BASE_UPLOAD_DIR}/tenants/{tenant_id}", exist_ok=True)

    ext = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{ext}"
    full_path = f"{BASE_UPLOAD_DIR}/tenants/{tenant_id}/{unique_name}"

    contents = await file.read()
    with open(full_path, "wb") as f:
        f.write(contents)

    # Find last version
    last_doc = (
        db.query(Document)
        .filter(
            Document.tenant_id == tenant_id,
            Document.entity_type == entity_type,
            Document.entity_id == entity_id,
        )
        .order_by(Document.version.desc())
        .first()
    )

    version = 1
    parent_id = None
    if last_doc:
        version = last_doc.version + 1
        parent_id = last_doc.id

    doc = Document(
        tenant_id=tenant_id,
        filename=unique_name,
        original_filename=file.filename,
        file_path=full_path,
        file_size=len(contents),
        mime_type=file.content_type,
        entity_type=entity_type,
        entity_id=entity_id,
        uploaded_by=user_id,
        version=version,
        parent_id=parent_id,
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc
