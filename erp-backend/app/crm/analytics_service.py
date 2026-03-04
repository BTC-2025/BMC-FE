from sqlalchemy.orm import Session
from sqlalchemy import func
from app.crm.models import Lead, Deal


def get_crm_stats(db: Session, tenant_id: int):
    # -------------------------
    # PIPELINE VALUE
    # -------------------------
    pipeline_value = (
        db.query(func.coalesce(func.sum(Deal.value), 0))
        .filter(Deal.tenant_id == tenant_id)
        .filter(Deal.stage != "LOST")
        .scalar()
    )

    # -------------------------
    # DEALS BY STAGE
    # -------------------------
    deals_by_stage = dict(
        db.query(
            Deal.stage,
            func.count(Deal.id)
        )
        .filter(Deal.tenant_id == tenant_id)
        .group_by(Deal.stage)
        .all()
    )

    # -------------------------
    # LEAD CONVERSION RATE
    # -------------------------
    total_leads = db.query(func.count(Lead.id)).filter(Lead.tenant_id == tenant_id).scalar()
    converted_leads = (
        db.query(func.count(Lead.id))
        .filter(Lead.tenant_id == tenant_id)
        .filter(Lead.status == "CONVERTED")
        .scalar()
    )

    conversion_rate = (
        (converted_leads / total_leads) * 100
        if total_leads > 0 else 0
    )

    return {
        "pipeline_value": float(pipeline_value),
        "active_deals": sum(v for k, v in deals_by_stage.items() if k not in ["WON", "LOST"]),
        "won_deals": deals_by_stage.get("WON", 0),
        "deals_by_stage": deals_by_stage,
        "conversion_rate": round(conversion_rate, 2),
        "lead_stats": {
            "total": total_leads,
            "converted": converted_leads,
            "rate": round(conversion_rate, 2),
        },
    }
