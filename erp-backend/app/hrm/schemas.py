from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional


class EmployeeCreate(BaseModel):
    name: str
    email: str
    role: str | None = None
    department: str
    department_id: int | None = None
    basic_salary: float
    user_id: int | None = None


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    department_id: Optional[int] = None
    basic_salary: Optional[float] = None
    user_id: Optional[int] = None


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: str
    role: Optional[str] = None
    department: str
    department_id: Optional[int] = None
    basic_salary: float
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DepartmentCreate(BaseModel):
    name: str


class DepartmentResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class AttendanceAction(BaseModel):
    employee_id: int
    action: str  # IN | OUT


class LeaveCreate(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date

class LeaveResponse(BaseModel):
    id: int
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class PayrollResponse(BaseModel):
    id: int
    employee_id: int
    month: str
    basic_salary: float
    deductions: float
    allowances: float
    net_salary: float
    generated_at: datetime

    class Config:
        from_attributes = True


# --- Performance / Appraisals ---
class AppraisalCreate(BaseModel):
    employee_id: int
    review_period: str | None = None
    review_type: str | None = "MANAGER"       # SELF | MANAGER | 360
    communication_score: float | None = None
    technical_score: float | None = None
    teamwork_score: float | None = None
    leadership_score: float | None = None
    score: float | None = 0                    # overall (auto or manual)
    goals_achieved: int | None = None         # 0–100 %
    feedback: str | None = None
    status: str | None = "PENDING"            # PENDING | IN_PROGRESS | COMPLETED


class AppraisalUpdate(BaseModel):
    review_period: str | None = None
    review_type: str | None = None
    communication_score: float | None = None
    technical_score: float | None = None
    teamwork_score: float | None = None
    leadership_score: float | None = None
    score: float | None = None
    goals_achieved: int | None = None
    feedback: str | None = None
    status: str | None = None


class AppraisalResponse(BaseModel):
    id: int
    employee_id: int
    review_period: str | None = None
    review_type: str | None = None
    communication_score: float | None = None
    technical_score: float | None = None
    teamwork_score: float | None = None
    leadership_score: float | None = None
    score: float
    goals_achieved: int | None = None
    feedback: str | None = None
    status: str
    reviewed_at: datetime
    reviewer_id: int | None = None

    class Config:
        from_attributes = True

# --- Recruitment ---
class JobPostingCreate(BaseModel):
    title: str
    department_id: int | None = None
    type: str

class ApplicationCreate(BaseModel):
    job_id: int
    candidate_name: str
    email: str

class ApplicationResponse(BaseModel):
    id: int
    candidate_name: str
    email: str
    status: str

    class Config:
        from_attributes = True

class JobPostingResponse(BaseModel):
    id: int
    title: str
    type: str
    status: str
    applications: List[ApplicationResponse] = []

    class Config:
        from_attributes = True
