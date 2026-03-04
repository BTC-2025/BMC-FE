from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.auth.permissions import get_current_user, require_permission
from app.projects.models import Project, Task, Milestone, ProjectMember
from app.projects.schemas import (
    ProjectCreate,
    TaskCreate,
    TaskUpdate,
    MilestoneCreate,
    ProjectMemberAdd,
)
from app.projects.service import get_project_summary, update_task_progress
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/projects", tags=["Project Management"])

# 🟩 PROJECT CRUD
@router.post(
    "/",
    dependencies=[Depends(require_permission("projects.admin"))],
)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    project = Project(**data.dict(), owner_id=user.id, tenant_id=tenant_id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get(
    "/",
    dependencies=[Depends(require_permission("projects.view"))],
)
def list_projects(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Project).filter(Project.tenant_id == tenant_id).all()

@router.get(
    "/{project_id}/summary",
    dependencies=[Depends(require_permission("projects.view"))],
)
def project_summary(
    project_id: int, 
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return get_project_summary(db, project_id, tenant_id=tenant_id)


# 🟦 TASK MANAGEMENT
@router.post(
    "/{project_id}/tasks",
    dependencies=[Depends(require_permission("projects.manage"))],
)
def add_task(
    project_id: int,
    data: TaskCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    # Verify project belongs to tenant
    project = db.query(Project).filter(Project.id == project_id, Project.tenant_id == tenant_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    task = Task(**data.dict(), project_id=project_id, tenant_id=tenant_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.patch(
    "/tasks/{task_id}",
    dependencies=[Depends(require_permission("projects.view"))],
)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return update_task_progress(
        db, 
        task_id=task_id, 
        tenant_id=tenant_id,
        progress=data.progress if data.progress is not None else 0,
        status=data.status
    )


# 🟧 MEMBERSHIP
@router.post(
    "/{project_id}/members",
    dependencies=[Depends(require_permission("projects.admin"))],
)
def add_member(
    project_id: int,
    data: ProjectMemberAdd,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    # Verify project belongs to tenant
    project = db.query(Project).filter(Project.id == project_id, Project.tenant_id == tenant_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    member = ProjectMember(project_id=project_id, tenant_id=tenant_id, **data.dict())
    db.add(member)
    db.commit()
    return {"message": "Member added successfully"}
