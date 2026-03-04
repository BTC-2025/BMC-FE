from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.projects.models import Project, Task


def get_project_summary(db: Session, project_id: int, tenant_id: int):
    project = db.query(Project).filter(Project.id == project_id, Project.tenant_id == tenant_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = project.tasks
    if not tasks:
        return {
            "project_name": project.name,
            "task_count": 0,
            "overall_progress": 0,
            "status": project.status
        }

    total_progress = sum(task.progress for task in tasks)
    overall_progress = total_progress / len(tasks)

    return {
        "project_name": project.name,
        "task_count": len(tasks),
        "overall_progress": round(overall_progress, 2),
        "status": project.status
    }


def update_task_progress(
    db: Session, 
    task_id: int, 
    tenant_id: int,
    progress: int, 
    status: str = None
):
    task = db.query(Task).filter(Task.id == task_id, Task.tenant_id == tenant_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if not (0 <= progress <= 100):
        raise HTTPException(status_code=400, detail="Progress must be between 0 and 100")

    task.progress = progress
    if status:
        task.status = status
    elif progress == 100:
        task.status = "DONE"
    elif progress > 0 and task.status == "TODO":
        task.status = "IN_PROGRESS"

    db.commit()
    db.refresh(task)

    from app.core.audit.service import log_audit
    log_audit(
        db,
        tenant_id=tenant_id,
        module="PROJECTS",
        action="UPDATE_TASK",
        reference_id=str(task.id),
        user_id=0  # For now, as we don't pass user_id to service
    )

    return task
