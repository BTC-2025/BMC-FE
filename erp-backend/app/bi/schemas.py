from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_revenue: float
    active_projects: int
    low_stock_items: int
    total_payroll_cost: float
    open_purchase_orders: int
