from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date, Text, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

# -----------------------------
# PROJECT
# -----------------------------
class Project(Base):
    __tablename__ = "prj_projects"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    status = Column(String, default="PLANNING")  # PLANNING, ACTIVE, ON_HOLD, COMPLETED
    priority = Column(String, default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL
    
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    
    owner_id = Column(Integer, nullable=True)  # User ID of project lead
    total_budget = Column(Numeric(12, 2), default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")


# -----------------------------
# TASK
# -----------------------------
class Task(Base):
    __tablename__ = "prj_tasks"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("prj_projects.id"), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    status = Column(String, default="TODO")  # TODO, IN_PROGRESS, REVIEW, DONE
    priority = Column(String, default="MEDIUM")
    
    progress = Column(Integer, default=0)  # 0-100%
    estimated_hours = Column(Float, default=0.0)
    
    assigned_to = Column(Integer, nullable=True)  # References auth_users.id or hrm_employees.id

    project = relationship("Project", back_populates="tasks")


# -----------------------------
# MILESTONE
# -----------------------------
class Milestone(Base):
    __tablename__ = "prj_milestones"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("prj_projects.id"), nullable=False)
    
    title = Column(String, nullable=False)
    due_date = Column(Date, nullable=True)
    status = Column(String, default="PENDING")  # PENDING, ACHIEVED

    project = relationship("Project", back_populates="milestones")


# -----------------------------
# PROJECT MEMBERSHIP
# -----------------------------
class ProjectMember(Base):
    __tablename__ = "prj_members"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("prj_projects.id"), nullable=False)
    user_id = Column(Integer, nullable=False)  # References auth_users.id
    role = Column(String, default="MEMBER")    # LEAD, MEMBER, VIEWER

    project = relationship("Project", back_populates="members")
