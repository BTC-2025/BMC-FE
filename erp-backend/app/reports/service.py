from sqlalchemy.orm import Session
from sqlalchemy import text
from io import BytesIO

from openpyxl import Workbook
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def run_report(db: Session, query: str, params: dict):
    return db.execute(text(query), params).mappings().all()


def generate_excel(data: list, columns: list) -> bytes:
    wb = Workbook()
    ws = wb.active

    ws.append([col["label"] for col in columns])

    for row in data:
        ws.append([row.get(col["field"]) for col in columns])

    buffer = BytesIO()
    wb.save(buffer)
    return buffer.getvalue()


def generate_pdf(data: list, columns: list, title: str) -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)

    c.drawString(50, 750, title)
    y = 720

    for row in data:
        line = " | ".join(str(row.get(col["field"])) for col in columns)
        c.drawString(40, y, line)
        y -= 18
        if y < 40:
            c.showPage()
            y = 750

    c.save()
    return buffer.getvalue()
