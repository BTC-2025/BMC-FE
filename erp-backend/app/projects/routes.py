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
    MilestoneUpdate,
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
    projects = db.query(Project).filter(Project.tenant_id == tenant_id).all()
    # Eagerly load tasks and milestones for the frontend
    for p in projects:
        p.tasks
        p.milestones
    return projects

@router.get(
    "/{project_id}",
    dependencies=[Depends(require_permission("projects.view"))],
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    project = db.query(Project).filter(Project.id == project_id, Project.tenant_id == tenant_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete(
    "/{project_id}",
    dependencies=[Depends(require_permission("projects.admin"))],
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    project = db.query(Project).filter(Project.id == project_id, Project.tenant_id == tenant_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

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


@router.get(
    "/{project_id}/tasks",
    dependencies=[Depends(require_permission("projects.view"))],
)
def list_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Task).filter(Task.project_id == project_id, Task.tenant_id == tenant_id).all()


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

@router.delete(
    "/tasks/{task_id}",
    dependencies=[Depends(require_permission("projects.manage"))],
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    task = db.query(Task).filter(Task.id == task_id, Task.tenant_id == tenant_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

# 🟪 MILESTONES
@router.get(
    "/{project_id}/milestones",
    dependencies=[Depends(require_permission("projects.view"))],
)
def list_milestones(
    project_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Milestone).filter(Milestone.project_id == project_id, Milestone.tenant_id == tenant_id).all()

@router.post(
    "/{project_id}/milestones",
    dependencies=[Depends(require_permission("projects.manage"))],
)
def create_milestone(
    project_id: int,
    data: MilestoneCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    project = db.query(Project).filter(Project.id == project_id, Project.tenant_id == tenant_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    milestone = Milestone(project_id=project_id, tenant_id=tenant_id, **data.dict())
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone

@router.patch(
    "/milestones/{milestone_id}",
    dependencies=[Depends(require_permission("projects.manage"))],
)
def update_milestone(
    milestone_id: int,
    data: MilestoneUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id, Milestone.tenant_id == tenant_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    if data.title is not None:
        milestone.title = data.title
    if data.due_date is not None:
        milestone.due_date = data.due_date
    if data.status is not None:
        milestone.status = data.status

    db.commit()
    db.refresh(milestone)
    return milestone

@router.delete(
    "/milestones/{milestone_id}",
    dependencies=[Depends(require_permission("projects.manage"))],
)
def delete_milestone(
    milestone_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id, Milestone.tenant_id == tenant_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    db.delete(milestone)
    db.commit()
    return {"message": "Milestone deleted successfully"}


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
