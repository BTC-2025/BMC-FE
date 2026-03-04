"""
Appraisal business-logic helpers.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.hrm.models import Appraisal, Employee


# Weight map for category scores (must sum to 1.0)
WEIGHTS = {
    "communication_score": 0.25,
    "technical_score":     0.30,
    "teamwork_score":      0.25,
    "leadership_score":    0.20,
}


def compute_overall_score(
    communication: Optional[float],
    technical: Optional[float],
    teamwork: Optional[float],
    leadership: Optional[float],
) -> float:
    """
    Weighted average of the 4 category scores.
    Falls back to simple mean for any missing values.
    Returns 0.0 if all are None.
    """
    values = {
        "communication_score": communication,
        "technical_score":     technical,
        "teamwork_score":      teamwork,
        "leadership_score":    leadership,
    }

    present = {k: v for k, v in values.items() if v is not None}
    if not present:
        return 0.0

    total_weight = sum(WEIGHTS[k] for k in present)
    weighted_sum = sum(WEIGHTS[k] * float(v) for k, v in present.items())
    return round(float(weighted_sum / total_weight), 2)


def get_performance_summary(db: Session, tenant_id: int) -> dict:
    """
    Returns aggregate statistics for the tenant's appraisals:
      - total_reviews
      - average_score
      - pending_count
      - in_progress_count
      - completed_count
      - top_performers (list of employee_id + name + score)
    """
    appraisals = (
        db.query(Appraisal)
        .filter(Appraisal.tenant_id == tenant_id)
        .all()
    )

    if not appraisals:
        return {
            "total_reviews": 0,
            "average_score": 0.0,
            "pending_count": 0,
            "in_progress_count": 0,
            "completed_count": 0,
            "top_performers": [],
        }

    scores = [float(a.score) for a in appraisals]
    avg = round(float(sum(scores) / len(scores)), 2)

    pending   = sum(1 for a in appraisals if a.status == "PENDING")
    in_prog   = sum(1 for a in appraisals if a.status == "IN_PROGRESS")
    completed = sum(1 for a in appraisals if a.status == "COMPLETED")

    # Top 3 performers (highest score, completed only)
    completed_appraisals: list[Appraisal] = sorted(
        [a for a in appraisals if a.status == "COMPLETED"],
        key=lambda a: float(a.score),
        reverse=True,
    )
    completed_appraisals = completed_appraisals[:3]

    top_performers = []
    for a in completed_appraisals:
        emp = db.query(Employee).filter(Employee.id == a.employee_id).first()
        top_performers.append({
            "employee_id": a.employee_id,
            "name":        emp.name if emp else f"Employee #{a.employee_id}",
            "score":       float(a.score),
        })

    return {
        "total_reviews":     len(appraisals),
        "average_score":     avg,
        "pending_count":     pending,
        "in_progress_count": in_prog,
        "completed_count":   completed,
        "top_performers":    top_performers,
    }
