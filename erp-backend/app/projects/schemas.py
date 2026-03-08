from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "MEDIUM"
    estimated_hours: float = 0.0


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: float = 0.0


class TaskUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None


class MilestoneCreate(BaseModel):
    title: str
    due_date: Optional[date] = None


class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None


class ProjectMemberAdd(BaseModel):
    user_id: int
    role: str = "MEMBER"
