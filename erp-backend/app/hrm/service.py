from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime

from app.hrm.models import Attendance, Payroll, Employee, LeaveRequest
from sqlalchemy import extract


def process_attendance(
    db: Session,
    *,
    tenant_id: int,
    employee_id: int,
    action: str,  # IN | OUT
):
    record = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee_id,
            Attendance.tenant_id == tenant_id,
            Attendance.punch_out.is_(None)
        )
        .first()
    )

    if action == "IN":
        if record:
            raise HTTPException(status_code=400, detail="Already punched in")

        attendance = Attendance(
            employee_id=employee_id,
            tenant_id=tenant_id,
            punch_in=datetime.utcnow(),
            status="PRESENT",
        )
        db.add(attendance)

    elif action == "OUT":
        if not record:
            raise HTTPException(status_code=400, detail="No active punch-in")

        record.punch_out = datetime.utcnow()

    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    db.commit()
    return {"message": f"Punch {action} successful"}


def approve_leave(
    db: Session,
    *,
    leave_id: int,
    approver_id: int,
    tenant_id: int,
):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id, LeaveRequest.tenant_id == tenant_id).first()
    if not leave or leave.status != "PENDING":
        raise HTTPException(status_code=400, detail="Invalid leave request")

    leave.status = "APPROVED"
    leave.approved_by = approver_id
    db.commit()

    from app.core.audit.service import log_audit
    log_audit(
        db,
        tenant_id=tenant_id,
        module="HRM",
        action="APPROVE_LEAVE",
        reference_id=str(leave.id),
        user_id=approver_id
    )

    return leave


def calculate_monthly_payroll(
    db: Session,
    *,
    employee_id: int,
    month: str,  # YYYY-MM
    tenant_id: int,
):
    employee = db.query(Employee).filter(Employee.id == employee_id, Employee.tenant_id == tenant_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    year, mon = map(int, month.split("-"))

    approved_leaves = (
        db.query(LeaveRequest)
        .filter(
            LeaveRequest.employee_id == employee_id,
            LeaveRequest.tenant_id == tenant_id,
            LeaveRequest.status == "APPROVED",
            extract("year", LeaveRequest.start_date) == year,
            extract("month", LeaveRequest.start_date) == mon,
        )
        .all()
    )

    unpaid_days = 0
    for leave in approved_leaves:
        days = (leave.end_date - leave.start_date).days + 1
        if leave.leave_type != "PAID":
            unpaid_days += days

    daily_salary = employee.basic_salary / 30
    deductions = unpaid_days * daily_salary

    net_salary = employee.basic_salary - deductions

    payroll = Payroll(
        employee_id=employee_id,
        tenant_id=tenant_id,
        month=month,
        basic_salary=employee.basic_salary,
        deductions=deductions,
        allowances=0,
        net_salary=net_salary,
    )

    db.add(payroll)
    db.commit()
    db.refresh(payroll)

    from app.core.audit.service import log_audit
    log_audit(
        db,
        tenant_id=tenant_id,
        module="HRM",
        action="GENERATE_PAYROLL",
        reference_id=str(payroll.id),
        user_id=0,  # System/Admin triggered generally, or we could pass user_id
    )

    return payroll
