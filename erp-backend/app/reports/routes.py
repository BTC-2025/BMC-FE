from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse

from app.core.database import get_db
from app.auth.dependencies import get_current_user # fixed to match common pattern in this project
from app.reports.models import ReportTemplate
from app.reports.service import run_report, generate_excel, generate_pdf
from app.core.tenant.context import get_current_tenant_id

router = APIRouter(prefix="/reports", tags=["Reports"])

# ▶ Run Report (JSON)
@router.post("/{report_id}/run")
def run_report_api(
    report_id: int,
    filters: dict,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    template = (
        db.query(ReportTemplate)
        .filter(
            ReportTemplate.id == report_id,
            ReportTemplate.tenant_id == tenant_id,
        )
        .first()
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    filters["tenant_id"] = tenant_id

    data = run_report(db, template.query_template, filters)
    return {"data": data}

# 📊 Export Excel
@router.get("/{report_id}/export/excel")
def export_excel(
    report_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    template = db.query(ReportTemplate).filter(ReportTemplate.id == report_id, ReportTemplate.tenant_id == tenant_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
        
    data = run_report(db, template.query_template, {"tenant_id": tenant_id})

    excel = generate_excel(data, template.columns)
    return StreamingResponse(
        iter([excel]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={template.name}.xlsx"},
    )

# 📄 Export PDF
@router.get("/{report_id}/export/pdf")
def export_pdf(
    report_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    template = db.query(ReportTemplate).filter(ReportTemplate.id == report_id, ReportTemplate.tenant_id == tenant_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
        
    data = run_report(db, template.query_template, {"tenant_id": tenant_id})

    pdf = generate_pdf(data, template.columns, template.name)
    return StreamingResponse(
        iter([pdf]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={template.name}.pdf"},
    )
