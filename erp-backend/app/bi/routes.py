from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.permissions import require_permission
from app.bi.service import get_kpi_overview, get_revenue_trend
from app.core.tenant.context import get_current_tenant_id

from app.core.ratelimit import limiter
from fastapi import Request

from app.billing.context import require_bi_access

router = APIRouter(prefix="/bi", tags=["Business Intelligence"])

# 🟩 KPI DASHBOARD (LITE + ENTERPRISE)
# Note: In our model, even Lite/Free plan users might see stats if their plan allows it.
# But for this step, we assume ALL BI is gated by "bi" module access.
@router.get(
    "/dashboard",
    dependencies=[
        Depends(require_permission("bi.view_stats")),
        Depends(require_bi_access)
    ],
)
@limiter.limit("100/minute")
def dashboard(
    request: Request, 
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return get_kpi_overview(db, tenant_id=tenant_id)

# 🟦 REVENUE TREND (ENTERPRISE)
@router.get(
    "/revenue-trend",
    dependencies=[
        Depends(require_permission("bi.view_stats")),
        Depends(require_bi_access)
    ],
)
@limiter.limit("10/minute")
def revenue_trend(
    request: Request, 
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return get_revenue_trend(db, tenant_id=tenant_id)

@router.get(
    "/revenue",
    dependencies=[
        Depends(require_permission("bi.view_stats")),
        Depends(require_bi_access)
    ],
)
def revenue_endpoint(
    request: Request, 
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return get_revenue_trend(db, tenant_id=tenant_id)

@router.get(
    "/operations",
    dependencies=[
        Depends(require_permission("bi.view_stats")),
        Depends(require_bi_access)
    ],
)
def operations_endpoint(
    request: Request, 
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    # For now, operations returns a combination of KPIs filtered for operational focus
    full_kpis = get_kpi_overview(db, tenant_id=tenant_id)
    return {
        "active_projects": full_kpis["active_projects"],
        "low_stock_items": full_kpis["low_stock_items"],
        "open_purchase_orders": full_kpis["open_purchase_orders"],
    }

# 🟧 EXPORT (REAL CSV)
@router.get(
    "/export",
    dependencies=[
        Depends(require_permission("bi.view_stats")),
        Depends(require_bi_access)
    ],
)
def export_dashboard(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    import csv
    import io
    from fastapi.responses import StreamingResponse

    # 1. Fetch Data
    kpis = get_kpi_overview(db, tenant_id=tenant_id)
    revenue = get_revenue_trend(db, tenant_id=tenant_id)

    # 2. Create CSV Buffer
    output = io.StringIO()
    writer = csv.writer(output)

    # 3. Write Headers & Metadata
    writer.writerow(["BI Export", "Generated from ERP System"])
    writer.writerow(["Tenant ID", tenant_id])
    writer.writerow([])
    
    # 4. Write KPI Section
    writer.writerow(["--- KPI OVERVIEW ---"])
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Total Revenue", kpis.get("total_revenue", 0)])
    writer.writerow(["Payroll Cost", kpis.get("total_payroll_cost", 0)])
    writer.writerow(["Active Projects", kpis.get("active_projects", 0)])
    writer.writerow(["Open POs", kpis.get("open_purchase_orders", 0)])
    writer.writerow([])

    # 5. Write Revenue Trend Section
    writer.writerow(["--- REVENUE TREND ---"])
    writer.writerow(["Month", "Year", "Revenue"])
    for r in revenue:
        writer.writerow([r.get("month"), r.get("year"), r.get("revenue")])

    # 6. Return Stream
    output.seek(0)
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=bi_export.csv"
    return response
