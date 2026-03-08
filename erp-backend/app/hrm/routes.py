from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.permissions import get_current_user, require_permission
from app.hrm.models import Employee, LeaveRequest, Department, Attendance, Appraisal, JobPosting, Application, Payroll
from app.hrm.schemas import (
     EmployeeCreate, EmployeeUpdate, EmployeeResponse,
    AttendanceAction, LeaveCreate, LeaveResponse,
    DepartmentCreate, DepartmentResponse,
    DepartmentCreate, DepartmentResponse,
    AppraisalCreate, AppraisalUpdate, AppraisalResponse,
    JobPostingCreate, JobPostingResponse,
    ApplicationCreate, ApplicationResponse
)
from app.hrm.service import process_attendance, calculate_monthly_payroll, approve_leave
from app.hrm import appraisal_service
from app.core.tenant.context import get_current_tenant_id
from app.core.audit.service import log_action

router = APIRouter(prefix="/hrm", tags=["HRM"])

# 🏢 DEPARTMENT MANAGEMENT
@router.post(
    "/departments",
    response_model=DepartmentResponse,
    dependencies=[Depends(require_permission("hrm.view"))],
)
def create_department(
    data: DepartmentCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    dept = Department(**data.dict(), tenant_id=tenant_id)
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept

@router.get(
    "/departments",
    response_model=List[DepartmentResponse],
    dependencies=[Depends(require_permission("hrm.view"))],
)
def list_departments(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Department).filter(Department.tenant_id == tenant_id).all()

@router.patch(
    "/departments/{dept_id}",
    response_model=DepartmentResponse,
    dependencies=[Depends(require_permission("hrm.view"))],
)
def update_department(
    dept_id: int,
    data: DepartmentCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    dept = db.query(Department).filter(Department.id == dept_id, Department.tenant_id == tenant_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    dept.name = data.name
    db.commit()
    db.refresh(dept)
    return dept

@router.delete(
    "/departments/{dept_id}",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def delete_department(
    dept_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    dept = db.query(Department).filter(Department.id == dept_id, Department.tenant_id == tenant_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    db.delete(dept)
    db.commit()
    return {"message": "Department deleted"}

# 🟩 EMPLOYEE MANAGEMENT
@router.post(
    "/employees",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    if data.user_id:
        existing = db.query(Employee).filter(Employee.user_id == data.user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="User already linked to an employee")
    
    emp = Employee(**data.dict(), tenant_id=tenant_id)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@router.get(
    "/employees",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def list_employees(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    return db.query(Employee).filter(Employee.tenant_id == tenant_id).offset(skip).limit(limit).all()

@router.get(
    "/employees/{employee_id}",
    response_model=EmployeeResponse,
    dependencies=[Depends(require_permission("hrm.view"))],
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    emp = db.query(Employee).filter(Employee.id == employee_id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.patch(
    "/employees/{employee_id}",
    response_model=EmployeeResponse,
    dependencies=[Depends(require_permission("hrm.view"))],
)
def update_employee(
    employee_id: int,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    emp = db.query(Employee).filter(Employee.id == employee_id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    update_data = data.dict(exclude_unset=True)
    if "user_id" in update_data and update_data["user_id"] is not None:
        existing = db.query(Employee).filter(
            Employee.user_id == update_data["user_id"], 
            Employee.id != employee_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="User already linked to another employee")

    for field, value in update_data.items():
        setattr(emp, field, value)

    db.commit()
    db.refresh(emp)
    return emp

@router.delete(
    "/employees/{employee_id}",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    emp = db.query(Employee).filter(Employee.id == employee_id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted"}

# 🟦 ATTENDANCE
@router.get(
    "/attendance",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def list_attendance(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    employee_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
):
    query = (
        db.query(Attendance, Employee.name, Employee.role, Employee.department)
        .join(Employee, Attendance.employee_id == Employee.id)
        .filter(Attendance.tenant_id == tenant_id)
    )
    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    
    results = query.order_by(Attendance.punch_in.desc()).offset(skip).limit(limit).all()
    
    # Format for frontend
    return [
        {
            "id": att.id,
            "employee_id": att.employee_id,
            "name": name,
            "role": role,
            "department": department,
            "punch_in": att.punch_in,
            "punch_out": att.punch_out,
            "status": att.status
        }
        for att, name, role, department in results
    ]

@router.post(
    "/attendance",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def attendance(
    data: AttendanceAction,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return process_attendance(
        db,
        tenant_id=tenant_id,
        employee_id=data.employee_id,
        action=data.action,
    )

# 🟧 LEAVE REQUEST
@router.get(
    "/leaves",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def list_leaves(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    query = (
        db.query(LeaveRequest, Employee.name, Employee.role, Employee.department)
        .join(Employee, LeaveRequest.employee_id == Employee.id)
        .filter(LeaveRequest.tenant_id == tenant_id)
    )
    
    results = query.order_by(LeaveRequest.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": lv.id,
            "employee_id": lv.employee_id,
            "name": name,
            "role": role,
            "department": department,
            "leave_type": lv.leave_type,
            "start_date": lv.start_date,
            "end_date": lv.end_date,
            "status": lv.status,
            "applied_at": lv.created_at
        }
        for lv, name, role, department in results
    ]

@router.post(
    "/leaves",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def create_leave(
    data: LeaveCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    # Convert date strings to date objects if needed, 
    # but SQLAlchemy handles date objects. 
    # Pydantic strings to Date objects automatic if typed as Date in models.
    leave = LeaveRequest(**data.dict(), tenant_id=tenant_id)
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

@router.post(
    "/leaves/{leave_id}/approve",
    dependencies=[Depends(require_permission("hrm.approve_leaves"))],
)
def approve_leave_api(
    leave_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    leave = approve_leave(
        db,
        tenant_id=tenant_id,
        leave_id=leave_id,
        approver_id=user.id,
    )

    log_action(
        db,
        tenant_id=tenant_id,
        user_id=user.id,
        action="hrm.leave_approved",
        module="hrm",
        entity_type="LeaveRequest",
        entity_id=leave.id,
        before={"status": "PENDING"},
        after={"status": "APPROVED"},
    )
    return leave

@router.post(
    "/leaves/{leave_id}/reject",
    dependencies=[Depends(require_permission("hrm.approve_leaves"))],
)
def reject_leave_api(
    leave_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    leave = db.query(LeaveRequest).filter(
        LeaveRequest.id == leave_id,
        LeaveRequest.tenant_id == tenant_id
    ).first()
    
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
        
    leave.status = "REJECTED"
    db.commit()
    db.refresh(leave)

    log_action(
        db,
        tenant_id=tenant_id,
        user_id=user.id,
        action="hrm.leave_rejected",
        module="hrm",
        entity_type="LeaveRequest",
        entity_id=leave.id,
        before={"status": "PENDING"},
        after={"status": "REJECTED"},
    )
    return leave


# 🟥 PAYROLL (ADMIN / HR ONLY)
@router.get(
    "/payroll",
    dependencies=[Depends(require_permission("hrm.manage_payroll"))],
)
def list_payroll(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 100
):
    results = (
        db.query(Payroll, Employee.name, Employee.role)
        .join(Employee, Payroll.employee_id == Employee.id)
        .filter(Payroll.tenant_id == tenant_id)
        .order_by(Payroll.generated_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": p.id,
            "employee_id": p.employee_id,
            "name": name,
            "role": role,
            "month": p.month,
            "gross": float(p.basic_salary + p.allowances),
            "net": float(p.net_salary),
            "status": "PROCESSED",
            "period": p.month,
            "generated_at": p.generated_at
        }
        for p, name, role in results
    ]

@router.post(
    "/payroll/{employee_id}",
    dependencies=[Depends(require_permission("hrm.manage_payroll"))],
)
def generate_payroll(
    employee_id: int,
    month: str,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return calculate_monthly_payroll(
        db,
        tenant_id=tenant_id,
        employee_id=employee_id,
        month=month,
    )


# 🟨 PERFORMANCE / APPRAISALS
def _fmt_appraisal(a, name: str, dept: str = "", role: str = "") -> dict:
    """Helper to format appraisal row for frontend."""
    return {
        "id":                  a.id,
        "employee_id":         a.employee_id,
        "name":                name,
        "department":          dept,
        "role":                role,
        "review_period":       a.review_period,
        "review_type":         a.review_type,
        "communication_score": float(a.communication_score) if a.communication_score is not None else None,
        "technical_score":     float(a.technical_score)     if a.technical_score     is not None else None,
        "teamwork_score":      float(a.teamwork_score)      if a.teamwork_score      is not None else None,
        "leadership_score":    float(a.leadership_score)    if a.leadership_score    is not None else None,
        "score":               float(a.score),
        "goals_achieved":      a.goals_achieved,
        "feedback":            a.feedback,
        "status":              a.status,
        "reviewed_at":         a.reviewed_at.strftime("%Y-%m-%d") if a.reviewed_at else None,
        "reviewer_id":         a.reviewer_id,
        # Legacy alias used by older frontend
        "empId":               a.employee_id,
        "lastReview":          a.reviewed_at.strftime("%Y-%m-%d") if a.reviewed_at else "---",
    }


@router.get(
    "/performance/summary",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def get_performance_summary(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return appraisal_service.get_performance_summary(db, tenant_id)


@router.get(
    "/performance",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def list_performance(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    status: Optional[str] = None,
    review_period: Optional[str] = None,
    employee_id: Optional[int] = None,
):
    query = (
        db.query(Appraisal, Employee.name, Employee.department, Employee.role)
        .join(Employee, Appraisal.employee_id == Employee.id)
        .filter(Appraisal.tenant_id == tenant_id)
    )
    if status:
        query = query.filter(Appraisal.status == status)
    if review_period:
        query = query.filter(Appraisal.review_period == review_period)
    if employee_id:
        query = query.filter(Appraisal.employee_id == employee_id)

    results = query.order_by(Appraisal.reviewed_at.desc()).all()
    return [_fmt_appraisal(a, name, dept, role) for a, name, dept, role in results]


@router.get(
    "/performance/{appraisal_id}",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def get_appraisal(
    appraisal_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    row = (
        db.query(Appraisal, Employee.name, Employee.department, Employee.role)
        .join(Employee, Appraisal.employee_id == Employee.id)
        .filter(Appraisal.id == appraisal_id, Appraisal.tenant_id == tenant_id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Appraisal not found")
    a, name, dept, role = row
    return _fmt_appraisal(a, name, dept, role)


@router.post(
    "/performance",
    response_model=AppraisalResponse,
    dependencies=[Depends(require_permission("hrm.view"))],
)
def create_appraisal_api(
    data: AppraisalCreate,

    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    user=Depends(get_current_user)
):
    print(f"DEBUG: Creating appraisal for employee {data.employee_id} in tenant {tenant_id}")

    # Auto-compute overall score from categories if all are provided
    if all(v is not None for v in [
        data.communication_score, data.technical_score,
        data.teamwork_score, data.leadership_score
    ]):
        overall = appraisal_service.compute_overall_score(
            data.communication_score, data.technical_score,
            data.teamwork_score, data.leadership_score
        )
        print(f"DEBUG: Auto-computed overall score: {overall}")
    else:
        overall = data.score  # Use manually provided score
        print(f"DEBUG: Using manual score: {overall}")

    try:
        appraisal = Appraisal(
            tenant_id=tenant_id,
            reviewer_id=user.id,
            employee_id=data.employee_id,
            review_period=data.review_period,
            review_type=data.review_type or "MANAGER",
            communication_score=data.communication_score,
            technical_score=data.technical_score,
            teamwork_score=data.teamwork_score,
            leadership_score=data.leadership_score,
            score=overall,
            goals_achieved=data.goals_achieved,
            feedback=data.feedback,
            status=data.status or "PENDING",
        )
        db.add(appraisal)
        db.commit()
        db.refresh(appraisal)
        print(f"DEBUG: Created appraisal ID {appraisal.id}")
        return appraisal
    except Exception as e:
        db.rollback()
        print(f"ERROR creating appraisal: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")



@router.patch(
    "/performance/{appraisal_id}",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def update_appraisal(
    appraisal_id: int,
    data: AppraisalUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    appraisal = db.query(Appraisal).filter(
        Appraisal.id == appraisal_id,
        Appraisal.tenant_id == tenant_id
    ).first()
    if not appraisal:
        raise HTTPException(status_code=404, detail="Appraisal not found")

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appraisal, field, value)

    # Recompute overall if category scores changed
    cat_fields = ["communication_score", "technical_score", "teamwork_score", "leadership_score"]
    if any(f in update_data for f in cat_fields):
        comm  = float(appraisal.communication_score) if appraisal.communication_score is not None else None
        tech  = float(appraisal.technical_score)     if appraisal.technical_score     is not None else None
        team  = float(appraisal.teamwork_score)      if appraisal.teamwork_score      is not None else None
        lead  = float(appraisal.leadership_score)    if appraisal.leadership_score    is not None else None
        if all(v is not None for v in [comm, tech, team, lead]):
            appraisal.score = appraisal_service.compute_overall_score(comm, tech, team, lead)

    db.commit()
    db.refresh(appraisal)
    return appraisal


@router.delete(
    "/performance/{appraisal_id}",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def delete_appraisal(
    appraisal_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    appraisal = db.query(Appraisal).filter(
        Appraisal.id == appraisal_id,
        Appraisal.tenant_id == tenant_id
    ).first()
    if not appraisal:
        raise HTTPException(status_code=404, detail="Appraisal not found")
    db.delete(appraisal)
    db.commit()
    return {"message": "Appraisal deleted"}


# 🟪 RECRUITMENT
@router.get(
    "/recruitment/jobs",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def list_jobs(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    jobs = db.query(JobPosting).filter(JobPosting.tenant_id == tenant_id).all()
    
    res = []
    for job in jobs:
        dept = db.query(Department).filter(Department.id == job.department_id).first()
        apps = db.query(Application).filter(Application.job_id == job.id).all()
        res.append({
            "id": job.id,
            "title": job.title,
            "dept": dept.name if dept else "General",
            "type": job.type,
            "candidates": [
                {"id": a.id, "name": a.candidate_name, "email": a.email, "status": a.status}
                for a in apps
            ]
        })
    return res


@router.post(
    "/recruitment/jobs",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def create_job(
    data: JobPostingCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    job = JobPosting(**data.dict(), tenant_id=tenant_id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.post(
    "/recruitment/apply",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def create_application(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    app = Application(**data.dict(), tenant_id=tenant_id)
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.post(
    "/recruitment/hire",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def hire_candidate_api(
    application_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    app = db.query(Application).filter(Application.id == application_id, Application.tenant_id == tenant_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    job = db.query(JobPosting).filter(JobPosting.id == app.job_id).first()
    
    # Create employee record from application
    new_emp = Employee(
        tenant_id=tenant_id,
        name=app.candidate_name,
        email=app.email,
        department_id=job.department_id,
        department=db.query(Department).filter(Department.id == job.department_id).first().name if job.department_id else "General",
        role=job.title,
        basic_salary=0
    )
    db.add(new_emp)
    app.status = "HIRED"
    db.commit()
    return {"message": "Candidate hired and employee record created"}


@router.patch(
    "/recruitment/applications/{application_id}",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def update_application_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    """Update a candidate's application status: APPLIED | INTERVIEW | REJECTED | HIRED"""
    allowed = {"APPLIED", "INTERVIEW", "REJECTED", "HIRED"}
    if status not in allowed:
        raise HTTPException(status_code=400, detail=f"Status must be one of {allowed}")

    app = db.query(Application).filter(
        Application.id == application_id,
        Application.tenant_id == tenant_id,
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = status
    db.commit()
    db.refresh(app)
    return {"id": app.id, "status": app.status}


@router.delete(
    "/recruitment/jobs/{job_id}",
    dependencies=[Depends(require_permission("hrm.view"))],
)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    job = db.query(JobPosting).filter(
        JobPosting.id == job_id,
        JobPosting.tenant_id == tenant_id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job posting deleted"}

# 🟨 ESS (EMPLOYEE SELF-SERVICE) ROUTES
@router.get(
    "/my-profile",
    response_model=EmployeeResponse,
)
def get_my_profile(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    user=Depends(get_current_user)
):
    emp = db.query(Employee).filter(Employee.user_id == user.id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")
    return emp

@router.get("/my-attendance")
def get_my_attendance(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    emp = db.query(Employee).filter(Employee.user_id == user.id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")

    results = (
        db.query(Attendance, Employee.name, Employee.role, Employee.department)
        .join(Employee, Attendance.employee_id == Employee.id)
        .filter(Attendance.employee_id == emp.id, Attendance.tenant_id == tenant_id)
        .order_by(Attendance.punch_in.desc())
        .offset(skip).limit(limit).all()
    )
    
    return [
        {
            "id": att.id,
            "employee_id": att.employee_id,
            "name": name,
            "role": role,
            "department": department,
            "punch_in": att.punch_in,
            "punch_out": att.punch_out,
            "status": att.status
        }
        for att, name, role, department in results
    ]

@router.post("/my-attendance/punch")
def punch_my_attendance(
    action: str, # "IN" or "OUT"
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    user=Depends(get_current_user)
):
    emp = db.query(Employee).filter(Employee.user_id == user.id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")

    return process_attendance(
        db,
        tenant_id=tenant_id,
        employee_id=emp.id,
        action=action,
    )

@router.get("/my-leaves")
def get_my_leaves(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    emp = db.query(Employee).filter(Employee.user_id == user.id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")

    results = (
        db.query(LeaveRequest, Employee.name, Employee.role, Employee.department)
        .join(Employee, LeaveRequest.employee_id == Employee.id)
        .filter(LeaveRequest.employee_id == emp.id, LeaveRequest.tenant_id == tenant_id)
        .order_by(LeaveRequest.created_at.desc())
        .offset(skip).limit(limit).all()
    )
    
    return [
        {
            "id": lv.id,
            "employee_id": lv.employee_id,
            "name": name,
            "role": role,
            "department": department,
            "leave_type": lv.leave_type,
            "start_date": lv.start_date,
            "end_date": lv.end_date,
            "status": lv.status,
            "applied_at": lv.created_at
        }
        for lv, name, role, department in results
    ]

@router.post("/my-leaves")
def create_my_leave(
    data: LeaveCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    user=Depends(get_current_user)
):
    emp = db.query(Employee).filter(Employee.user_id == user.id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")
    
    # Override employee_id to ensure a user only creates a leave for themselves
    data.employee_id = emp.id

    leave = LeaveRequest(**data.dict(), tenant_id=tenant_id)
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

@router.get("/my-payroll")
def get_my_payroll(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    emp = db.query(Employee).filter(Employee.user_id == user.id, Employee.tenant_id == tenant_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")

    results = (
        db.query(Payroll, Employee.name, Employee.role)
        .join(Employee, Payroll.employee_id == Employee.id)
        .filter(Payroll.employee_id == emp.id, Payroll.tenant_id == tenant_id)
        .order_by(Payroll.generated_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": p.id,
            "employee_id": p.employee_id,
            "name": name,
            "role": role,
            "month": p.month,
            "gross": float(p.basic_salary + p.allowances),
            "net": float(p.net_salary),
            "status": "PROCESSED",
            "period": p.month,
            "generated_at": p.generated_at
        }
        for p, name, role in results
    ]
