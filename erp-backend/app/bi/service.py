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

# -----------------------------
# BI INSIGHTS (DYNAMIC NLP)
# -----------------------------
def get_insights(db: Session, tenant_id: int):
    kpis = get_kpi_overview(db, tenant_id=tenant_id)
    revenue = get_revenue_trend(db, tenant_id=tenant_id)
    
    insights = []
    
    # Revenue insight
    total_rev = kpis.get("total_revenue", 0)
    if total_rev > 1000000:
        insights.append({"type": "POSITIVE", "text": f"Revenue is strong at ${total_rev:,.0f}. Enterprise targets met."})
    elif total_rev > 0:
        insights.append({"type": "NEUTRAL", "text": f"Steady growth observed. Current revenue: ${total_rev:,.0f}."})
    else:
        insights.append({"type": "WARNING", "text": "No revenue recorded for this period. Check WON deals in CRM."})
        
    # Stock insight
    low_stock = kpis.get("low_stock_items", 0)
    if low_stock > 5:
        insights.append({"type": "CRITICAL", "text": f"{low_stock} items are below reorder level. Supply chain action required immediately."})
    elif low_stock > 0:
        insights.append({"type": "WARNING", "text": f"{low_stock} items approaching low stock. Monitor inventory levels."})
    else:
        insights.append({"type": "POSITIVE", "text": "All stock levels are optimal. No immediate reordering needed."})
        
    # Operations insight
    open_pos = kpis.get("open_purchase_orders", 0)
    if open_pos > 10:
        insights.append({"type": "NEUTRAL", "text": f"High procurement activity with {open_pos} open POs. Logistics bottleneck possible."})
        
        
    return insights


# -----------------------------
# TOPOLOGY DATA (HIERARCHICAL ANALYTICS)
# -----------------------------
@cache_bi_stats(ttl=60)
def get_topology_data(db: Session, tenant_id: int):
    # This generates hierarchical data for the Analytics frontend drilldown
    
    # 1. CRM Pipeline (Deals by Stage)
    deals = db.query(Deal.stage, func.sum(Deal.value).label('value'), func.count(Deal.id).label('count')).filter(Deal.tenant_id == tenant_id).group_by(Deal.stage).all()
    pipeline_nodes = []
    for d in deals:
        pipeline_nodes.append({
            "id": d.stage,
            "label": d.stage,
            "value": float(d.value) if d.value else 0,
            "target": 500000, # Mock target for UI
            "childrenType": None
        })
        
    # 2. Inventory by Category
    items = db.query(Item.category, func.sum(Item.unit_price * Item.reorder_level).label('value')).filter(Item.tenant_id == tenant_id).group_by(Item.category).all()
    inventory_nodes = []
    for i in items:
        inventory_nodes.append({
            "id": i.category or "Uncategorized",
            "label": i.category or "Uncategorized",
            "value": float(i.value) if i.value else 0,
            "target": 100000,
            "childrenType": None
        })
        
    # 3. Projects by Status
    projects = db.query(Project.status, func.sum(Project.total_budget).label('value')).filter(Project.tenant_id == tenant_id).group_by(Project.status).all()
    project_nodes = []
    for p in projects:
        project_nodes.append({
            "id": p.status,
            "label": p.status,
            "value": float(p.value) if p.value else 0,
            "target": 200000,
            "childrenType": None
        })

    return {
        "CRM Pipeline": pipeline_nodes,
        "Inventory Value": inventory_nodes,
        "Project Budgets": project_nodes,
    }
