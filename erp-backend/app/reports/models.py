from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base


class ReportTemplate(Base):
    __tablename__ = "report_templates"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    name = Column(String, nullable=False)
    module = Column(String, nullable=False)  # finance, inventory, crm
    query_template = Column(Text, nullable=False)

    columns = Column(JSON, nullable=False)
    filters = Column(JSON, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
