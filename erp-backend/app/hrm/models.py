from sqlalchemy import (
    Column, Integer, String, Date, DateTime, ForeignKey, Numeric, Text, Boolean
)
from sqlalchemy.orm import relationship
from datetime import datetime, date

from app.core.database import Base


# -----------------------------
# DEPARTMENT
# -----------------------------
class Department(Base):
    __tablename__ = "hrm_departments"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)

    employees = relationship("Employee", back_populates="dept_link")


# -----------------------------
# EMPLOYEE
# -----------------------------
class Employee(Base):
    __tablename__ = "hrm_employees"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=True) # Added role field
    department = Column(String, nullable=False) # Legacy field, keeping for now
    department_id = Column(Integer, ForeignKey("hrm_departments.id"), nullable=True)
    basic_salary = Column(Numeric(12, 2), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    dept_link = relationship("Department", back_populates="employees")
    attendance = relationship("Attendance", back_populates="employee")
    leaves = relationship("LeaveRequest", back_populates="employee")
    payrolls = relationship("Payroll", back_populates="employee")
    appraisals = relationship("Appraisal", back_populates="employee")


# -----------------------------
# ATTENDANCE
# -----------------------------
class Attendance(Base):
    __tablename__ = "hrm_attendance"

    id = Column(Integer, primary_key=True)
    # Important: Usually inherited via Employee, but direct link is better for reporting
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    employee_id = Column(Integer, ForeignKey("hrm_employees.id"), nullable=False)

    punch_in = Column(DateTime, nullable=True)
    punch_out = Column(DateTime, nullable=True)
    status = Column(String, default="PRESENT")  # PRESENT | ABSENT | LEAVE

    employee = relationship("Employee", back_populates="attendance")


# -----------------------------
# LEAVE REQUEST
# -----------------------------
class LeaveRequest(Base):
    __tablename__ = "hrm_leaves"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    employee_id = Column(Integer, ForeignKey("hrm_employees.id"), nullable=False)

    leave_type = Column(String, nullable=False)  # CASUAL | SICK | PAID
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    status = Column(String, default="PENDING")  # PENDING | APPROVED | REJECTED
    approved_by = Column(Integer, nullable=True)

    employee = relationship("Employee", back_populates="leaves")


# -----------------------------
# PAYROLL
# -----------------------------
class Payroll(Base):
    __tablename__ = "hrm_payroll"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    employee_id = Column(Integer, ForeignKey("hrm_employees.id"), nullable=False)

    month = Column(String, nullable=False)  # YYYY-MM
    basic_salary = Column(Numeric(12, 2), nullable=False)
    deductions = Column(Numeric(12, 2), default=0)
    allowances = Column(Numeric(12, 2), default=0)
    net_salary = Column(Numeric(12, 2), nullable=False)

    generated_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="payrolls")


# -----------------------------
# APPRAISAL (PERFORMANCE)
# -----------------------------
class Appraisal(Base):
    __tablename__ = "hrm_appraisals"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    employee_id = Column(Integer, ForeignKey("hrm_employees.id"), nullable=False)

    # Review metadata
    review_period = Column(String, nullable=True)       # e.g. "Q1-2025", "Annual-2025"
    review_type = Column(String, default="MANAGER")     # SELF | MANAGER | 360

    # Category scores 0.0 – 5.0
    communication_score = Column(Numeric(3, 2), nullable=True)
    technical_score = Column(Numeric(3, 2), nullable=True)
    teamwork_score = Column(Numeric(3, 2), nullable=True)
    leadership_score = Column(Numeric(3, 2), nullable=True)

    # Overall (auto-computed or manual)
    score = Column(Numeric(3, 2), nullable=False)       # 0.0 – 5.0 overall
    goals_achieved = Column(Integer, nullable=True)     # 0–100 %

    feedback = Column(Text, nullable=True)
    status = Column(String, default="PENDING")          # PENDING | IN_PROGRESS | COMPLETED
    reviewed_at = Column(DateTime, default=datetime.utcnow)
    reviewer_id = Column(Integer, nullable=True)

    employee = relationship("Employee", back_populates="appraisals")


# -----------------------------
# RECRUITMENT (HIRING)
# -----------------------------
class JobPosting(Base):
    __tablename__ = "hrm_job_postings"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("hrm_departments.id"), nullable=True)
    type = Column(String, nullable=False)  # FULL_TIME | CONTRACT | INTERN
    status = Column(String, default="OPEN")  # OPEN | CLOSED

    applications = relationship("Application", back_populates="job")


class Application(Base):
    __tablename__ = "hrm_applications"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("hrm_job_postings.id"), nullable=False)
    
    candidate_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    status = Column(String, default="APPLIED")  # APPLIED | INTERVIEW | HIRED | REJECTED

    job = relationship("JobPosting", back_populates="applications")
