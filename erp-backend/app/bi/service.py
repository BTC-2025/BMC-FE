from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.crm.models import Deal
from app.projects.models import Project
from app.inventory.models import Item
from app.inventory.service import get_stock_summary
from app.hrm.models import Payroll
from app.scm.models import PurchaseOrder


from app.bi.cache import cache_bi_stats

# -----------------------------
# KPI OVERVIEW (CACHED: 60s)
# -----------------------------
@cache_bi_stats(ttl=60)
def get_kpi_overview(db: Session, tenant_id: int):
    # Total Revenue (CRM)
    total_revenue = (
        db.query(func.coalesce(func.sum(Deal.value), 0))
        .filter(Deal.stage == "WON", Deal.tenant_id == tenant_id)
        .scalar()
    )

    # Active Projects
    active_projects = (
        db.query(func.count(Project.id))
        .filter(Project.status.in_(["PLANNING", "ACTIVE"]), Project.tenant_id == tenant_id)
        .scalar()
    )

    # Low Stock Count
    low_stock = 0
    stock_summary = get_stock_summary(db, tenant_id=tenant_id)
    for row in stock_summary:
        item = db.query(Item).filter(Item.id == row.item_id, Item.tenant_id == tenant_id).first()
        if item and row.current_stock < item.reorder_level:
            low_stock += 1

    # Latest Payroll Cost (HRM)
    latest_month = (
        db.query(func.max(Payroll.month))
        .filter(Payroll.tenant_id == tenant_id)
        .scalar()
    )

    total_payroll = (
        db.query(func.coalesce(func.sum(Payroll.net_salary), 0))
        .filter(Payroll.month == latest_month, Payroll.tenant_id == tenant_id)
        .scalar()
        if latest_month else 0
    )

    # Open Purchase Orders
    open_pos = (
        db.query(func.count(PurchaseOrder.id))
        .filter(PurchaseOrder.status != "CLOSED", PurchaseOrder.tenant_id == tenant_id)
        .scalar()
    )

    return {
        "total_revenue": float(total_revenue),
        "active_projects": active_projects,
        "low_stock_items": low_stock,
        "total_payroll_cost": float(total_payroll),
        "open_purchase_orders": open_pos,
    }


# -----------------------------
# REVENUE TREND (MONTHLY - CACHED: 300s)
# -----------------------------
@cache_bi_stats(ttl=300)
def get_revenue_trend(db: Session, tenant_id: int):
    rows = (
        db.query(
            extract("year", Deal.created_at).label("year"),
            extract("month", Deal.created_at).label("month"),
            func.sum(Deal.value).label("revenue"),
        )
        .filter(Deal.stage == "WON", Deal.tenant_id == tenant_id)
        .group_by("year", "month")
        .order_by("year", "month")
        .all()
    )

    return [
        {
            "year": int(row.year),
            "month": int(row.month),
            "revenue": float(row.revenue),
        }
        for row in rows
    ]
